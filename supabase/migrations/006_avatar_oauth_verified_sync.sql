-- TAP avatar modes and server-owned provider accounts. Apply after 005.
alter table public.profiles drop constraint if exists profiles_avatar_mode_check;
alter table public.profiles drop constraint if exists profiles_default_avatar_id_check;
update public.profiles set avatar_mode=case when avatar_mode='custom' then 'photo' else 'preset' end,
  default_avatar_id=case default_avatar_id when 'neon' then 'robot' when 'sunset' then 'fox' when 'frost' then 'crystal' when 'ocean' then 'pixel' else 'cosmic' end;
alter table public.profiles
  add constraint profiles_avatar_mode_check check(avatar_mode in('photo','preset','icon')),
  add constraint profiles_default_avatar_id_check check(default_avatar_id in('cosmic','robot','fox','crystal','pixel')),
  add column if not exists avatar_icon_id text not null default 'orbit' check(avatar_icon_id in('orbit','bolt','gamepad','headphones','code')),
  add column if not exists avatar_icon_color text not null default '#FFFFFF' check(avatar_icon_color ~ '^#[0-9A-Fa-f]{6}$'),
  add column if not exists avatar_background_color text not null default '#6D4AFF' check(avatar_background_color ~ '^#[0-9A-Fa-f]{6}$'),
  add column if not exists avatar_background_color_2 text check(avatar_background_color_2 is null or avatar_background_color_2 ~ '^#[0-9A-Fa-f]{6}$');

create table public.provider_accounts(
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 connection_id uuid not null references public.connections(id) on delete cascade,
 provider_id text not null, provider_account_id text not null, username text, display_name text,
 access_token text not null, refresh_token text, token_expires_at timestamptz, scopes text[] not null default '{}',
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(user_id,provider_id,provider_account_id),unique(connection_id)
);
alter table public.provider_accounts enable row level security;
-- Intentionally no client policies: only service-role Edge Functions can access tokens.
alter table public.verified_stats add column if not exists is_public boolean not null default false;

create or replace function public.set_verified_stat_visibility(target_connection uuid,make_public boolean)
returns void language sql security definer set search_path=public as $$
 update public.verified_stats set is_public=make_public,updated_at=now()
 where connection_id=target_connection and user_id=auth.uid();
$$;
revoke all on function public.set_verified_stat_visibility(uuid,boolean) from public;
grant execute on function public.set_verified_stat_visibility(uuid,boolean) to authenticated;

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
  'accent_color',profile_row.accent_color,'theme_id',profile_row.theme_id,'xp',profile_row.xp,
  'featured_badges',coalesce((select jsonb_agg(b.code order by ub.featured_position) from public.user_badges ub join public.badges b on b.id=ub.badge_id where ub.user_id=profile_row.user_id and ub.featured_position is not null),'[]'::jsonb),
  'card',coalesce((select jsonb_build_object('slug',c.slug,'name',c.name,'type',c.type) from public.cards c where c.user_id=profile_row.user_id and c.slug=requested_card and c.visible limit 1),(select jsonb_build_object('slug',c.slug,'name',c.name,'type',c.type) from public.cards c where c.user_id=profile_row.user_id and c.slug='main' and c.visible limit 1)),
  'connections',coalesce((select jsonb_agg(jsonb_build_object('provider',x.provider,'display_label',x.display_label,'profile_url',x.profile_url,'handle',x.handle,'mode',x.connection_mode,'position',cc.position,'custom_icon_url',x.custom_icon_url,
   'verified_stats',(select coalesce(jsonb_agg(jsonb_build_object('metric_key',vs.metric_key,'metric_value',vs.metric_value,'metric_label',vs.metric_label,'last_refreshed_at',vs.last_refreshed_at)),'[]'::jsonb) from public.verified_stats vs where vs.connection_id=x.id and vs.is_public)) order by cc.position)
   from public.cards c join public.card_connections cc on cc.card_id=c.id join public.connections x on x.id=cc.connection_id and x.visible where c.user_id=profile_row.user_id and c.visible and c.slug=coalesce((select slug from public.cards where user_id=profile_row.user_id and slug=requested_card and visible limit 1),'main')),'[]'::jsonb)
 ) into result; return result;
end;$$;
revoke all on function public.get_public_profile(text,text) from public;
grant execute on function public.get_public_profile(text,text) to anon,authenticated;
