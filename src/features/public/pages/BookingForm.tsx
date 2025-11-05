import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar, FieldInfo } from '../../../shared/components';
import CalendarPicker from '../../../shared/components/CalendarPicker';
import { ToastProvider } from '../../../shared/components/Toast';
import { useForm } from '@tanstack/react-form';
import useBookingForm from '../hooks/useBookingForm';
import { useSlots } from '../hooks/useSlots';
import { useAuth } from '../../../app/providers/useAuth';
function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function BookingFormPage() {
  const { t } = useTranslation();
  const query = useQuery();
  const navigate = useNavigate();
  const slotIdFromQuery = query.get('slotId');

  // selected slot is provided via query param
  const selectedSlotId = slotIdFromQuery;
  const { data: slots = [], isLoading: slotsLoading, isError: slotsErrorFlag, error: slotsErrorObj } = useSlots();

  const { slot, availableSeats, isLoading, error, onSubmit } = useBookingForm(selectedSlotId);
  const { user } = useAuth();

  // Cargar lista de slots activos (para q

  // Parse a Firestore Timestamp / ISO string / number into a Date or null
  const parseToDate = (v: any): Date | null => {
    if (!v) return null;
    if (typeof v === 'object') {
      if (typeof v.toDate === 'function') return v.toDate();
      if ('seconds' in v && typeof v.seconds === 'number') return new Date(v.seconds * 1000);
    }
    if (typeof v === 'number') return new Date(v);
    if (typeof v === 'string') {
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  };

  const formatSlotRange = (startRaw: any, endRaw: any) => {
    const start = parseToDate(startRaw);
    const end = parseToDate(endRaw);
    if (!start && !end) return '';
    // If same day, show short date + times; otherwise show full dates
    const optsDate: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const optsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    if (start && end) {
      const sameDay = start.toDateString() === end.toDateString();
      if (sameDay) {
        return `${start.toLocaleDateString(undefined, optsDate)} · ${start.toLocaleTimeString(undefined, optsTime)}–${end.toLocaleTimeString(undefined, optsTime)}`;
      }
      return `${start.toLocaleString()} — ${end.toLocaleString()}`;
    }
    if (start) return `${start.toLocaleString()}`;
    if (end) return `${end.toLocaleString()}`;
    return '';
  };

  const form = useForm({
    defaultValues: {
      fullName: user?.displayName ?? user?.email ?? '',
      email: user?.email ?? '',
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
                <h1 className="text-2xl font-bold text-white mb-4">{t('public.booking.selectDate')}</h1>
                {slotsLoading ? (
                  <div className="text-neutral-400">{t('public.booking.loadingDates')}</div>
                ) : slotsErrorFlag ? (
                  <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-red-300">{t('public.booking.errorLoadingDates')}: {slotsErrorObj?.message}</div>
                ) : slots.length === 0 ? (
                  <div className="text-neutral-400">{t('public.booking.noDatesAvailable')}</div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="w-full">
                      <CalendarPicker
                        selected={calendarDate}
                        onSelect={(d) => {
                          // set selected day and show matching slots on the right column
                          setCalendarDate(d ?? undefined);
                          if (!d) {
                            // dispatch availability 0 when cleared
                            window.dispatchEvent(new CustomEvent('booking:availability', { detail: { date: null, count: 0 } }));
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

                    <div className="w-full">
                      <h3 className="text-lg font-semibold text-white mb-4">{t('public.booking.slotsAvailable')}</h3>
                      {(() => {
                        const target = calendarDate ?? new Date();
                        const targetDay = target.toDateString();
                        const matching = slots.filter((s) => {
                          const start = s.fechaHoraInicio;
                          let startDate: Date | null = null;
                          if (start && typeof start === 'object' && typeof start.toDate === 'function') startDate = start.toDate();
                          else if (start && start.seconds) startDate = new Date(start.seconds * 1000);
                          else if (typeof start === 'string') startDate = new Date(start);
                          if (!startDate) return false;
                          return startDate.toDateString() === targetDay;
                        });

                        if (matching.length === 0) {
                          return <div className="text-neutral-400">{t('public.booking.noSlotsForDay')}</div>;
                        }

                        return (
                          <div className="space-y-4">
                            {matching.map((s) => (
                              <div key={s.id} className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-sm text-zinc-300">{formatSlotRange(s.fechaHoraInicio, s.fechaHoraFin)}</div>
                                    <div className="text-white font-semibold">{s.capacidadMax} plazas • {s.asientosDisponibles} disponibles</div>
                                    <div className="text-sm text-zinc-400">Guía: {s.guiaName ?? (s.idGuia?.id ?? '—')}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button onClick={() => navigate({ search: `?slotId=${s.id}` })} className="px-3 py-2 bg-green-600 text-white rounded-md">{t('public.booking.reserveButton')}</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button onClick={() => navigate(-1)} className="bg-transparent border-2 border-gray-600 text-gray-300 py-2 px-4 rounded-lg">{t('public.booking.backButton')}</button>
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
                <h1 className="text-2xl font-bold text-white mb-2">{t('public.booking.loadingSlotInfo')}</h1>
                <p className="text-neutral-400">{t('public.booking.pleaseWait')}</p>
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
                <h1 className="text-2xl font-bold text-white mb-2">{t('public.booking.errorTitle')}</h1>
                <p className="text-neutral-300 mb-4">{error.message}</p>
                <div className="flex justify-center">
                  <button onClick={() => navigate(-1)} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">{t('public.booking.backButton')}</button>
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
                <h1 className="text-2xl font-bold text-white">{t('public.booking.reserveYourSpot')}</h1>
                <p className="text-neutral-400">{t('public.booking.slotLabel')}: {formatSlotRange(slot?.fechaHoraInicio, slot?.fechaHoraFin)}</p>
                <p className="text-neutral-400">{t('public.booking.capacity')}: {slot?.capacidadMax} — {t('public.booking.availableSeats')}: {availableSeats}</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">
                {/* fullName */}
                <div>
                  <form.Field name="fullName" validators={{ onChange: ({ value }) => !value ? 'Nombre completo es requerido' : undefined }}>
                    {(field: any) => (
                      <>
                        <label className="block text-white mb-2 text-sm">{t('public.booking.fullNameLabel')}</label>
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
                        <label className="block text-white mb-2 text-sm">{t('public.booking.emailLabel')}</label>
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
                      <label className="block text-white mb-2 text-sm">{t('public.booking.phoneLabel')}</label>
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
                        <label className="block text-white mb-2 text-sm">{t('public.booking.peopleCountLabel')}</label>
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
                        <label className="block text-white mb-2 text-sm">{t('public.booking.notesLabel')}</label>
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
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-transparent border-2 border-gray-600 text-gray-300 py-3 rounded-lg">{t('public.booking.cancel')}</button>
                        <button type="button" onClick={() => form.handleSubmit()} disabled={!canSubmit} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold">
                          {isSubmitting || isSubmitting ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>{t('public.booking.bookingInProgress')}</span>
                            </div>
                          ) : (
                            t('public.booking.reserveNow')
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
