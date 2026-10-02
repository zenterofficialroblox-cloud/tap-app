alter table public.profiles
  add column if not exists theme_variant smallint;

alter table public.profiles drop constraint if exists profiles_theme_known;
alter table public.profiles add constraint profiles_theme_known check (theme_id in (
  'default','neon','galaxy','pixel','frost','sunset','ocean','forest','rose','lavender',
  'cyber','matrix','ruby','sapphire','amber','mint','cotton','bubble','lime','peach',
  'midnight','aurora','volcano','meadow','sand'
)) not valid;
alter table public.profiles validate constraint profiles_theme_known;

-- Existing accounts receive a stable weighted fallback immediately. The same
-- account always maps to the same result if this migration is replayed.
update public.profiles
set theme_variant = case
  when (('x' || substr(md5(user_id::text), 1, 8))::bit(32)::bigint % 100) < 36 then 0
  when (('x' || substr(md5(user_id::text), 1, 8))::bit(32)::bigint % 100) < 61 then 1
  when (('x' || substr(md5(user_id::text), 1, 8))::bit(32)::bigint % 100) < 79 then 2
  when (('x' || substr(md5(user_id::text), 1, 8))::bit(32)::bigint % 100) < 91 then 3
  when (('x' || substr(md5(user_id::text), 1, 8))::bit(32)::bigint % 100) < 97 then 4
  else 5
end
where theme_variant is null;

alter table public.profiles alter column theme_variant set default null;
alter table public.profiles add constraint profiles_theme_variant_range check (theme_variant between 0 and 5) not valid;
alter table public.profiles validate constraint profiles_theme_variant_range;

create or replace function public.lock_profile_theme_variant()
returns trigger language plpgsql security definer set search_path=public as $$
declare roll integer;
begin
  if tg_op = 'INSERT' and new.theme_variant is null then
    roll := floor(random() * 100);
    new.theme_variant := case when roll < 36 then 0 when roll < 61 then 1 when roll < 79 then 2 when roll < 91 then 3 when roll < 97 then 4 else 5 end;
  elsif tg_op = 'UPDATE' and new.theme_variant is distinct from old.theme_variant and auth.role() <> 'service_role' then
    new.theme_variant := old.theme_variant;
  end if;
  return new;
end;$$;

drop trigger if exists lock_profile_theme_variant on public.profiles;
create trigger lock_profile_theme_variant before insert or update on public.profiles
for each row execute function public.lock_profile_theme_variant();

create or replace function public.get_public_profile(requested_username text, requested_card text default 'main')
returns jsonb language plpgsql security definer set search_path=public stable as $$
declare result jsonb; profile_row public.profiles%rowtype;
begin
 if lower(trim(requested_username))='example' then return jsonb_build_object('status','not_found'); end if;
 select * into profile_row from public.profiles where username=lower(requested_username) and onboarding_complete=true;
 if not found then return jsonb_build_object('status','not_found'); end if;
 if profile_row.visibility='private' then return jsonb_build_object('status','private'); end if;
 select jsonb_build_object('status','public','username',profile_row.username,'display_name',profile_row.display_name,'bio',profile_row.bio,
  'avatar_url',case when profile_row.avatar_mode='photo' and profile_row.avatar_url ~ '^https://' then profile_row.avatar_url else null end,
  'avatar_mode',profile_row.avatar_mode,'default_avatar_id',profile_row.default_avatar_id,'avatar_icon_id',profile_row.avatar_icon_id,
  'avatar_icon_color',profile_row.avatar_icon_color,'avatar_background_color',profile_row.avatar_background_color,'avatar_background_color_2',profile_row.avatar_background_color_2,
  'accent_color',profile_row.accent_color,'theme_id',profile_row.theme_id,'theme_variant',profile_row.theme_variant,'xp',profile_row.xp,
  'featured_badges',coalesce((select jsonb_agg(b.code order by ub.featured_position) from public.user_badges ub join public.badges b on b.id=ub.badge_id where ub.user_id=profile_row.user_id and ub.featured_position is not null),'[]'::jsonb),
  'available_cards',coalesce((select jsonb_agg(jsonb_build_object('slug',c.slug,'name',c.name,'type',c.type) order by c.position) from public.cards c where c.user_id=profile_row.user_id and c.visible),'[]'::jsonb),
  'card',coalesce((select jsonb_build_object('slug',c.slug,'name',c.name,'type',c.type) from public.cards c where c.user_id=profile_row.user_id and c.slug=requested_card and c.visible limit 1),(select jsonb_build_object('slug',c.slug,'name',c.name,'type',c.type) from public.cards c where c.user_id=profile_row.user_id and c.slug='main' and c.visible limit 1)),
  'connections',coalesce((select jsonb_agg(jsonb_build_object('provider',x.provider,'display_label',x.display_label,'profile_url',x.profile_url,'handle',x.handle,'mode',x.connection_mode,'position',cc.position,'custom_icon_url',x.custom_icon_url,
   'verified_stats',(select coalesce(jsonb_agg(jsonb_build_object('metric_key',vs.metric_key,'metric_value',vs.metric_value,'metric_label',vs.metric_label,'last_refreshed_at',vs.last_refreshed_at)),'[]'::jsonb) from public.verified_stats vs where vs.connection_id=x.id and vs.is_public)) order by cc.position)
   from public.cards c join public.card_connections cc on cc.card_id=c.id and cc.enabled join public.connections x on x.id=cc.connection_id and x.visible where c.user_id=profile_row.user_id and c.visible and c.slug=coalesce((select slug from public.cards where user_id=profile_row.user_id and slug=requested_card and visible limit 1),'main')),'[]'::jsonb)
 ) into result; return result;
end;$$;
revoke all on function public.get_public_profile(text,text) from public;
grant execute on function public.get_public_profile(text,text) to anon,authenticated;
