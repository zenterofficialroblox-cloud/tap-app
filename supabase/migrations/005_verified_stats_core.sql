-- TAP 0.5A Verified Stats Core. Apply after 004_stabilization_hardening.sql.
create type public.verified_metric_type as enum ('COUNT','BIG_COUNT','TIME','RATIO','SCORE');
create type public.stat_refresh_status as enum ('idle','pending','success','error','cooldown','unavailable');
create type public.stat_source_kind as enum ('official_api','oauth','verified_server');

create table public.verified_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid references public.connections(id) on delete cascade,
  provider_id text not null,
  metric_key text not null check(metric_key ~ '^[a-z0-9_]{1,64}$'),
  metric_value numeric not null check(metric_value>=0),
  metric_label text not null check(char_length(metric_label)<=60),
  metric_type public.verified_metric_type not null default 'COUNT',
  is_verified boolean not null default true check(is_verified),
  source_kind public.stat_source_kind not null,
  last_refreshed_at timestamptz,
  next_refresh_eligible_at timestamptz,
  refresh_status public.stat_refresh_status not null default 'idle',
  last_error text check(last_error is null or char_length(last_error)<=240),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(user_id,provider_id,metric_key)
);
create index verified_stats_user_provider on public.verified_stats(user_id,provider_id);
create index verified_stats_refresh_queue on public.verified_stats(next_refresh_eligible_at) where refresh_status in ('idle','success','cooldown');

create table public.verified_stat_snapshots (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  connection_id uuid references public.connections(id) on delete cascade,
  provider_id text not null, metric_key text not null,
  metric_value numeric not null check(metric_value>=0), captured_at timestamptz not null default now()
);
create index verified_snapshots_history on public.verified_stat_snapshots(user_id,provider_id,metric_key,captured_at desc);

create table public.verified_xp_sources (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider_id text not null, metric_key text not null, milestone_key text not null,
  xp_awarded integer not null check(xp_awarded>0), created_at timestamptz not null default now(),
  unique(user_id,provider_id,metric_key,milestone_key)
);
create index verified_xp_user on public.verified_xp_sources(user_id);

alter table public.verified_stats enable row level security;
alter table public.verified_stat_snapshots enable row level security;
alter table public.verified_xp_sources enable row level security;
create policy verified_stats_owner_read on public.verified_stats for select to authenticated using(auth.uid()=user_id);
create policy verified_snapshots_owner_read on public.verified_stat_snapshots for select to authenticated using(auth.uid()=user_id);
create policy verified_xp_owner_read on public.verified_xp_sources for select to authenticated using(auth.uid()=user_id);

-- Only trusted server-side code may write verified values or awards. The client
-- receives read access but intentionally has no insert/update/delete policies.
create or replace function public.get_verified_xp_summary()
returns jsonb language sql security definer set search_path=public stable as $$
  select jsonb_build_object(
    'verified_xp',coalesce(sum(v.xp_awarded),0),
    'total_xp',coalesce((select p.xp from public.profiles p where p.user_id=auth.uid()),0)
  ) from public.verified_xp_sources v where v.user_id=auth.uid();
$$;
revoke all on function public.get_verified_xp_summary() from public;
grant execute on function public.get_verified_xp_summary() to authenticated;

-- Atomic, idempotent milestone award primitive for trusted Edge Functions.
create or replace function public.award_verified_xp(target_user uuid,target_provider text,target_metric text,target_milestone text,award_amount integer)
returns integer language plpgsql security definer set search_path=public as $$
declare inserted_count integer;
begin
  if award_amount<=0 then raise exception 'Invalid XP award'; end if;
  insert into public.verified_xp_sources(user_id,provider_id,metric_key,milestone_key,xp_awarded)
  values(target_user,target_provider,target_metric,target_milestone,award_amount)
  on conflict(user_id,provider_id,metric_key,milestone_key) do nothing;
  get diagnostics inserted_count=row_count;
  if inserted_count=1 then update public.profiles set xp=xp+award_amount,updated_at=now() where user_id=target_user; end if;
  return case when inserted_count=1 then award_amount else 0 end;
end;
$$;
revoke all on function public.award_verified_xp(uuid,text,text,text,integer) from public;
grant execute on function public.award_verified_xp(uuid,text,text,text,integer) to service_role;
