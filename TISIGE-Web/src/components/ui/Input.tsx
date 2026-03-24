import type { InputHTMLAttributes } from 'react';

export function Input({
  label,
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      {label ? (
        <span className="text-sm font-medium text-[var(--color-tisige-muted)]">
          {label}
        </span>
      ) : null}
      <input
        className={`rounded-xl border border-[var(--color-tisige-border)] bg-[var(--color-tisige-surface)] px-4 py-3 text-[var(--color-tisige-text)] outline-none placeholder:text-slate-600 focus:border-[var(--color-tisige-accent)] focus:ring-1 focus:ring-[var(--color-tisige-accent)] ${className}`}
        {...rest}
      />
    </label>
  );
}
