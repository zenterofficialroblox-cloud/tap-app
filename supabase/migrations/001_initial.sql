create extension if not exists pgcrypto;
create type public.profile_visibility as enum ('public','private');
create type public.connection_mode as enum ('oauth','manual');

create table public.profiles (
  id uuid primary key default gen_random_uuid(), user_id uuid not null unique references auth.users(id) on delete cascade,
  username text not null, display_name text not null default '', bio text not null default '', avatar_url text,
  accent_color text not null default '#8b5cf6', theme_id text not null default 'default', visibility profile_visibility not null default 'public',
  xp integer not null default 0 check (xp >= 0), onboarding_complete boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9_.]{3,24}$'), constraint username_lowercase check (username = lower(username)),
  constraint profile_lengths check (char_length(display_name) <= 40 and char_length(bio) <= 160)
);
create unique index profiles_username_ci on public.profiles(lower(username));

create table public.connections (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null, connection_mode connection_mode not null, handle text not null default '', display_label text not null,
  profile_url text not null check (profile_url ~ '^https://'), avatar_url text, imported_public_data jsonb not null default '{}'::jsonb,
  visible boolean not null default true, position integer not null default 0 check(position >= 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint connection_lengths check(char_length(handle)<=100 and char_length(display_label)<=50 and char_length(profile_url)<=2048)
);
create index connections_user_order on public.connections(user_id,position);

create table public.cards (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null check(slug ~ '^[a-z0-9-]{1,32}$'), name text not null check(char_length(name)<=32), type text not null default 'main', visible boolean not null default true,
  position integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(user_id,slug)
);
create index cards_user_order on public.cards(user_id,position);
create table public.card_connections (card_id uuid references public.cards(id) on delete cascade, connection_id uuid references public.connections(id) on delete cascade, position integer not null default 0, primary key(card_id,connection_id));

create table public.badges (id uuid primary key default gen_random_uuid(), code text not null unique, name text not null, description text not null, rarity text not null, icon text not null default 'sparkles', secret boolean not null default false, rule_metadata jsonb not null default '{}', sort_order integer not null default 0);
create table public.user_badges (user_id uuid references auth.users(id) on delete cascade, badge_id uuid references public.badges(id) on delete cascade, unlocked_at timestamptz not null default now(), featured_position smallint check(featured_position between 1 and 3), primary key(user_id,badge_id));
create table public.analytics_events (id bigint generated always as identity primary key, profile_id uuid not null references public.profiles(id) on delete cascade, event_type text not null check(event_type in ('profile_open','connection_click','share')), source text check(source in ('direct','link','qr','system')), card_slug text, connection_id uuid references public.connections(id) on delete set null, session_hash text, occurred_at timestamptz not null default now());
create index analytics_profile_time on public.analytics_events(profile_id,occurred_at desc);

alter table public.profiles enable row level security; alter table public.connections enable row level security; alter table public.cards enable row level security; alter table public.card_connections enable row level security; alter table public.badges enable row level security; alter table public.user_badges enable row level security; alter table public.analytics_events enable row level security;
create policy profiles_owner_select on public.profiles for select to authenticated using(auth.uid()=user_id);
create policy profiles_owner_insert on public.profiles for insert to authenticated with check(auth.uid()=user_id);
create policy profiles_owner_update on public.profiles for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy profiles_owner_delete on public.profiles for delete to authenticated using(auth.uid()=user_id);
create policy connections_owner_all on public.connections for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy cards_owner_all on public.cards for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy card_connections_owner_all on public.card_connections for all to authenticated using(exists(select 1 from public.cards c where c.id=card_id and c.user_id=auth.uid())) with check(exists(select 1 from public.cards c where c.id=card_id and c.user_id=auth.uid()));
create policy badges_read on public.badges for select using(not secret or auth.role()='authenticated');
create policy user_badges_owner_select on public.user_badges for select to authenticated using(auth.uid()=user_id);
create policy user_badges_owner_update on public.user_badges for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy analytics_owner_read on public.analytics_events for select to authenticated using(exists(select 1 from public.profiles p where p.id=profile_id and p.user_id=auth.uid()));

create or replace function public.get_public_profile(requested_username text, requested_card text default 'main') returns jsonb language sql security definer set search_path=public stable as $$
  select jsonb_build_object('username',p.username,'display_name',p.display_name,'bio',p.bio,'avatar_url',p.avatar_url,'accent_color',p.accent_color,'theme_id',p.theme_id,'xp',p.xp,'card',jsonb_build_object('slug',c.slug,'name',c.name),'connections',coalesce(jsonb_agg(jsonb_build_object('provider',x.provider,'display_label',x.display_label,'profile_url',x.profile_url,'mode',x.connection_mode) order by cc.position) filter(where x.id is not null),'[]'::jsonb))
  from profiles p left join cards c on c.user_id=p.user_id and c.slug=requested_card and c.visible left join card_connections cc on cc.card_id=c.id left join connections x on x.id=cc.connection_id and x.visible where p.username=lower(requested_username) and p.visibility='public' group by p.id,c.id;
$$;
grant execute on function public.get_public_profile(text,text) to anon, authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('avatars','avatars',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy avatar_owner_insert on storage.objects for insert to authenticated with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy avatar_owner_update on storage.objects for update to authenticated using(bucket_id='avatars' and owner_id=auth.uid()::text) with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
create policy avatar_owner_delete on storage.objects for delete to authenticated using(bucket_id='avatars' and owner_id=auth.uid()::text);
create policy avatar_public_read on storage.objects for select using(bucket_id='avatars');

revoke update(xp) on public.profiles from authenticated;
revoke insert, update, delete on public.badges from anon, authenticated;
revoke insert, update, delete on public.user_badges from anon, authenticated;
