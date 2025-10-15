import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type ToastMessage = { id: string; title?: string; description?: string; duration?: number };

const ToastContext = createContext<{ show: (m: ToastMessage) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const show = (m: ToastMessage) => {
    setMessages((s) => [...s, m]);
    const duration = typeof m.duration === 'number' ? m.duration : 8000;
    if (duration > 0) {
      setTimeout(() => {
        setMessages((s) => s.filter(x => x.id !== m.id));
      }, duration);
    }
  };

  useEffect(() => {
    const successHandler = (e: any) => {
      const reservationId = e?.detail?.reservationId;
      const id = `booking-${reservationId ?? Date.now()}`;
      const msg: ToastMessage = { id, title: 'Reserva creada', description: reservationId ? `ID: ${reservationId}` : undefined, duration: 12000 };
      show(msg);
    };

    const availabilityHandler = (e: any) => {
      const date = e?.detail?.date;
      const count = Number(e?.detail?.count || 0);
      const id = `availability-${date ?? Date.now()}`;

      if (count === 0) {
        // exact message requested by the user
        const msg: ToastMessage = { id, title: 'No hay tours para este dia', duration: 4000 };
        show(msg);
        return;
      }

      // For days with tours we won't show the generic availability toast. If needed in future,
      // this branch can show a short info message.
      // const prettyDate = date ? new Date(date).toLocaleDateString() : 'la fecha seleccionada';
      // const msg: ToastMessage = { id, title: `Hay ${count} tours`, description: `Hay ${count} tour(s) el ${prettyDate}`, duration: 2000 };
      // show(msg);
    };

    window.addEventListener('booking:success', successHandler as EventListener);
    window.addEventListener('booking:availability', availabilityHandler as EventListener);
    return () => {
      window.removeEventListener('booking:success', successHandler as EventListener);
      window.removeEventListener('booking:availability', availabilityHandler as EventListener);
    };
  }, []);

  const remove = (id: string) => setMessages((s) => s.filter(x => x.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {messages.map((m) => (
          <div key={m.id} className="bg-white/6 border border-white/10 text-white p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-200 ease-in-out hover:scale-[1.01]">
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="font-medium mb-1">{m.title}</div>
                {m.description && <div className="text-sm text-neutral-300">{m.description}</div>}
              </div>
              <div className="flex flex-col items-end">
                <button aria-label="Cerrar notificación" onClick={() => remove(m.id)} className="ml-4 text-sm text-neutral-300">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
