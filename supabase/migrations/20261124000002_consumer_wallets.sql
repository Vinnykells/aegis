create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  country_code text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  balance numeric(14, 2) not null default 0 check (balance >= 0),
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, currency)
);

create table if not exists public.transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_wallet_id uuid not null references public.wallets(id),
  recipient_name text not null,
  recipient_email text,
  destination_currency text not null check (destination_currency ~ '^[A-Z]{3}$'),
  amount numeric(14, 2) not null check (amount > 0),
  converted_amount numeric(14, 2) not null check (converted_amount > 0),
  exchange_rate numeric(18, 8) not null check (exchange_rate > 0),
  fee numeric(14, 2) not null default 0 check (fee >= 0),
  reference text not null unique,
  status text not null default 'PROCESSING' check (status in ('PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')),
  created_at timestamptz not null default now()
);

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric(14, 2) not null check (target_amount > 0),
  current_amount numeric(14, 2) not null default 0 check (current_amount >= 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  target_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_type text not null default 'VIRTUAL' check (card_type in ('VIRTUAL', 'PHYSICAL')),
  last4 text not null,
  currency text not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'FROZEN', 'CANCELLED')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.transfers enable row level security;
alter table public.savings_goals enable row level security;
alter table public.cards enable row level security;

drop policy if exists "Users manage their own profile" on public.profiles;
create policy "Users manage their own profile" on public.profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Users view their own wallets" on public.wallets;
create policy "Users view their own wallets" on public.wallets for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users view their own transfers" on public.transfers;
create policy "Users view their own transfers" on public.transfers for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users manage their own savings goals" on public.savings_goals;
create policy "Users manage their own savings goals" on public.savings_goals for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "Users view their own cards" on public.cards;
create policy "Users view their own cards" on public.cards for select to authenticated using (user_id = auth.uid());

create or replace function public.initialize_consumer_account()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''))
  on conflict (id) do nothing;

  insert into public.wallets (user_id, currency, is_primary)
  values (new.id, 'USD', true)
  on conflict (user_id, currency) do nothing;

  insert into public.cards (user_id, card_type, last4, currency)
  values (new.id, 'VIRTUAL', right(replace(new.id::text, '-', ''), 4), 'USD')
  on conflict do nothing;

  return new;
end;
$$;

revoke all on function public.initialize_consumer_account() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.initialize_consumer_account();

create or replace function public.create_consumer_transfer(
  wallet_id uuid,
  recipient text,
  recipient_address text,
  destination_currency_code text,
  transfer_amount numeric,
  converted_transfer_amount numeric,
  transfer_exchange_rate numeric,
  transfer_fee numeric
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  source_wallet public.wallets%rowtype;
  transfer_id uuid;
  transfer_reference text;
begin
  select * into source_wallet
  from public.wallets
  where id = wallet_id and user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Wallet not found.';
  end if;

  if transfer_amount <= 0 or transfer_fee < 0 then
    raise exception 'Transfer amount is invalid.';
  end if;

  if source_wallet.balance < transfer_amount + transfer_fee then
    raise exception 'Insufficient balance.';
  end if;

  transfer_reference := 'AEG-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  update public.wallets
  set balance = balance - transfer_amount - transfer_fee
  where id = source_wallet.id;

  insert into public.transfers (
    user_id, source_wallet_id, recipient_name, recipient_email, destination_currency,
    amount, converted_amount, exchange_rate, fee, reference
  ) values (
    auth.uid(), source_wallet.id, recipient, recipient_address, destination_currency_code,
    transfer_amount, converted_transfer_amount, transfer_exchange_rate, transfer_fee, transfer_reference
  ) returning id into transfer_id;

  return transfer_id;
end;
$$;

revoke all on function public.create_consumer_transfer(uuid, text, text, text, numeric, numeric, numeric, numeric) from public;
grant execute on function public.create_consumer_transfer(uuid, text, text, text, numeric, numeric, numeric, numeric) to authenticated;

do $$
declare
  existing_user record;
begin
  for existing_user in select id, raw_user_meta_data from auth.users loop
    insert into public.profiles (id, full_name)
    values (existing_user.id, nullif(trim(existing_user.raw_user_meta_data ->> 'full_name'), ''))
    on conflict (id) do nothing;

    insert into public.wallets (user_id, currency, is_primary)
    values (existing_user.id, 'USD', true)
    on conflict (user_id, currency) do nothing;

    insert into public.cards (user_id, card_type, last4, currency)
    values (existing_user.id, 'VIRTUAL', right(replace(existing_user.id::text, '-', ''), 4), 'USD')
    on conflict do nothing;
  end loop;
end;
$$;
