-- Migration 006 changed accepted avatar values but retained legacy defaults.
alter table public.profiles
  alter column avatar_mode set default 'preset',
  alter column default_avatar_id set default 'cosmic',
  alter column avatar_icon_id set default 'orbit',
  alter column avatar_icon_color set default '#FFFFFF',
  alter column avatar_background_color set default '#6D4AFF';

insert into public.profiles(user_id, username, display_name, onboarding_complete)
select u.id, null, '', false
from auth.users u
left join public.profiles p on p.user_id=u.id
where p.user_id is null
on conflict (user_id) do nothing;

insert into public.cards(user_id, slug, name, type, visible, position)
select p.user_id, 'main', 'MAIN', 'main', true, 0
from public.profiles p
left join public.cards c on c.user_id=p.user_id and c.slug='main'
where c.id is null
on conflict (user_id,slug) do nothing;
