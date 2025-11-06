import { useSlotsByGuide } from "../services/getSlotsByGuide";
import type { Slot } from "../../public/types/slot";
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { db } from '../../../app/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function SlotsList({ guideId }: { guideId?: string | null }) {
  const { data: slots = [], isLoading, isError, error } = useSlotsByGuide(guideId ?? undefined);
  const { t } = useTranslation();

  const parseToDate = (v: any): Date | null => {
    if (!v) return null;
    if (typeof v === 'object') {
      if (typeof v.toDate === 'function') return v.toDate();
      if ('seconds' in v) return new Date((v.seconds as number) * 1000);
    }
    if (typeof v === 'number') return new Date(v);
    if (typeof v === 'string') return new Date(v);
    return null;
  };

  const formatSlotRange = (startRaw: any, endRaw: any) => {
    const start = parseToDate(startRaw);
    const end = parseToDate(endRaw);
    if (!start && !end) return '—';
    if (start && end) {
      const sameDay = start.toDateString() === end.toDateString();
      const day = start.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      const startTime = start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      const endTime = end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      return sameDay ? `${day} · ${startTime}–${endTime}` : `${start.toLocaleString()} — ${end.toLocaleString()}`;
    }
    if (start) return `${start.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} · ${start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    if (end) return `${end.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} · ${end.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    return '—';
  };

  // helper: extract id from DocumentReference or path-like string
  const idFromRefOrPath = (v: any) => {
    if (!v) return '';
    if (typeof v === 'object' && typeof v.id === 'string') return v.id;
    if (typeof v === 'string') {
      const parts = v.split('/').filter(Boolean);
      return parts.length ? parts[parts.length - 1] : v;
    }
    return '';
  };

  // state to cache tour titles by tourId
  const [tourTitles, setTourTitles] = useState<Record<string, string>>({});

  // Collect unique tour ids from slots
  const tourIds = useMemo(() => {
    return Array.from(new Set(slots.map((s: any) => idFromRefOrPath((s as any).idTour)).filter(Boolean)));
  }, [slots]);

  // Fetch tour titles for tourIds that are missing
  useEffect(() => {
    let mounted = true;
    (async () => {
      const missing = tourIds.filter(id => id && !tourTitles[id]);
      if (missing.length === 0) return;
      const updates: Record<string, string> = {};
      for (const id of missing) {
        try {
          const ref = doc(db, 'tours', id);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data: any = snap.data();
            updates[id] = data.titulo ?? data.title ?? data.name ?? t('guide.slots.tourFallback', { id });
          } else {
            updates[id] = t('guide.slots.tourFallback', { id });
          }
        } catch (e) {
          updates[id] = t('guide.slots.tourFallback', { id });
        }
      }
      if (!mounted) return;
      setTourTitles(prev => ({ ...prev, ...updates }));
    })();
    return () => { mounted = false; };
  }, [tourIds]);

  const guideDisplay = (s: any) => {
    // Prefer a stored guide name if available, else show the guide doc id or dash
    if (s.guiaName) return s.guiaName;
    if (s.guia || s.idGuia) {
      const ref = s.guia || s.idGuia;
      try {
        // DocumentReference from Firestore has an `id` property
        return typeof ref === "object" && ref?.id ? ref.id : String(ref);
      } catch {
        return String(ref);
      }
    }
    return "—";
  };

  if (!guideId) {
    return <div className="text-zinc-400">{t('guide.slots.noGuideSelected')}</div>;
  }

  if (isLoading) return <div className="text-zinc-400">{t('guide.slots.loading')}</div>;
  if (isError) return <div className="text-red-400">{t('guide.slots.loadError')}: {(error as Error)?.message}</div>;

  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-6">{t('guide.slots.header')}</h2>

      {slots.length === 0 ? (
        <div className="text-zinc-400">{t('guide.slots.noSlots')}</div>
      ) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
          {slots.map((s: Slot) => (
            <article
              key={s.id}
              className="relative bg-neutral-900/60 p-10 rounded-2xl shadow-lg border border-neutral-800 hover:shadow-2xl transition-shadow min-h-[14rem] flex flex-col justify-between"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="min-w-0 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                      <div className="leading-6">
                        <div className="font-semibold text-2xl text-white">{s.capacidadMax} {t('guide.slots.places')}</div>
                        <div className="text-sm text-zinc-300 mt-1">{s.asientosDisponibles} {t('guide.slots.available')}</div>
                      </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${s.activo ? "bg-green-900/30 text-green-300" : "bg-amber-900/30 text-amber-300"}`}
                    >
                      {s.activo ? t('guide.slots.active') : t('guide.slots.inactive')}
                    </span>
                  </div>

                  <div className="text-sm text-zinc-400 mt-0 leading-6">
                    <div>
                      <strong className="text-zinc-300 block">{t('guide.slots.tourLabel')}</strong>
                      {
                        (() => {
                          const tId = idFromRefOrPath((s as any).idTour);
                          return <span className="text-zinc-300 block">{tourTitles[tId] ?? (tId || '—')}</span>;
                        })()
                      }
                    </div>
                    <div className="mt-2">
                      <strong className="text-zinc-300 block">{t('guide.slots.scheduleLabel')}</strong>
                      <span className="text-zinc-300 block">{formatSlotRange((s as any).fechaHoraInicio, (s as any).fechaHoraFin)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-400 mt-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" />
                    </svg>
                    <span className="text-zinc-300">{t('guide.slots.guideLabel')}</span>
                    <span className="text-white ml-1">{guideDisplay(s)}</span>
                  </p>
                </div>

              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-3">
                    {/* Buttons removed per request */}
                </div>

              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}