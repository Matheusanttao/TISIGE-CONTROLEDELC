import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'danger';

const styles: Record<Variant, string> = {
  primary:
    'bg-[var(--color-tisige-accent-dim)] text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:opacity-95 active:scale-[0.99]',
  ghost:
    'border border-[var(--color-tisige-border)] text-[var(--color-tisige-text)] hover:bg-white/5',
  danger: 'bg-red-700 text-white font-semibold hover:bg-red-600',
};

export function Button({
  variant = 'primary',
  className = '',
  children,
  loading,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
  children?: ReactNode;
}) {
  const dim = disabled || loading;
  return (
    <button
      type="button"
      disabled={dim}
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[15px] transition ${styles[variant]} ${dim ? 'opacity-45' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
