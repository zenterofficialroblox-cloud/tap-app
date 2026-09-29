alter table public.profiles drop constraint if exists profile_lengths;
alter table public.profiles
  add constraint profile_lengths
  check (char_length(display_name) <= 40 and char_length(bio) <= 1000);

create or replace function public.set_featured_badges(codes text[])
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  if coalesce(array_length(codes,1),0)>100 then raise exception 'Too many equipped badges'; end if;
  if coalesce(array_length(codes,1),0)<>(select count(distinct code) from unnest(codes) code) then
    raise exception 'Duplicate badge';
  end if;
  if exists(select 1 from unnest(codes) code where not exists(
    select 1 from public.user_badges ub join public.badges b on b.id=ub.badge_id
    where ub.user_id=auth.uid() and b.code=code
  )) then raise exception 'Badge not earned'; end if;
  update public.user_badges set featured_position=null where user_id=auth.uid();
  update public.user_badges ub set featured_position=chosen.position
  from (select b.id,row_number() over(order by picked.ord)::smallint position
    from unnest(codes) with ordinality picked(code,ord)
    join public.badges b on b.code=picked.code) chosen
  where ub.user_id=auth.uid() and ub.badge_id=chosen.id;
end;
$$;
grant execute on function public.set_featured_badges(text[]) to authenticated;
