-- Replace the legacy generated catalog with TAP's canonical 100 semantic badges.
create temporary table tap_legacy_badges(user_id uuid,new_code text) on commit drop;
insert into tap_legacy_badges(user_id,new_code)
select ub.user_id,case b.code
  when 'first-tap' then 'shared-identity' when 'connected' then 'first-connection'
  when 'social' then 'community-thread' when 'creator' then 'creator-channel'
  when 'dev' then 'source-flame' when '100-taps' then 'attention-magnet'
  when '1k' then 'open-gateway' end
from public.user_badges ub join public.badges b on b.id=ub.badge_id
where b.code in('first-tap','connected','social','creator','dev','100-taps','1k');

delete from public.badges;

with catalog as (
 select code,ordinality::integer sort_order from unnest(array[
 'launch-spark','first-imprint','profile-signature','face-forward','chromatic-pulse','style-architect','first-connection','connected-core','identity-collector','woven-network',
 'card-crafter','dual-identity','card-architect','fine-curator','intentional-layout','clean-selection','essential-only','searchable-signal','public-beacon','shared-identity',
 'qr-messenger','copy-ready','cross-device','first-impression','quiet-wave','attention-magnet','open-gateway','social-anchor','community-thread','creator-channel',
 'visual-stream','audio-trail','author-voice','supporter-bridge','source-flame','repository-soul','deployment-trail','maker-mindset','design-thread','package-pathfinder',
 'gaming-imprint','spawn-point','lobby-link','achievement-hunter','ranked-soul','world-builder','mod-forge','pixel-nomad','crossworld-identity','complete-signal',
 'private-step','silent-guardian','half-shadow','visibility-keeper','hidden-link','selective-exposure','secure-return','session-keeper','verified-source','trusted-channel',
 'trusted-pair','real-identity-link','fresh-verification','background-guard','stable-sync','data-trail','measured-trust','verified-presence','verified-spectrum','public-by-choice',
 'private-by-choice','privacy-mix','safe-avatar','clean-link','smart-validation','account-recovery','fresh-credential','verified-display','controlled-profile','trust-layer',
 'first-level-up','momentum','profile-charge','category-hopper','four-worlds','quick-connect','smart-drop','provider-hunter','theme-explorer','color-alchemist',
 'iconic-identity','avatar-explorer','polished-presence','minimal-signal','profile-orbit','cloud-footprint','metric-climber','living-profile','tap-aura','profile-apex'
 ]::text[]) with ordinality item(code,ordinality)
), pending as (select unnest(array['fine-curator','qr-messenger','copy-ready','cross-device','visibility-keeper','secure-return','session-keeper','background-guard','stable-sync','smart-validation','account-recovery','fresh-credential','momentum','quick-connect','smart-drop','provider-hunter','theme-explorer','avatar-explorer','cloud-footprint']::text[]) code)
insert into public.badges(code,name,description,rarity,icon,secret,rule_metadata,sort_order)
select c.code,
 case c.code when 'qr-messenger' then 'QR Messenger' when 'tap-aura' then 'TAP Aura' else initcap(replace(c.code,'-',' ')) end,
 'See the TAP badge guide for the complete unlock condition.',
 case when c.sort_order<=50 then 'PROFILE' when c.sort_order<=80 then 'SECURITY' else 'FUN' end,
 '/badges/'||c.code||'.png',false,
 jsonb_build_object('category',case when c.sort_order<=50 then 'Profile' when c.sort_order<=80 then 'Security' else 'Fun' end,'rule_id','badge.'||c.code,'status',case when p.code is null then 'automatic' else 'pending' end),c.sort_order
from catalog c left join pending p using(code);

insert into public.user_badges(user_id,badge_id)
select distinct legacy.user_id,b.id from tap_legacy_badges legacy join public.badges b on b.code=legacy.new_code
on conflict(user_id,badge_id) do nothing;

alter table public.user_badges drop constraint if exists user_badges_featured_position_check;
alter table public.user_badges add constraint user_badges_featured_position_check check(featured_position between 1 and 100);

create or replace function public.refresh_user_badges()
returns void language plpgsql security definer set search_path=public as $$
declare
 uid uuid:=auth.uid(); p profiles%rowtype; connection_count integer:=0; category_count integer:=0;
 social_count integer:=0; creator_count integer:=0; dev_count integer:=0; gaming_count integer:=0;
 card_count integer:=0; opens integer:=0; shares integer:=0; oauth_count integer:=0;
 verified_provider_count integer:=0; snapshots integer:=0; xp_awards integer:=0;
 hidden_count integer:=0; public_metrics integer:=0; private_metrics integer:=0;
