-- Run in Supabase SQL Editor before importing data.
-- IMPORTANT: Do not enable anonymous SELECT policies. Every user must authenticate.
create extension if not exists pgcrypto;
create table if not exists public.app_members (
 user_id uuid primary key references auth.users(id) on delete cascade,
 role text not null check (role in ('supervisor','staff')),
 created_at timestamptz not null default now()
);
create table if not exists public.staff (
 id uuid primary key default gen_random_uuid(),
 name text not null, role text not null default '', employment_type text not null default '',
 notes text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.roster_assignments (
 id uuid primary key default gen_random_uuid(), staff_id uuid references public.staff(id) on delete set null,
 name text not null, shift_group text not null check(shift_group in ('weekdayDay','weekdayNight','weekendDay','weekendNight')),
 start_time time not null, end_time time not null, notes text not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.building_information (
 id uuid primary key default gen_random_uuid(), title text not null,category text not null default '',
 location text not null default '',contact text not null default '',details text not null default '',notes text not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.cleaning_issues (
 id uuid primary key default gen_random_uuid(), title text not null, location text not null default '', surface text not null default '',
 attempts text not null default '', outcome text not null default '',status text not null default 'Unresolved',
 notes text not null default '',photo_url text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.audit_logs (
 id bigint generated always as identity primary key, actor_id uuid,table_name text not null,record_id text not null,
 action text not null, old_value jsonb,new_value jsonb,created_at timestamptz not null default now()
);
create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path='' as $$ begin new.updated_at=now();return new;end $$;
create or replace function public.audit_mutation() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.audit_logs(actor_id,table_name,record_id,action,old_value,new_value)
 values(auth.uid(),tg_table_name,coalesce(new.id,old.id)::text,tg_op,to_jsonb(old),to_jsonb(new));
 return coalesce(new,old);
end $$;
do $$ declare t text; begin
 foreach t in array array['staff','roster_assignments','building_information','cleaning_issues'] loop
  execute format('drop trigger if exists t_updated on public.%I',t);
  execute format('create trigger t_updated before update on public.%I for each row execute function public.touch_updated_at()',t);
  execute format('drop trigger if exists t_audit on public.%I',t);
  execute format('create trigger t_audit after insert or update or delete on public.%I for each row execute function public.audit_mutation()',t);
 end loop;
end $$;
create or replace function public.is_member() returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.app_members where user_id=auth.uid())$$;
create or replace function public.is_supervisor() returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.app_members where user_id=auth.uid() and role='supervisor')$$;
revoke all on function public.is_member() from public;
revoke all on function public.is_supervisor() from public;
grant execute on function public.is_member(),public.is_supervisor() to authenticated;
-- RLS policies: staff read-only, supervisor mutations.
alter table public.app_members enable row level security;
create policy "member reads own role" on public.app_members for select to authenticated using(user_id=auth.uid());
do $$ declare t text; begin
 foreach t in array array['staff','roster_assignments','building_information','cleaning_issues'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('create policy "authorised members read" on public.%I for select to authenticated using(public.is_member())',t);
 execute format('create policy "supervisor inserts" on public.%I for insert to authenticated with check(public.is_supervisor())',t);
 execute format('create policy "supervisor updates" on public.%I for update to authenticated using(public.is_supervisor()) with check(public.is_supervisor())',t);
 execute format('create policy "supervisor deletes" on public.%I for delete to authenticated using(public.is_supervisor())',t);
 end loop;
end $$;
alter table public.audit_logs enable row level security;
create policy "supervisor views audit" on public.audit_logs for select to authenticated using(public.is_supervisor());
-- Never permit client direct writes to app_members or audit_logs.
revoke all on public.app_members from anon;
revoke all on public.audit_logs from anon;
-- For realtime notifications. Consider server-side broadcast for scale.
alter publication supabase_realtime add table public.staff,public.roster_assignments,public.building_information,public.cleaning_issues;
