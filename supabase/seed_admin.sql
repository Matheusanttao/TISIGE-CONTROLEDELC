-- ============================================================================
-- Conta admin padrão do TISIGE (login no app: usuário "admin" ou e-mail admin@admin.local, senha admin)
--
-- A) Criar o utilizador no Auth (escolha UM método):
--
--    1) Dashboard → Authentication → Users → Add user → Create new user
--       E-mail: admin@admin.local  |  Senha: admin  |  Auto Confirm User: ON
--
--    2) Na pasta TISIGE-Web, com service_role (Settings → API):
--       $env:SUPABASE_SERVICE_ROLE_KEY="..."; $env:VITE_SUPABASE_URL="..."; npm run seed:admin
--
-- B) Depois rode o SQL abaixo (marca tipo A + papel admin em public.profiles).
--    Outro e-mail? Ajuste o WHERE em where email = '...'.
-- ============================================================================
--
-- Coluna `papel` vem da migration 20260325120000_approval_flow.sql — cria aqui se ainda não existir:
alter table public.profiles
  add column if not exists papel text default 'desenhista';

comment on column public.profiles.papel is
  'Papel no app: admin | desenhista | aprovador | pcp | gerencia | visualizador';

-- Rode o restante no SQL Editor para tornar essa conta administrador do app:

update public.profiles
set
  tipo = 'A',
  papel = 'admin',
  setor = 'Administração',
  full_name = coalesce(nullif(trim(full_name), ''), 'Administrador')
where email = 'admin@admin.local';

-- Verifique:
-- select id, email, tipo, papel, setor from public.profiles where email = 'admin@admin.local';