begin
 if uid is null then raise exception 'Authentication required'; end if;
 select * into p from profiles where user_id=uid;
 if not found then return; end if;
 select count(*),
  count(*) filter(where provider in('instagram','facebook','threads','x','tiktok','snapchat','linkedin','reddit','bluesky','mastodon','discord','telegram','whatsapp','signal')),
  count(*) filter(where provider in('youtube','twitch','spotify','soundcloud','vimeo','patreon','kofi','substack','medium','devto','hashnode')),
  count(*) filter(where provider in('github','gitlab','codeberg','gitea','bitbucket','npm','pypi','replit','codepen','vercel','netlify','figma','behance','dribbble')),
  count(*) filter(where provider in('minecraft','roblox','steam','xbox','playstation','epic','battlenet','fortnite','valorant','itchio','modrinth','curseforge'))
 into connection_count,social_count,creator_count,dev_count,gaming_count from connections where user_id=uid;
 category_count:=(case when social_count>0 then 1 else 0 end)+(case when creator_count>0 then 1 else 0 end)+(case when dev_count>0 then 1 else 0 end)+(case when gaming_count>0 then 1 else 0 end);
 select count(*) into card_count from cards where user_id=uid;
 select count(*) into hidden_count from card_connections cc join cards c on c.id=cc.card_id join connections x on x.id=cc.connection_id where c.user_id=uid and not x.visible;
 select count(*) filter(where event_type='profile_open'),count(*) filter(where event_type='share') into opens,shares from analytics_events where profile_id=p.id;
 select count(*) into oauth_count from provider_accounts where user_id=uid;
 select count(distinct provider_id),count(*) filter(where is_public),count(*) filter(where not is_public) into verified_provider_count,public_metrics,private_metrics from verified_stats where user_id=uid and is_verified;
 select count(*) into snapshots from verified_stat_snapshots where user_id=uid;
 select count(*) into xp_awards from verified_xp_sources where user_id=uid;
 insert into user_badges(user_id,badge_id)
 select uid,b.id from badges b where
  (b.code='launch-spark' and p.onboarding_complete) or
  (b.code='first-imprint' and p.username<>'' and p.display_name<>'' and p.bio<>'') or
  (b.code='profile-signature' and p.visibility='public' and p.onboarding_complete) or
  (b.code='face-forward' and p.avatar_mode in('photo','preset','icon')) or
  (b.code='chromatic-pulse' and lower(p.accent_color)<>'#8b5cf6') or (b.code='style-architect' and p.theme_id<>'default') or
  (b.code='first-connection' and connection_count>=1) or (b.code='connected-core' and connection_count>=3) or (b.code='identity-collector' and connection_count>=10) or
  (b.code='woven-network' and category_count>=3) or (b.code='card-crafter' and card_count>=2) or (b.code='dual-identity' and card_count>=2) or (b.code='card-architect' and card_count>=5) or
  (b.code in('intentional-layout','clean-selection','hidden-link','selective-exposure') and hidden_count>=1) or
  (b.code in('essential-only','minimal-signal') and exists(select 1 from cards c where c.user_id=uid and c.visible and (select count(*) from card_connections cc where cc.card_id=c.id)<connection_count)) or
  (b.code='searchable-signal' and p.discoverable) or (b.code='public-beacon' and opens>=1) or (b.code='shared-identity' and shares>=1) or
  (b.code='first-impression' and opens>=10) or (b.code='quiet-wave' and opens>=50) or (b.code='attention-magnet' and opens>=100) or (b.code='open-gateway' and opens>=1000) or
  (b.code='social-anchor' and social_count>=1) or (b.code='community-thread' and social_count>=3) or (b.code='creator-channel' and creator_count>=1) or
  (b.code='visual-stream' and exists(select 1 from connections where user_id=uid and provider in('youtube','twitch','vimeo','tiktok'))) or
  (b.code='audio-trail' and exists(select 1 from connections where user_id=uid and provider in('spotify','soundcloud','applemusic','bandcamp'))) or
  (b.code='author-voice' and exists(select 1 from connections where user_id=uid and provider in('medium','substack','devto','hashnode','gitbook'))) or
  (b.code='supporter-bridge' and exists(select 1 from connections where user_id=uid and provider in('patreon','kofi','buymeacoffee'))) or
  (b.code='source-flame' and dev_count>=1) or (b.code='repository-soul' and exists(select 1 from connections where user_id=uid and provider in('github','gitlab','codeberg','gitea','bitbucket'))) or
  (b.code='deployment-trail' and exists(select 1 from connections where user_id=uid and provider in('vercel','netlify','railway','render','cloudflare'))) or (b.code='maker-mindset' and dev_count>=3) or
  (b.code='design-thread' and exists(select 1 from connections where user_id=uid and provider in('figma','behance','dribbble'))) or
  (b.code='package-pathfinder' and exists(select 1 from connections where user_id=uid and provider in('npm','pypi','docker','producthunt'))) or
  (b.code in('gaming-imprint','spawn-point') and gaming_count>=1) or (b.code='lobby-link' and exists(select 1 from connections where user_id=uid and provider in('steam','xbox','playstation','epic','battlenet','discord'))) or
  (b.code='achievement-hunter' and exists(select 1 from connections where user_id=uid and provider in('steam','xbox','playstation','epic'))) or
  (b.code='ranked-soul' and exists(select 1 from connections where user_id=uid and provider in('valorant','leagueoflegends','faceit','battlenet'))) or
  (b.code='world-builder' and exists(select 1 from connections where user_id=uid and provider in('minecraft','roblox','fortnite'))) or
  (b.code='mod-forge' and exists(select 1 from connections where user_id=uid and provider in('modrinth','curseforge'))) or (b.code='pixel-nomad' and gaming_count>=3) or
  (b.code='crossworld-identity' and social_count>=1 and gaming_count>=1 and (dev_count>=1 or creator_count>=1)) or
  (b.code='complete-signal' and p.visibility='public' and connection_count>=2 and card_count>=1 and p.avatar_mode in('photo','preset','icon')) or
  (b.code='private-step' and p.visibility='private') or (b.code='silent-guardian' and p.visibility='private' and not p.discoverable) or (b.code='half-shadow' and p.visibility='private' and p.discoverable) or
  (b.code='safe-avatar' and p.avatar_mode='photo' and p.avatar_url~'^https://') or (b.code='clean-link' and exists(select 1 from connections where user_id=uid and profile_url~'^https://')) or
  (b.code='verified-source' and verified_provider_count>=1) or (b.code='trusted-channel' and oauth_count>=1) or (b.code='trusted-pair' and oauth_count>=2) or
  (b.code in('real-identity-link','fresh-verification','verified-display') and exists(select 1 from verified_stats where user_id=uid and refresh_status='success')) or
  (b.code='data-trail' and snapshots>=1) or (b.code='measured-trust' and xp_awards>=1) or (b.code='verified-presence' and verified_provider_count>=2) or (b.code='verified-spectrum' and verified_provider_count>=3) or
  (b.code='public-by-choice' and public_metrics>=1) or (b.code='private-by-choice' and private_metrics>=1) or (b.code='privacy-mix' and public_metrics>=1 and private_metrics>=1) or
  (b.code='controlled-profile' and hidden_count>=1 and not p.discoverable) or (b.code='trust-layer' and oauth_count>=1 and verified_provider_count>=1 and (hidden_count>=1 or not p.discoverable)) or
  (b.code='first-level-up' and p.xp>=100) or (b.code='profile-charge' and p.xp>=1000) or (b.code='category-hopper' and category_count>=3) or (b.code='four-worlds' and category_count=4) or
  (b.code='color-alchemist' and lower(p.accent_color)<>'#8b5cf6') or (b.code='iconic-identity' and p.avatar_mode='icon') or
  (b.code='polished-presence' and p.theme_id<>'default' and lower(p.accent_color)<>'#8b5cf6' and p.avatar_mode in('photo','icon')) or
  (b.code='profile-orbit' and category_count>=3 and p.theme_id<>'default') or (b.code='metric-climber' and xp_awards>=2) or
  (b.code='living-profile' and p.visibility='public' and exists(select 1 from verified_stats where user_id=uid and last_refreshed_at>now()-interval '30 days')) or
  (b.code='tap-aura' and p.visibility='public' and p.theme_id<>'default' and card_count>=1 and connection_count>=3) or
  (b.code='profile-apex' and p.visibility='public' and shares>=1 and connection_count>=3 and card_count>=2 and verified_provider_count>=1)
 on conflict(user_id,badge_id) do nothing;
end;$$;
revoke all on function public.refresh_user_badges() from public;
grant execute on function public.refresh_user_badges() to authenticated;
