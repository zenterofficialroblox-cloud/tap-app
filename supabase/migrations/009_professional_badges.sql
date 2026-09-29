-- A persistent 100-badge catalog with server-controlled unlock evaluation.
insert into public.badges(code,name,description,rarity,icon,secret,rule_metadata,sort_order) values
('first-tap','FIRST TAP','Share your profile for the first time.','COMMON','share',false,'{"family":"sharing"}',1),
('connected','CONNECTED','Connect your first supported account.','COMMON','link',false,'{"family":"network"}',2),
('social','SOCIAL','Build a social presence across multiple networks.','RARE','users',false,'{"family":"social"}',3),
('creator','CREATOR','Add a creator or media profile.','RARE','sparkles',false,'{"family":"creator"}',4),
('dev','DEV','Connect a developer identity.','EPIC','code',false,'{"family":"developer"}',5),
('100-taps','100 TAPS','Your profile reached 100 opens.','RARE','eye',false,'{"family":"popular","target":100}',6),
('1k','1K CLUB','Your profile reached 1,000 opens.','LEGENDARY','crown',false,'{"family":"popular","target":1000}',7),
('og','OG','One of TAP''s early identities.','SECRET','star',true,'{"family":"legacy"}',8)
on conflict(code) do update set name=excluded.name,description=excluded.description,rarity=excluded.rarity,icon=excluded.icon,rule_metadata=excluded.rule_metadata,sort_order=excluded.sort_order;

with families as (
 select * from (values
  (0,'identity','IDENTITY'),(1,'network','NETWORK'),(2,'explorer','EXPLORER'),(3,'collector','COLLECTOR'),(4,'socialist','SOCIAL'),
  (5,'gamer','GAMER'),(6,'builder','BUILDER'),(7,'artist','CREATOR'),(8,'popular','POPULAR'),(9,'veteran','VETERAN')
 ) f(idx,slug,title)
), generated as (
 select n,f.slug,f.title,(n/10)+1 tier from generate_series(0,91) n join families f on f.idx=(n%10)
)
insert into public.badges(code,name,description,rarity,icon,secret,rule_metadata,sort_order)
select slug||'-'||lpad(tier::text,2,'0'),title||' '||tier,
 'Progress through '||lower(title)||' activities in TAP — milestone '||tier||'.',
 case when n<20 then 'COMMON' when n<40 then 'UNCOMMON' when n<60 then 'RARE' when n<80 then 'EPIC' else 'LEGENDARY' end,
 slug,false,jsonb_build_object('family',slug,'tier',tier),9+n
from generated
on conflict(code) do update set name=excluded.name,description=excluded.description,rarity=excluded.rarity,icon=excluded.icon,rule_metadata=excluded.rule_metadata,sort_order=excluded.sort_order;

create or replace function public.refresh_user_badges()
returns void language plpgsql security definer set search_path=public as $$
declare uid uuid:=auth.uid(); pid uuid; connection_count integer; social_count integer; creator_count integer; dev_count integer; gaming_count integer; opens integer; shares integer; account_days integer; xp_total integer;
begin
 if uid is null then raise exception 'Authentication required'; end if;
 select id,xp,greatest(0,extract(day from now()-created_at)::integer) into pid,xp_total,account_days from profiles where user_id=uid;
 select count(*),count(*) filter(where provider in('instagram','facebook','threads','x','tiktok','snapchat','linkedin','reddit','bluesky','mastodon')),count(*) filter(where provider in('youtube','twitch','spotify','soundcloud','vimeo','patreon','kofi')),count(*) filter(where provider in('github','gitlab','codeberg','gitea','bitbucket','npm','replit','codepen')),count(*) filter(where provider in('minecraft','roblox','steam','xbox','playstation','epic','battlenet','fortnite','valorant')) into connection_count,social_count,creator_count,dev_count,gaming_count from connections where user_id=uid;
 select count(*) filter(where event_type='profile_open'),count(*) filter(where event_type='share') into opens,shares from analytics_events where analytics_events.profile_id=pid;
 insert into user_badges(user_id,badge_id)
 select uid,b.id from badges b where
  (b.code='first-tap' and shares>=1) or (b.code='connected' and connection_count>=1) or (b.code='social' and social_count>=3) or
  (b.code='creator' and creator_count>=1) or (b.code='dev' and dev_count>=1) or (b.code='100-taps' and opens>=100) or (b.code='1k' and opens>=1000) or
  (b.code like 'identity-%' and xp_total>=coalesce((b.rule_metadata->>'tier')::integer,99)*250) or
  (b.code like 'network-%' and connection_count>=coalesce((b.rule_metadata->>'tier')::integer,99)) or
  (b.code like 'socialist-%' and social_count>=coalesce((b.rule_metadata->>'tier')::integer,99)) or
  (b.code like 'gamer-%' and gaming_count>=coalesce((b.rule_metadata->>'tier')::integer,99)) or
  (b.code like 'builder-%' and dev_count>=coalesce((b.rule_metadata->>'tier')::integer,99)) or
  (b.code like 'artist-%' and creator_count>=coalesce((b.rule_metadata->>'tier')::integer,99)) or
  (b.code like 'popular-%' and opens>=coalesce((b.rule_metadata->>'tier')::integer,99)*100) or
  (b.code like 'veteran-%' and account_days>=coalesce((b.rule_metadata->>'tier')::integer,99)*30)
 on conflict(user_id,badge_id) do nothing;
end;$$;
revoke all on function public.refresh_user_badges() from public;
grant execute on function public.refresh_user_badges() to authenticated;
