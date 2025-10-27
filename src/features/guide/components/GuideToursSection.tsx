import { useNavigate } from "react-router-dom";
import type { Tour } from "../../public/types/tour";
import { useGuideTours } from "../hooks/useToursByGuide";

export default function GuideToursSection({ guideId }: { guideId?: string | null }) {
  const navigate = useNavigate();
  const { data: tours = [], isLoading, isError, error, refetch } = useGuideTours(guideId);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Mis tours</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/guide/tours/new")}
            className="px-3 py-1 bg-green-700 text-white rounded-md hover:bg-green-600"
          >
            Crear tour
          </button>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-neutral-800 text-white rounded-md hover:bg-neutral-700"
          >
            Actualizar
          </button>
        </div>
      </div>

      {isLoading && <div>Cargando tours...</div>}
      {isError && <div className="text-red-400">{(error as Error)?.message || "Error al cargar tours"}</div>}

      <div className="grid gap-3">
        {tours.length === 0 && !isLoading && <div className="text-zinc-400">No hay tours aún.</div>}

        {tours.map((t: Tour) => (
          <article
            key={t.id}
            className="p-4 bg-neutral-800/40 rounded-lg border border-green-700/10 flex flex-col sm:flex-row justify-between items-start gap-4"
          >
            <div className="flex-1">
              <h3 className="text-lg font-medium">{t.title}</h3>
              {t.descripcion && <p className="text-sm text-zinc-300 mt-1">{t.descripcion}</p>}
              <div className="text-sm text-green-300 mt-2">{t.precio ? `$${t.precio}` : null}</div>
              {t.ubicacion && (
                <div className="text-xs text-zinc-400 mt-1">
                  {typeof t.ubicacion === "string"
                    ? t.ubicacion
                    : `Lat: ${t.ubicacion.lat}, Lng: ${t.ubicacion.lng}`}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={() => navigate(`/guide/tours/${t.id}/edit`)}
                className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-500"
              >
                Editar
              </button>

              <button
                onClick={() => navigate(`/tours/${t.id}`)}
                className="px-3 py-1 bg-neutral-700 text-white rounded-md hover:bg-neutral-600"
              >
                Ver
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}