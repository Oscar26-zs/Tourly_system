// ...existing code...
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Tour } from "../../public/types/tour";
import { useGuideTours } from "../hooks/useToursByGuide";
import TourEditSheet from "./TourEditSheet";

export default function GuideToursSection({ guideId, onCreate }: { guideId?: string | null; onCreate?: () => void }) {
  const navigate = useNavigate();
  const { data: tours = [], isLoading, isError, error, refetch } = useGuideTours(guideId);

  // show up to 9 tours (3 columns x 3 rows)
  const visibleTours = (tours || []).slice(0, 9);

  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">My tours</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (onCreate) onCreate();
              else navigate("/guide/tours/new");
            }}
            className="px-3 py-1 bg-green-700 text-white rounded-md hover:bg-green-600"
          >
            Create tour
          </button>
        </div>
      </div>

      {isLoading && <div>Loading tours...</div>}
      {isError && <div className="text-red-400">{(error as Error)?.message || "Error loading tours"}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleTours.length === 0 && !isLoading && <div className="text-zinc-400 col-span-full">No tours yet.</div>}

        {visibleTours.map((t: Tour) => {
          // support english / spanish fields and img array
          const title = (t as any).title || (t as any).titulo || "Untitled tour";
          const description = (t as any).description || (t as any).descripcion || "";
          const price = (t as any).price ?? (t as any).precio;
          const images = (t as any).images || (t as any).imagenes || [];
          const imgUrl = Array.isArray(images) && images.length > 0 ? images[0] : null;

          return (
            <article
              key={t.id}
              className="group bg-neutral-800/40 rounded-lg border border-green-700/10 overflow-hidden flex flex-col h-full shadow-sm transition-transform duration-300 hover:-translate-y-1
                         hover:shadow-[0_30px_60px_rgba(34,197,94,0.08)] hover:border-green-600"
            >
              <div className="overflow-hidden">
                {imgUrl ? (
                  <img
                    src={String(imgUrl)}
                    alt={title}
                    className="w-full h-44 object-cover bg-neutral-700 transform transition-transform duration-500 ease-out group-hover:scale-105"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-44 bg-neutral-700 flex items-center justify-center text-zinc-400">
                    No image
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-1">{title}</h3>
                  {description && (
                    <p className="text-sm text-zinc-300 mb-3 max-h-16 overflow-hidden">
                      {description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 mt-3">
                  <div>
                    {price != null && (
                      <div className="text-lg font-semibold text-green-300">${price}</div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingTour(t); setSheetOpen(true); }}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-500"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Edit sheet */}
      <TourEditSheet
        open={sheetOpen}
        onClose={() => { setSheetOpen(false); setEditingTour(null); refetch(); }}
        tour={editingTour}
        guideId={guideId}
      />
    </section>
  );
}