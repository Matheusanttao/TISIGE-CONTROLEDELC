import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getSupabaseProjectHost, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await login(email, pass);
      if (!r.ok) {
        setErr(r.error ?? 'Falha ao entrar.');
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
        <div className="mb-8 text-center">
          <div className="mb-8 inline-block rounded-full bg-cyan-500/10 px-4 py-1 text-xs font-bold tracking-[0.3em] text-cyan-400">
            TISIGE
          </div>
          <h1 className="text-2xl font-bold text-white">Controle de LC</h1>
          <p className="mt-2 text-sm text-slate-400">
            E-mail ou usuário <span className="text-slate-500">(atalho: admin / admin)</span>
          </p>
        </div>

        {!isSupabaseConfigured() ? (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            Configure <code className="font-mono text-xs">VITE_SUPABASE_URL</code> e{' '}
            <code className="font-mono text-xs">VITE_SUPABASE_ANON_KEY</code> no arquivo{' '}
            <code className="font-mono">.env</code> e reinicie o servidor.
          </div>
        ) : import.meta.env.DEV ? (
          <p className="mb-4 text-center text-xs text-slate-500">
            Projeto: {getSupabaseProjectHost() ?? '?'}
          </p>
        ) : null}

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-6">
          {err ? (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {err}
            </div>
          ) : null}
          <Input
            label="E-mail ou usuário"
            type="text"
            autoComplete="username"
            placeholder="admin ou seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" loading={loading} disabled={!email || !pass}>
            Entrar
          </Button>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/register"
              className="text-center text-sm text-cyan-400/90 hover:underline"
            >
              Criar conta
            </Link>
            <Link
              to="/forgot-password"
              className="text-center text-sm text-slate-500 hover:text-slate-400"
            >
              Esqueci minha senha
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
