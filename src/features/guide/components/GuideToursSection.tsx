// ...existing code...
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Tour } from "../../public/types/tour";
import { useGuideTours } from "../hooks/useToursByGuide";
import TourListItem from "./ui/TourListItem";
import GuideEditTourSection from "./EditTour";
import CreateSlot from "./CreateSlot";

export default function GuideToursSection({ guideId, onCreate }: { guideId?: string | null; onCreate?: () => void }) {
  const navigate = useNavigate();
  const { data: tours = [], isLoading, isError, error, refetch } = useGuideTours(guideId);

  // show up to 9 tours (3 columns x 3 rows)
  const visibleTours = (tours || []).slice(0, 9);

  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  // state to open AddSlotSection for a specific tour
  const [addingSlotForTourId, setAddingSlotForTourId] = useState<string | null>(null);

  // Si estamos editando un tour, mostrar el formulario de edición
  if (editingTour) {
    return (
      <GuideEditTourSection
        tour={editingTour}
        guideId={guideId}
        onUpdated={() => {
          setEditingTour(null);
          refetch();
        }}
        onCancel={() => setEditingTour(null)}
      />
    );
  }

  // Si estamos agregando un slot a un tour, mostrar la sección AddSlotSection
  if (addingSlotForTourId) {
    return (
      <CreateSlot
        tourId={addingSlotForTourId}
        onCreated={() => {
          setAddingSlotForTourId(null);
          refetch();
        }}
        onCancel={() => setAddingSlotForTourId(null)}
      />
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Mis Tours</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (onCreate) onCreate();
              else navigate("/guide/tours/new");
            }}
            className="px-3 py-1 bg-green-700 text-white rounded-md hover:bg-green-600"
          >
            Crear tour
          </button>
        </div>
      </div>

      {isLoading && <div>Cargando tours...</div>}
      {isError && <div className="text-red-400">{(error as Error)?.message || "Error cargando tours"}</div>}

      {/* Lista de tours */}
      <div className="space-y-4">
        {visibleTours.length === 0 && !isLoading && (
          <div className="text-zinc-400 text-center py-8">
            No tienes tours creados todavía.
          </div>
        )}

        {visibleTours.map((tour: Tour) => (
          <TourListItem
            key={tour.id}
            tour={tour}
            onEdit={() => {
              setEditingTour(tour);
            }}
            onAddSlot={() => {
              setAddingSlotForTourId(tour.id);
            }}
          />
        ))}
      </div>
    </section>
  );
}
// ...existing code...