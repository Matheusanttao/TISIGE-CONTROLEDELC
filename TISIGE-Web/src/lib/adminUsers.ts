import type { PapelUsuario, UserRole } from '@/types/models';
import type { ProfileRow } from '@/lib/profile';
import { supabase } from '@/lib/supabase';

export type ProfileListItem = ProfileRow & { id: string };

export async function fetchAllProfiles(): Promise<ProfileListItem[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, email, setor, tipo, papel')
    .order('email', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ProfileListItem[];
}

export async function updateProfileByAdmin(
  id: string,
  patch: {
    tipo: UserRole;
    papel: PapelUsuario;
    setor: string;
    full_name?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      tipo: patch.tipo,
      papel: patch.papel,
      setor: patch.setor || null,
      full_name: patch.full_name?.trim() || null,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
}
