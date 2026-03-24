import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';

export function NotificationsPage() {
  const navigate = useNavigate();
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Notificações</h1>
        </div>
        {items.some((x) => !x.read) ? (
          <button
            type="button"
            onClick={() => markAllRead()}
            className="text-sm text-cyan-400 hover:underline"
          >
            Marcar todas como lidas
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-slate-500">Nenhuma notificação.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => {
                  markRead(n.id);
                  if (n.lcId) navigate(`/lc/${n.lcId}`);
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  n.read
                    ? 'border-[var(--color-tisige-border)] bg-transparent opacity-70'
                    : 'border-cyan-500/20 bg-cyan-500/5'
                }`}
              >
                <p className="font-semibold text-white">{n.title}</p>
                <p className="mt-1 text-sm text-slate-400">{n.body}</p>
                <p className="mt-2 text-xs text-slate-600">
                  {new Date(n.createdAt).toLocaleString('pt-BR')}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
