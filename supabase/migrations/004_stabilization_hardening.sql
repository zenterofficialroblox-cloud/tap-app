-- Final production hardening: literal search, stricter presentation data, and a
-- smaller public-profile payload. Run this migration after 003.

alter table public.profiles
  add constraint profiles_accent_hex check (accent_color ~ '^#[0-9A-Fa-f]{6}$') not valid,
  add constraint profiles_theme_known check (theme_id in ('default','neon','galaxy','pixel','frost')) not valid,
  add constraint profiles_avatar_https check (avatar_url is null or avatar_url ~ '^https://') not valid;

create or replace function public.search_profiles(search_query text, result_limit integer default 20)
returns table(
  username text, display_name text, avatar_url text, avatar_mode text,
  default_avatar_id text, level integer, is_private boolean
) language plpgsql security definer set search_path=public stable as $$
declare
  query_text text := trim(search_query);
  needle text;
begin
  if length(query_text) < 2 or query_text !~ '[[:alnum:]]' then return; end if;
  needle := replace(replace(replace(query_text, E'\\', E'\\\\'), '%', E'\\%'), '_', E'\\_');
  return query
    select p.username,p.display_name,
      case when p.avatar_mode='custom' and p.avatar_url ~ '^https://' then p.avatar_url else null end,
      p.avatar_mode,p.default_avatar_id,
      case when p.visibility='public' then floor(sqrt(greatest(p.xp,0)/100.0))::integer+1 else null end,
      p.visibility='private'
    from public.profiles p
    where p.discoverable and p.onboarding_complete and p.username is not null
      and (p.username ilike needle||'%' escape E'\\' or p.display_name ilike '%'||needle||'%' escape E'\\')
    order by case when p.username=lower(query_text) then 0 when p.username ilike needle||'%' escape E'\\' then 1 else 2 end,p.username
    limit least(greatest(result_limit,1),20);
end;
$$;
revoke all on function public.search_profiles(text,integer) from public;
grant execute on function public.search_profiles(text,integer) to authenticated;

create or replace function public.get_public_profile(requested_username text, requested_card text default 'main')
returns jsonb language plpgsql security definer set search_path=public stable as $$
declare result jsonb; profile_row public.profiles%rowtype;
begin
  if lower(trim(requested_username))='example' then return jsonb_build_object('status','not_found'); end if;
  select * into profile_row from public.profiles where username=lower(requested_username) and onboarding_complete=true;
  if not found then return jsonb_build_object('status','not_found'); end if;
  if profile_row.visibility='private' then return jsonb_build_object('status','private'); end if;
  select jsonb_build_object(
    'status','public','username',profile_row.username,'display_name',profile_row.display_name,
    'bio',profile_row.bio,'avatar_url',case when profile_row.avatar_url ~ '^https://' then profile_row.avatar_url else null end,
    'avatar_mode',profile_row.avatar_mode,'default_avatar_id',profile_row.default_avatar_id,
    'accent_color',profile_row.accent_color,'theme_id',profile_row.theme_id,'xp',profile_row.xp,
    'featured_badges',coalesce((select jsonb_agg(b.code order by ub.featured_position)
      from public.user_badges ub join public.badges b on b.id=ub.badge_id
      where ub.user_id=profile_row.user_id and ub.featured_position is not null),'[]'::jsonb),
    'card',coalesce((select jsonb_build_object('slug',c.slug,'name',c.name,'type',c.type)
      from public.cards c where c.user_id=profile_row.user_id and c.slug=requested_card and c.visible limit 1),
      (select jsonb_build_object('slug',c.slug,'name',c.name,'type',c.type)
       from public.cards c where c.user_id=profile_row.user_id and c.slug='main' and c.visible limit 1)),
    'connections',coalesce((select jsonb_agg(jsonb_build_object(
      'provider',x.provider,'display_label',x.display_label,'profile_url',x.profile_url,
      'handle',x.handle,'mode',x.connection_mode,'position',cc.position,'custom_icon_url',x.custom_icon_url) order by cc.position)
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
