import { useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar, FieldInfo } from '../../../shared/components';
import CalendarPicker from '../../../shared/components/CalendarPicker';
import { ToastProvider } from '../../../shared/components/Toast';
import { useForm } from '@tanstack/react-form';
import useBookingForm from '../hooks/useBookingForm';
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function BookingFormPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const slotIdFromQuery = query.get('slotId');

  // selected slot is provided via query param
  const selectedSlotId = slotIdFromQuery;
  const [slots, setSlots] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<Error | null>(null);

  const { slot, availableSeats, isLoading, error, onSubmit } = useBookingForm(selectedSlotId);

  // Cargar lista de slots activos (para que el usuario pueda seleccionar uno)
  useEffect(() => {
    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSlotsError(null);
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('../../../app/config/firebase');
        const col = collection(db, 'slot');
        const snap = await getDocs(col);
        const list = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
        // Filtrar solo activos
        const active = list.filter(s => s.activo === true);
        setSlots(active);
      } catch (err: any) {
        setSlotsError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setSlotsLoading(false);
      }
    };

    // sólo cargar si no viene slotId por query o siempre para ofrecer selección
    void fetchSlots();
  }, []);

  const formatDateValue = (v: any) => {
    if (!v) return '';
    // Firestore Timestamp has toDate()
    if (typeof v === 'object') {
      if (typeof v.toDate === 'function') {
        return v.toDate().toLocaleString();
      }
      // older form: { seconds, nanoseconds }
      if ('seconds' in v) {
        try {
          return new Date(v.seconds * 1000).toLocaleString();
        } catch (_) {
          return String(v);
        }
      }
    }
    if (typeof v === 'number') return new Date(v).toLocaleString();
    return String(v);
  };

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      peopleCount: 1,
      notes: '',
    },
  onSubmit: async ({ value }) => {
      // validaciones adicionales
      if (!slot) throw new Error('Slot is required');
      if (value.peopleCount <= 0) throw new Error('peopleCount debe ser mayor a 0');
      if (value.peopleCount > availableSeats) throw new Error('peopleCount exceeds available seats');

      const payload = {
        fullName: value.fullName,
        email: value.email,
        phone: value.phone || undefined,
        peopleCount: Number(value.peopleCount),
        notes: value.notes || undefined,
      };

      try {
        const { reservationId } = await onSubmit(payload);
        // Mostrar toast de éxito en lugar de redirigir
        // emit toast by dispatching a custom event because ToastProvider listens for it
        window.dispatchEvent(new CustomEvent('booking:success', { detail: { reservationId } }));
      } catch (err: any) {
        throw err;
      }
    },
  });

  // Selector de fecha: usar calendario para elegir día (sin la palabra "slot")
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);
  // When a date is selected, we'll check reservations and notify via toast
  // by dispatching a `booking:availability` event with { date, count }

  // UI cuando no hay selectedSlotId: mostrar calendario + lista de franjas del día
  if (!selectedSlotId) {
    return (
      <ToastProvider>
        <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
          <Navbar />
          <div className="min-h-screen flex items-center justify-center p-4 pt-24">
            <div className="w-full max-w-3xl">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h1 className="text-2xl font-bold text-white mb-4">Selecciona una fecha</h1>
                {slotsLoading ? (
                  <div className="text-neutral-400">Cargando fechas disponibles...</div>
                ) : slotsError ? (
                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-red-300">Error cargando fechas: {slotsError.message}</div>
                ) : slots.length === 0 ? (
                  <div className="text-neutral-400">No hay fechas disponibles en este momento.</div>
                ) : (
                  <div>
                    <div className="w-full max-w-md">
                      <CalendarPicker
                        selected={calendarDate}
                        onSelect={(d) => {
                          setCalendarDate(d);
                          if (!d) return;
                          const selectedDay = d.toDateString();
                          const matching = slots.filter((s) => {
                            const start = s.fechaHoraInicio;
                            let startDate: Date | null = null;
                            if (start && typeof start === 'object' && typeof start.toDate === 'function') startDate = start.toDate();
                            else if (start && start.seconds) startDate = new Date(start.seconds * 1000);
                            else if (typeof start === 'string') startDate = new Date(start);
                            if (!startDate) return false;
                            return startDate.toDateString() === selectedDay;
                          });

                          // If no slots for the selected day, emit a toast event that will
                          // show: "No hay tours para este dia"
                          if (matching.length === 0) {
                            window.dispatchEvent(new CustomEvent('booking:availability', { detail: { date: d.toISOString(), count: 0 } }));
                            return;
                          }

                          // If there are slots, navigate directly to the booking form for the first slot.
                          const firstSlotId = matching[0].id;
                          if (firstSlotId) {
                            navigate({ search: `?slotId=${firstSlotId}` });
                            // Do NOT dispatch an availability toast when there are tours; user requested
                            // to be taken directly to the form when a day has tours.
                          }
                        }}
                        highlightedDays={slots.map(s => {
                          const st = s.fechaHoraInicio;
                          if (st && typeof st === 'object' && typeof st.toDate === 'function') return st.toDate();
                          if (st && st.seconds) return new Date(st.seconds * 1000);
                          if (typeof st === 'string') return new Date(st);
                          return undefined;
                        }).filter(Boolean) as Date[]}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button onClick={() => navigate(-1)} className="bg-transparent border-2 border-gray-600 text-gray-300 py-2 px-4 rounded-lg">Volver</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ToastProvider>
    );
  }

  // Estado de carga del slot
  if (isLoading) {
    return (
      <ToastProvider>
        <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
          <Navbar />
          <div className="min-h-screen flex items-center justify-center p-4 pt-24">
            <div className="w-full max-w-md">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#228B22' }}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Cargando información del slot</h1>
                <p className="text-neutral-400">Por favor espera...</p>
              </div>
            </div>
          </div>
        </div>
      </ToastProvider>
    );
  }

  // Error al cargar
  if (error) {
    return (
      <ToastProvider>
        <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
          <Navbar />
          <div className="min-h-screen flex items-center justify-center p-4 pt-24">
            <div className="w-full max-w-md">
              <div className="bg-red-900/20 border border-red-700/30 rounded-2xl p-8 text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Error</h1>
                <p className="text-neutral-300 mb-4">{error.message}</p>
                <div className="flex justify-center">
                  <button onClick={() => navigate(-1)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">Volver</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ToastProvider>
    );
  }

  // Formulario principal
  return (
    <ToastProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4 pt-24">
          <div className="w-full max-w-3xl">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-white">Reserva tu lugar</h1>
                <p className="text-neutral-400">Slot: {formatDateValue(slot?.fechaHoraInicio)} - {formatDateValue(slot?.fechaHoraFin)}</p>
                <p className="text-neutral-400">Capacidad: {slot?.capacidadMax} — Asientos disponibles: {availableSeats}</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">
                {/* fullName */}
                <div>
                  <form.Field name="fullName" validators={{ onChange: ({ value }) => !value ? 'Nombre completo es requerido' : undefined }}>
                    {(field: any) => (
                      <>
                        <label className="block text-white mb-2 text-sm">Nombre completo</label>
                        <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm" />
                        <FieldInfo field={field} />
                      </>
                    )}
                  </form.Field>
                </div>

                {/* email */}
                <div>
                  <form.Field name="email" validators={{ onChange: ({ value }) => !value ? 'Email es requerido' : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? 'Email invalido' : undefined }}>
                    {(field: any) => (
                      <>
                        <label className="block text-white mb-2 text-sm">Email</label>
                        <input type="email" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm" />
                        <FieldInfo field={field} />
                      </>
                    )}
                  </form.Field>
                </div>

                {/* phone */}
                <div>
                  <form.Field name="phone" children={(field: any) => (
                    <>
                      <label className="block text-white mb-2 text-sm">Teléfono (opcional)</label>
                      <input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm" />
                      <FieldInfo field={field} />
                    </>
                  )} />
                </div>

                {/* peopleCount */}
                <div>
                  <form.Field name="peopleCount" validators={{ onChange: ({ value }) => {
                    const n = Number(value);
                    if (!n || n <= 0) return 'Debe ser mayor a 0';
                    if (slot && n > availableSeats) return 'No hay suficientes asientos disponibles';
                    return undefined;
                  }}}>
                    {(field: any) => (
                      <>
                        <label className="block text-white mb-2 text-sm">Número de personas</label>
                        <input type="number" min={1} value={field.state.value} onChange={(e) => field.handleChange(Number(e.target.value))} onBlur={field.handleBlur}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm" />
                        <FieldInfo field={field} />
                      </>
                    )}
                  </form.Field>
                </div>

                {/* notes */}
                <div>
                  <form.Field name="notes" validators={{ onChange: ({ value }) => value && value.length > 500 ? 'Máximo 500 caracteres' : undefined }}>
                    {(field: any) => (
                      <>
                        <label className="block text-white mb-2 text-sm">Notas (opcional)</label>
                        <textarea value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} onBlur={field.handleBlur}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm" rows={4} />
                        <FieldInfo field={field} />
                      </>
                    )}
                  </form.Field>
                </div>

                <div className="pt-4 border-t border-neutral-700">
                  <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
                    {([canSubmit, isSubmitting]) => (
                      <div className="flex gap-3">
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-transparent border-2 border-gray-600 text-gray-300 py-3 rounded-lg">Cancelar</button>
                        <button type="button" onClick={() => form.handleSubmit()} disabled={!canSubmit} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold">
                          {isSubmitting || isSubmitting ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Reservando...</span>
                            </div>
                          ) : (
                            'Reservar ahora'
                          )}
                        </button>
                      </div>
                    )}
                  </form.Subscribe>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
