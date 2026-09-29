alter table public.card_connections
  add column if not exists enabled boolean not null default true;

create index if not exists card_connections_card_enabled_position_idx
  on public.card_connections(card_id, enabled, position);

create table if not exists public.provider_oauth_states(
  state_hash text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider_id text not null check(provider_id in('github','youtube')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
alter table public.provider_oauth_states enable row level security;
-- No client policy: OAuth state is created and consumed only by service-role functions.
create index if not exists provider_oauth_states_expiry_idx
  on public.provider_oauth_states(expires_at);

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
   from public.cards c join public.card_connections cc on cc.card_id=c.id and cc.enabled join public.connections x on x.id=cc.connection_id and x.visible where c.user_id=profile_row.user_id and c.visible and c.slug=coalesce((select slug from public.cards where user_id=profile_row.user_id and slug=requested_card and visible limit 1),'main')),'[]'::jsonb)
 ) into result; return result;
end;$$;
revoke all on function public.get_public_profile(text,text) from public;
grant execute on function public.get_public_profile(text,text) to anon,authenticated;
