-- Admin do sistema: pode atualizar qualquer linha em public.profiles

create or replace function public.is_profile_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select p.papel = 'admin' from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

comment on function public.is_profile_admin() is 'true se o usuário logado tem profiles.papel = admin';

-- Admin (papel) pode listar todos os perfis mesmo se tipo B (evita ficar preso)
drop policy if exists "profiles_select" on public.profiles;

create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (
    id = auth.uid()
    or public.is_tipo_a()
    or public.is_profile_admin()
  );

-- Atualizar qualquer perfil (definir tipo/papel/setor para outros usuários)
drop policy if exists "profiles_update_any_admin" on public.profiles;

create policy "profiles_update_any_admin"
  on public.profiles for update
  to authenticated
  using (public.is_profile_admin())
  with check (true);
