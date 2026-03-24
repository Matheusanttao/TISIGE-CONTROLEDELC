import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = email.trim().toLowerCase();
    if (!e2) {
      setErr('Informe o e-mail.');
      return;
    }
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(e2);
      if (error) {
        setErr(error.message);
        return;
      }
      setMsg('Se o e-mail existir, você receberá o link para redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-tisige-bg)] px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-white">Recuperar senha</h1>
        <p className="mb-6 text-center text-sm text-slate-400">
          Informe o e-mail da conta. O Supabase enviará o link (se configurado no painel).
        </p>
        <form
          onSubmit={onSend}
          className="space-y-4 rounded-2xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-elevated)] p-6"
        >
          {err ? (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{err}</div>
          ) : null}
          {msg ? (
            <div className="rounded-lg bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">{msg}</div>
          ) : null}
          <Input label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full" loading={loading}>
            Enviar link
          </Button>
          <Link to="/login" className="block text-center text-sm text-cyan-400 hover:underline">
            Voltar ao login
          </Link>
        </form>
      </div>
    </div>
  );
}
