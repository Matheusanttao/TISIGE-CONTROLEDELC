/**
 * Cria (uma vez) o utilizador admin@admin.local / admin no Supabase Auth.
 *
 * Requer a chave service_role (NUNCA no frontend — só neste script local).
 *
 * Uso (na pasta TISIGE-Web):
 *   set SUPABASE_SERVICE_ROLE_KEY=sua_chave_secreta
 *   set VITE_SUPABASE_URL=https://xxxx.supabase.co
 *   node scripts/create-admin-user.mjs
 *
 * PowerShell:
 *   $env:SUPABASE_SERVICE_ROLE_KEY="..."; $env:VITE_SUPABASE_URL="..."; node scripts/create-admin-user.mjs
 *
 * Depois rode no SQL Editor: supabase/seed_admin.sql (marca tipo A + papel admin em profiles).
 */

import { createClient } from '@supabase/supabase-js';

const url =
  process.env.VITE_SUPABASE_URL?.trim() ||
  process.env.SUPABASE_URL?.trim() ||
  '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';

if (!url || !serviceKey) {
  console.error(
    'Defina VITE_SUPABASE_URL (ou SUPABASE_URL) e SUPABASE_SERVICE_ROLE_KEY (Dashboard → Settings → API → service_role).'
  );
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const EMAIL = 'admin@admin.local';
const PASSWORD = 'admin';

const { data, error } = await admin.auth.admin.createUser({
  email: EMAIL,
  password: PASSWORD,
  email_confirm: true,
  user_metadata: { full_name: 'Administrador' },
});

if (error) {
  if (
    error.message?.toLowerCase().includes('already') ||
    error.message?.toLowerCase().includes('registered') ||
    error.code === 'email_exists'
  ) {
    console.log('Utilizador já existe:', EMAIL);
    process.exit(0);
  }
  console.error('Erro:', error.message);
  process.exit(1);
}

console.log('Criado:', data.user?.email ?? EMAIL);
console.log('Agora execute seed_admin.sql no SQL Editor para tipo=A e papel=admin em public.profiles.');
