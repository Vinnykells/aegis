create extension if not exists pgcrypto;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  wallet_balance numeric(14, 2) not null default 0,
  currency text not null default 'NGN',
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('ADMIN', 'MEMBER', 'VIEWER')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  reference text not null unique,
  provider text not null,
  amount numeric(14, 2) not null,
  currency text not null default 'NGN',
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.transactions enable row level security;

create policy "Members can view their organizations"
on public.organizations for select to authenticated
using (
  exists (
    select 1 from public.organization_members
    where organization_members.org_id = organizations.id
      and organization_members.user_id = auth.uid()
  )
);

create policy "Users can view their memberships"
on public.organization_members for select to authenticated
using (user_id = auth.uid());

create policy "Members can view organization transactions"
on public.transactions for select to authenticated
using (
  exists (
    select 1 from public.organization_members
    where organization_members.org_id = transactions.org_id
      and organization_members.user_id = auth.uid()
  )
);

create or replace function public.provision_workspace(
  workspace_owner_id uuid,
  workspace_owner_email text,
  workspace_owner_metadata jsonb
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  workspace_id uuid;
  workspace_name text;
  workspace_slug text;
begin
  if exists (
    select 1 from public.organization_members
    where user_id = workspace_owner_id
  ) then
    return;
  end if;

  workspace_name := coalesce(
    nullif(trim(workspace_owner_metadata ->> 'workspace_name'), ''),
    nullif(trim(workspace_owner_metadata ->> 'full_name'), ''),
    split_part(workspace_owner_email, '@', 1) || '''s Workspace'
  );

  workspace_slug := lower(regexp_replace(workspace_name, '[^a-zA-Z0-9]+', '-', 'g'));
  workspace_slug := trim(both '-' from workspace_slug) || '-' || left(workspace_owner_id::text, 8);

  insert into public.organizations (name, slug)
  values (workspace_name, workspace_slug)
  returning id into workspace_id;

  insert into public.organization_members (org_id, user_id, role)
  values (workspace_id, workspace_owner_id, 'ADMIN');

end;
$$;

create or replace function public.create_workspace_for_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  perform public.provision_workspace(new.id, new.email, new.raw_user_meta_data);
  return new;
end;
$$;

revoke all on function public.provision_workspace(uuid, text, jsonb) from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_workspace_for_new_user();

do $$
declare
  existing_user record;
begin
  for existing_user in
    select id, email, raw_user_meta_data
    from auth.users as existing_auth_user
    where not exists (
      select 1 from public.organization_members
      where organization_members.user_id = existing_auth_user.id
    )
  loop
    perform public.provision_workspace(
      existing_user.id,
      existing_user.email,
      existing_user.raw_user_meta_data
    );
  end loop;
end;
$$;
