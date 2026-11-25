create or replace function public.complete_payment_transaction(payment_reference text)
returns table (org_id uuid, amount numeric, currency text)
language plpgsql
security definer set search_path = public
as $$
declare
  payment_transaction public.transactions%rowtype;
begin
  select * into payment_transaction
  from public.transactions
  where reference = payment_reference
  for update;

  if not found or payment_transaction.status = 'SUCCESS' then
    return;
  end if;

  update public.transactions
  set status = 'SUCCESS'
  where id = payment_transaction.id;

  update public.organizations
  set wallet_balance = wallet_balance + payment_transaction.amount
  where id = payment_transaction.org_id;

  return query select payment_transaction.org_id, payment_transaction.amount, payment_transaction.currency;
end;
$$;

revoke all on function public.complete_payment_transaction(text) from public, anon, authenticated;
grant execute on function public.complete_payment_transaction(text) to service_role;
