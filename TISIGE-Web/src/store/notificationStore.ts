import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  lcId?: string;
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface NotificationState {
  items: AppNotification[];
  add: (n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      items: [],
      add: (n) =>
        set((s) => ({
          items: [
            {
              ...n,
              id: genId(),
              read: false,
              createdAt: new Date().toISOString(),
            },
            ...s.items,
          ],
        })),
      markRead: (id) =>
        set((s) => ({
          items: s.items.map((x) => (x.id === id ? { ...x, read: true } : x)),
        })),
      markAllRead: () =>
        set((s) => ({
          items: s.items.map((x) => ({ ...x, read: true })),
        })),
    }),
    {
      name: 'tisige-notify',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);
