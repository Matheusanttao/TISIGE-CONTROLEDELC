-- TISIGE — esquema inicial para Supabase (PostgreSQL)
-- Execute no SQL Editor do Supabase ou via CLI: supabase db push

-- Extensões úteis
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Perfis de usuário (ligados ao Auth do Supabase)
-- O login real é feito em auth.users; aqui ficam dados da aplicação.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  email text,
  setor text,
  tipo text not null default 'B' check (tipo in ('A', 'B')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Metadados do usuário; id = auth.users.id';
comment on column public.profiles.tipo is 'A = edição completa; B = somente leitura';

-- Novo usuário no Auth → cria linha em profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, full_name, tipo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'tipo', 'B')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Controle de LC (equivalente à tabela ControleLC do MySQL)
-- ---------------------------------------------------------------------------
create table public.controle_lc (
  id uuid primary key default gen_random_uuid(),
  arquivo text,
  os text not null unique,
  cliente text not null,
  equipamento text not null,
  dt_contratual date not null,
  dt_recebimento date not null,
  dt_retirada date,
  resp_retirada text default '',
  setor text not null default 'Teste',
  gaveta text,
  data_limite_testes date,
  gestao_finalizado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_controle_lc_os on public.controle_lc (os);
create index idx_controle_lc_cliente on public.controle_lc (cliente);

-- ---------------------------------------------------------------------------
-- Histórico de pesquisas (lista ControleLC.php)
-- ---------------------------------------------------------------------------
create table public.pesquisas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  termo_pesquisa text not null,
  created_at timestamptz not null default now()
);

create index idx_pesquisas_user on public.pesquisas (user_id);

-- ---------------------------------------------------------------------------
-- Registros de operações (edição / exclusão)
-- ---------------------------------------------------------------------------
create table public.registros_operacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tipo_operacao text not null,
  os_afetada text,
  dados_afetados jsonb,
  created_at timestamptz not null default now()
);

create index idx_registros_user on public.registros_operacoes (user_id);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger controle_lc_updated_at
  before update on public.controle_lc
  for each row execute function public.set_updated_at();

-- Função auxiliar: evita recursão nas policies RLS ao ler `profiles`
create or replace function public.is_tipo_a()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select tipo = 'A' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.controle_lc enable row level security;
alter table public.pesquisas enable row level security;
alter table public.registros_operacoes enable row level security;

-- Perfis: vê o próprio; tipo A vê todos (gestão de usuários)
create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_tipo_a());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- LC: todos autenticados leem
create policy "controle_lc_select_authenticated"
  on public.controle_lc for select
  to authenticated
  using (true);

-- LC: insert/update/delete só tipo A
create policy "controle_lc_insert_admin"
  on public.controle_lc for insert
  to authenticated
  with check (public.is_tipo_a());

create policy "controle_lc_update_admin"
  on public.controle_lc for update
  to authenticated
  using (public.is_tipo_a())
  with check (public.is_tipo_a());

create policy "controle_lc_delete_admin"
  on public.controle_lc for delete
  to authenticated
  using (public.is_tipo_a());

-- tipo B pode atualizar só o flag gestão (se quiser no futuro); por ora somente leitura na LC

-- Pesquisas: cada usuário vê as suas; insert próprio
create policy "pesquisas_select_own"
  on public.pesquisas for select
  to authenticated
  using (user_id = auth.uid());

create policy "pesquisas_insert_own"
  on public.pesquisas for insert
  to authenticated
  with check (user_id = auth.uid());

-- Registros: leitura própria; insert próprio
create policy "registros_select_own"
  on public.registros_operacoes for select
  to authenticated
  using (user_id = auth.uid());

create policy "registros_insert_own"
  on public.registros_operacoes for insert
  to authenticated
  with check (user_id = auth.uid());
