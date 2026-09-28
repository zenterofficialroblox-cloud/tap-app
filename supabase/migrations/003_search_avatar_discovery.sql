alter table public.profiles
  add column if not exists avatar_mode text not null default 'initials'
    check (avatar_mode in ('default','initials','custom')),
  add column if not exists default_avatar_id text not null default 'violet'
    check (default_avatar_id in ('violet','ocean','sunset','neon','frost')),
  add column if not exists discoverable boolean not null default true;

alter table public.connections add column if not exists custom_icon_url text;
alter table public.connections add constraint custom_icon_https
  check (custom_icon_url is null or custom_icon_url ~ '^https://');

create index if not exists profiles_search_username_idx on public.profiles(lower(username) text_pattern_ops)
  where discoverable and onboarding_complete;
create index if not exists profiles_search_display_idx on public.profiles(lower(display_name) text_pattern_ops)
  where discoverable and onboarding_complete;

create or replace function public.search_profiles(search_query text, result_limit integer default 20)
returns table(
  username text, display_name text, avatar_url text, avatar_mode text,
  default_avatar_id text, level integer, is_private boolean
) language sql security definer set search_path=public stable as $$
  select p.username,p.display_name,
    case when p.avatar_mode='custom' then p.avatar_url else null end,
    p.avatar_mode,p.default_avatar_id,
    case when p.visibility='public' then floor(sqrt(greatest(p.xp,0)/100.0))::integer+1 else null end,
    p.visibility='private'
  from public.profiles p
  where p.discoverable and p.onboarding_complete and p.username is not null
    and length(trim(search_query))>=2
    and (p.username ilike trim(search_query)||'%' or p.display_name ilike '%'||trim(search_query)||'%')
  order by
    case when p.username=lower(trim(search_query)) then 0 when p.username ilike trim(search_query)||'%' then 1 else 2 end,
    p.username
  limit least(greatest(result_limit,1),20);
$$;
revoke all on function public.search_profiles(text,integer) from public;
grant execute on function public.search_profiles(text,integer) to authenticated;

-- Public-profile responses include only the avatar presentation fields.
create or replace function public.get_public_profile(requested_username text, requested_card text default 'main')
returns jsonb language plpgsql security definer set search_path=public stable as $$
declare result jsonb; profile_row public.profiles%rowtype;
begin
  select * into profile_row from public.profiles where username=lower(requested_username) and onboarding_complete=true;
  if not found then return jsonb_build_object('status','not_found'); end if;
  if profile_row.visibility='private' then return jsonb_build_object('status','private'); end if;
  select jsonb_build_object(
    'status','public','username',profile_row.username,'display_name',profile_row.display_name,
    'bio',profile_row.bio,'avatar_url',profile_row.avatar_url,'avatar_mode',profile_row.avatar_mode,
    'default_avatar_id',profile_row.default_avatar_id,'accent_color',profile_row.accent_color,
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
      'handle',x.handle,'mode',x.connection_mode,'position',cc.position,'icon_url',x.custom_icon_url) order by cc.position)
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

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('connection-icons','connection-icons',true,1048576,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set file_size_limit=1048576,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
create policy connection_icon_owner_insert on storage.objects for insert to authenticated
with check(bucket_id='connection-icons' and (storage.foldername(name))[1]=auth.uid()::text);
create policy connection_icon_owner_update on storage.objects for update to authenticated
using(bucket_id='connection-icons' and (storage.foldername(name))[1]=auth.uid()::text)
with check(bucket_id='connection-icons' and (storage.foldername(name))[1]=auth.uid()::text);
create policy connection_icon_owner_delete on storage.objects for delete to authenticated
using(bucket_id='connection-icons' and (storage.foldername(name))[1]=auth.uid()::text);
create policy connection_icon_public_read on storage.objects for select using(bucket_id='connection-icons');
