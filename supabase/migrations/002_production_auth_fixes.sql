-- Production auth/persistence hardening. Safe to run after 001_initial.sql.

alter table public.profiles alter column username drop not null;
alter table public.connections alter column profile_url drop not null;

create or replace function public.is_reserved_username(value text)
returns boolean language sql immutable parallel safe as $$
  select lower(value) = any(array[
    'admin','administrator','api','app','auth','login','logout','register','signup',
    'support','help','tap','settings','profile','profiles','u','user','users','example'
  ]);
$$;

alter table public.profiles drop constraint if exists username_format;
alter table public.profiles drop constraint if exists username_lowercase;
alter table public.profiles add constraint username_format
  check (username is null or username ~ '^[a-z0-9_.]{3,24}$');
alter table public.profiles add constraint username_lowercase
  check (username is null or username = lower(username));
alter table public.profiles add constraint username_not_reserved
  check (username is null or not public.is_reserved_username(username));

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists card_connections_connection_idx on public.card_connections(connection_id);
create index if not exists user_badges_user_idx on public.user_badges(user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(user_id, username, display_name, onboarding_complete)
  values (new.id, null, '', false)
  on conflict (user_id) do nothing;
  insert into public.cards(user_id, slug, name, type, visible, position)
  values (new.id, 'main', 'MAIN', 'main', true, 0)
  on conflict (user_id, slug) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Backfill the mandatory Main card for existing accounts.
insert into public.cards(user_id, slug, name, type, visible, position)
select p.user_id, 'main', 'MAIN', 'main', true, 0 from public.profiles p
on conflict (user_id, slug) do nothing;

drop policy if exists card_connections_owner_all on public.card_connections;
create policy card_connections_owner_all on public.card_connections for all to authenticated
using (
  exists(select 1 from public.cards c where c.id=card_id and c.user_id=auth.uid())
  and exists(select 1 from public.connections x where x.id=connection_id and x.user_id=auth.uid())
)
with check (
  exists(select 1 from public.cards c where c.id=card_id and c.user_id=auth.uid())
  and exists(select 1 from public.connections x where x.id=connection_id and x.user_id=auth.uid())
);

drop policy if exists user_badges_owner_update on public.user_badges;
-- Badge grants remain server controlled. Owners can only select their own earned badges.
create policy user_badges_owner_feature on public.user_badges for update to authenticated
using(auth.uid()=user_id) with check(auth.uid()=user_id);

create or replace function public.username_available(candidate text)
returns boolean language sql security definer set search_path=public stable as $$
  select candidate ~ '^[a-z0-9_.]{3,24}$'
    and candidate = lower(candidate)
    and not public.is_reserved_username(candidate)
    and not exists(select 1 from public.profiles where username=lower(candidate) and user_id<>coalesce(auth.uid(),'00000000-0000-0000-0000-000000000000'::uuid));
$$;
grant execute on function public.username_available(text) to anon, authenticated;

create or replace function public.set_featured_badges(codes text[])
returns void language plpgsql security definer set search_path=public as $$
begin
  if coalesce(array_length(codes,1),0)>3 then raise exception 'A maximum of three badges may be featured'; end if;
  if exists(select 1 from unnest(codes) code where not exists(
    select 1 from public.user_badges ub join public.badges b on b.id=ub.badge_id
    where ub.user_id=auth.uid() and b.code=code
  )) then raise exception 'Badge not earned'; end if;
  update public.user_badges set featured_position=null where user_id=auth.uid();
  update public.user_badges ub set featured_position=chosen.position
  from (select b.id,row_number() over()::smallint position from unnest(codes) with ordinality picked(code,ord)
    join public.badges b on b.code=picked.code order by picked.ord) chosen
  where ub.user_id=auth.uid() and ub.badge_id=chosen.id;
end;
$$;
grant execute on function public.set_featured_badges(text[]) to authenticated;

create or replace function public.get_public_profile(requested_username text, requested_card text default 'main')
returns jsonb language plpgsql security definer set search_path=public stable as $$
declare result jsonb; profile_row public.profiles%rowtype;
begin
  select * into profile_row from public.profiles where username=lower(requested_username) and onboarding_complete=true;
  if not found then return jsonb_build_object('status','not_found'); end if;
  if profile_row.visibility='private' then return jsonb_build_object('status','private'); end if;
  select jsonb_build_object(
    'status','public','username',profile_row.username,'display_name',profile_row.display_name,
    'bio',profile_row.bio,'avatar_url',profile_row.avatar_url,'accent_color',profile_row.accent_color,
    'theme_id',profile_row.theme_id,'xp',profile_row.xp,
    'featured_badges',coalesce((select jsonb_agg(b.code order by ub.featured_position)
      from public.user_badges ub join public.badges b on b.id=ub.badge_id
      where ub.user_id=profile_row.user_id and ub.featured_position is not null),'[]'::jsonb),
    'card',coalesce((select jsonb_build_object('slug',c.slug,'name',c.name,'type',c.type)
      from public.cards c where c.user_id=profile_row.user_id and c.slug=requested_card and c.visible limit 1),
      (select jsonb_build_object('slug',c.slug,'name',c.name,'type',c.type)
       from public.cards c where c.user_id=profile_row.user_id and c.slug='main' and c.visible limit 1)),
    'connections',coalesce((select jsonb_agg(jsonb_build_object(
      'id',x.id,'provider',x.provider,'display_label',x.display_label,'profile_url',x.profile_url,
      'handle',x.handle,'mode',x.connection_mode,'position',cc.position) order by cc.position)
      from public.cards c join public.card_connections cc on cc.card_id=c.id
      join public.connections x on x.id=cc.connection_id and x.visible
      where c.user_id=profile_row.user_id and c.visible
        and c.slug=coalesce((select slug from public.cards where user_id=profile_row.user_id and slug=requested_card and visible limit 1),'main')),'[]'::jsonb)
  ) into result;
  return result;
end;
$$;
revoke all on function public.get_public_profile(text,text) from public;
grant execute on function public.get_public_profile(text,text) to anon, authenticated;

drop policy if exists avatar_owner_update on storage.objects;
drop policy if exists avatar_owner_delete on storage.objects;
create policy avatar_owner_update on storage.objects for update to authenticated
using(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text)
with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy avatar_owner_delete on storage.objects for delete to authenticated
using(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);

revoke update(xp, user_id) on public.profiles from authenticated;
revoke insert, delete on public.user_badges from authenticated;
