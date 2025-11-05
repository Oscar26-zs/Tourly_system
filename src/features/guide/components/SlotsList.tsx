import { useSlotsByGuide } from "../services/getSlotsByGuide";
import type { Slot } from "../../public/types/slot";
import { useTranslation } from 'react-i18next';

export default function SlotsList({ guideId }: { guideId?: string | null }) {
  const { data: slots = [], isLoading, isError, error } = useSlotsByGuide(guideId ?? undefined);
  const { t } = useTranslation();

  const formatDate = (iso?: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString();
  };

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
                      <strong className="text-zinc-300 block">{t('guide.slots.start')}</strong>
                      <span className="text-zinc-300 block">{formatDate((s as any).fechaHoraInicio)}</span>
                    </div>
                    <div className="mt-2">
                      <strong className="text-zinc-300 block">{t('guide.slots.end')}</strong>
                      <span className="text-zinc-300 block">{formatDate((s as any).fechaHoraFin)}</span>
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
                  <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-zinc-300 rounded-md hover:bg-neutral-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 3a7 7 0 100 14 7 7 0 000-14zM8 9a2 2 0 114 0 2 2 0 01-4 0z" />
                    </svg>
                    <span className="text-sm">{t('guide.slots.view')}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.464.263l-4 1a1 1 0 01-1.213-1.213l1-4a1 1 0 01.263-.464l9.9-9.9a2 2 0 012.828 0z" />
                    </svg>
                    <span className="text-sm">{t('guide.slots.edit')}</span>
                  </button>
                </div>

              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}