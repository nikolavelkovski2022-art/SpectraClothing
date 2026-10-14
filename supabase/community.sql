create table if not exists public.community_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.community_admins enable row level security;
grant select on public.community_admins to authenticated;

create policy "Admins can view their own membership"
  on public.community_admins
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_community_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.community_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_community_admin() from public;
grant execute on function public.is_community_admin() to authenticated;

create table if not exists public.community_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_path text not null unique,
  display_name text not null check (char_length(display_name) between 2 and 40),
  vehicle text not null check (char_length(vehicle) between 2 and 80),
  story text not null check (char_length(story) between 8 and 500),
  instagram text check (instagram is null or char_length(instagram) <= 40),
  publication_consent boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users (id)
);

alter table public.community_submissions enable row level security;
revoke all on public.community_submissions from anon, authenticated;
grant select (id, image_path, display_name, vehicle, story, instagram, status, created_at)
  on public.community_submissions to anon;
grant select (id, user_id, image_path, display_name, vehicle, story, instagram, status, created_at)
  on public.community_submissions to authenticated;
grant insert (user_id, image_path, display_name, vehicle, story, instagram, publication_consent, status)
  on public.community_submissions to authenticated;
grant update (status, reviewed_at, reviewed_by)
  on public.community_submissions to authenticated;

create policy "Anyone can view approved community builds"
  on public.community_submissions
  for select
  to anon, authenticated
  using (status = 'approved');

create policy "Members can view their own submissions"
  on public.community_submissions
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "Community admins can view every submission"
  on public.community_submissions
  for select
  to authenticated
  using ((select public.is_community_admin()));

create policy "Members can submit a pending build for themselves"
  on public.community_submissions
  for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and publication_consent is true
    and status = 'pending'
    and reviewed_at is null
    and reviewed_by is null
    and image_path ~ (
      '^' || (select auth.uid())::text || '/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp)$'
    )
  );

create policy "Only community admins can review submissions"
  on public.community_submissions
  for update
  to authenticated
  using ((select public.is_community_admin()))
  with check (
    (select public.is_community_admin())
    and status in ('approved', 'rejected')
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-photos',
  'community-photos',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Members can upload images to their own folder"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'community-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and array_length(storage.foldername(name), 1) = 1
    and storage.filename(name) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|jpeg|png|webp)$'
  );

create policy "Members and admins can read pending review images"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'community-photos'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or (select public.is_community_admin())
    )
  );

create policy "Approved community images can be signed for display"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'community-photos'
    and exists (
      select 1
      from public.community_submissions
      where community_submissions.image_path = storage.objects.name
        and community_submissions.status = 'approved'
    )
  );

create policy "Only community admins can remove community images"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'community-photos'
    and (select public.is_community_admin())
  );
