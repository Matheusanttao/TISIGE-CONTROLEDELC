import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';

/** Perfis existentes no TISIGE — o administrador define qual perfil cada usuário terá após o cadastro. */
const PERFIS_SISTEMA: { titulo: string; descricao: string }[] = [
  { titulo: 'Admin', descricao: 'Gestão de usuários e permissões no sistema.' },
  {
    titulo: 'Desenho (desenhista)',
    descricao: 'Cadastra e edita registros LC em rascunho; envia para aprovação.',
  },
  { titulo: 'Aprovação', descricao: 'Aprova ou reprova solicitações técnicas.' },
  { titulo: 'PCP', descricao: 'Fabricação e programação.' },
  { titulo: 'Gerência', descricao: 'Visão gerencial e indicadores.' },
  { titulo: 'Leitura', descricao: 'Somente visualização, sem editar dados.' },
];

export function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    if (pass !== pass2) {
      setErr('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const r = await register(email, pass, fullName);
      if (!r.ok) {
        setErr(r.error ?? 'Erro');
        return;
      }
      if (r.needsEmailConfirmation) {
        setInfo('Verifique seu e-mail para confirmar a conta.');
        return;
      }
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-tisige-bg)] px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-white">Criar conta</h1>
        <div className="mb-6 rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)]/80 p-4 text-left text-sm text-slate-300">
          <p className="mb-3 font-semibold text-cyan-300/95">Como eu ganho um perfil (Desenho, PCP, etc.)?</p>
          <p className="mb-3 text-xs leading-relaxed text-slate-400">
            <strong className="text-slate-200">Não dá para escolher aqui no cadastro</strong> — por
            segurança, só quem já é <strong className="text-slate-300">Admin</strong> no sistema pode
            mudar o seu <strong className="text-slate-200">papel</strong> e se você pode editar ou só
            ler (<strong className="text-slate-200">tipo</strong> A ou B). Ao criar a conta, você
            começa em <strong className="text-slate-200">leitura</strong> até alguém liberar.
          </p>
          <ol className="mb-4 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-slate-400">
            <li>Cadastre-se e faça login.</li>
            <li>
              Peça ao <strong className="text-slate-300">administrador da empresa</strong> (quem gerencia
              o TISIGE) para te dar o papel certo.
            </li>
            <li>
              O admin entra no <strong className="text-slate-300">site</strong>, abre o menu{' '}
              <strong className="text-slate-200">Usuários</strong> (só aparece para quem é Admin),
              escolhe o seu e-mail, define <strong className="text-slate-200">Tipo</strong> (edição ou
              leitura) e <strong className="text-slate-200">Papel no fluxo</strong> (Desenho, Aprovação,
              PCP…) e salva.
            </li>
          </ol>
          <p className="mb-3 rounded-lg bg-white/5 px-2 py-2 text-[11px] leading-relaxed text-slate-500">
            <strong className="text-slate-400">Sou eu quem manda no Supabase?</strong> No painel do
            Supabase → <strong className="text-slate-300">Table Editor</strong> → tabela{' '}
            <code className="text-cyan-400/90">profiles</code>, edite a linha do usuário: colunas{' '}
            <code className="text-cyan-400/90">tipo</code> (A = edita, B = só lê) e{' '}
            <code className="text-cyan-400/90">papel</code> (admin, desenhista, aprovador, pcp,
            gerencia, visualizador).
          </p>
          <p className="mb-3 border-t border-white/5 pt-3 font-semibold text-cyan-300/95">
            Tipos de perfil no sistema (referência)
          </p>
          <ul className="space-y-2 text-xs leading-relaxed">
            {PERFIS_SISTEMA.map((p) => (
              <li key={p.titulo} className="flex gap-2">
                <span className="mt-0.5 shrink-0 text-cyan-500/80">•</span>
                <span>
                  <span className="font-medium text-slate-200">{p.titulo}</span>
                  {' — '}
                  {p.descricao}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-6"
        >
          {err ? (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{err}</div>
          ) : null}
          {info ? (
            <div className="rounded-lg bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">{info}</div>
          ) : null}
          <Input label="Nome completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha (mín. 6 caracteres)"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <Input
            label="Confirmar senha"
            type="password"
            value={pass2}
            onChange={(e) => setPass2(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" loading={loading}>
            Cadastrar
          </Button>
          <Link to="/login" className="block text-center text-sm text-cyan-400 hover:underline">
            Já tenho conta
          </Link>
        </form>
      </div>
    </div>
  );
}
