import type { PapelUsuario, User } from '@/types/models';
import { supabase } from '@/lib/supabase';

export type ProfileRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  setor: string | null;
  tipo: 'A' | 'B';
  papel: string | null;
};

const PAPEIS: PapelUsuario[] = [
  'admin',
  'desenhista',
  'aprovador',
  'pcp',
  'gerencia',
  'visualizador',
];

function normalizePapel(p: string | null | undefined): PapelUsuario | undefined {
  if (!p) return undefined;
  return PAPEIS.includes(p as PapelUsuario) ? (p as PapelUsuario) : undefined;
}

export function profileToUser(row: ProfileRow, fallbackEmail: string): User {
  const email = row.email ?? fallbackEmail;
  return {
    username: (row.username ?? email.split('@')[0] ?? 'usuario').toLowerCase(),
    nome: row.full_name?.trim() || email.split('@')[0] || 'Usuário',
    email,
    setor: row.setor ?? '—',
    tipo: row.tipo,
    papel: normalizePapel(row.papel),
  };
}

export async function fetchProfileForUser(
  userId: string,
  fallbackEmail: string
): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, email, setor, tipo, papel')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('[TISIGE] fetchProfile', error.message);
    return null;
  }
  if (!data) return null;
  return profileToUser(data as ProfileRow, fallbackEmail);
}
