// ...existing code...
import { useState } from "react";
import type { Tour } from "../../../public/types/tour";
import { useToggleTourStatus } from "../../hooks/useToggleTourStatus";
import { getUpcomingBookingsByTour, type UpcomingBooking } from "../../services/getUpcomingBookings";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';

interface TourListItemProps {
  tour: Tour;
  onEdit: () => void;
  onAddSlot: () => void; // nuevo prop opcional
}
export default function TourListItem({ tour, onEdit, onAddSlot }: TourListItemProps) {
  const { t } = useTranslation();
  const toggleStatus = useToggleTourStatus();
  const [isToggling, setIsToggling] = useState(false);

  // Obtener próximas reservas
  const { data: upcomingBookings = [] } = useQuery<UpcomingBooking[]>({
    queryKey: ["upcomingBookings", tour.id],
    queryFn: () => getUpcomingBookingsByTour(tour.id),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      await toggleStatus.mutateAsync({
        tourId: tour.id,
        newStatus: !tour.Activo,
      });
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setIsToggling(false);
    }
  };

  // Soporte para campos en español e inglés
  const title = (tour as any).title || tour.titulo || t('guide.ui.untitledTour');
  const description = (tour as any).description || tour.descripcion || "";
  const price = (tour as any).price ?? tour.precio ?? 0;
  const images = (tour as any).images || tour.imagenes || [];
  const imgUrl = Array.isArray(images) && images.length > 0 ? images[0] : null;

  // Formatear fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <article className="bg-neutral-800/40 rounded-lg border border-green-700/10 overflow-hidden hover:border-green-600 transition-all duration-300">
      <div className="flex flex-col sm:flex-row">
        {/* Imagen del tour */}
        <div className="sm:w-48 h-48 flex-shrink-0 overflow-hidden">
          {imgUrl ? (
            <img
              src={String(imgUrl)}
              alt={String(title)}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-zinc-400">
              {t('guide.ui.noImage')}
            </div>
          )}
        </div>

        {/* Información del tour */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{title}</h3>
                {description && (
                  <p className="text-sm text-zinc-400 line-clamp-2">{description}</p>
                )}
              </div>

              {/* Estado del tour */}
              <div className="flex-shrink-0">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    tour.Activo
                      ? "bg-green-900/40 text-green-300 border border-green-700"
                      : "bg-red-900/40 text-red-300 border border-red-700"
                  }`}
                >
                  {tour.Activo ? t('guide.ui.active') : t('guide.ui.inactive')}
                </span>
              </div>
            </div>

            {/* Precio */}
            <div className="mb-3">
              <span className="text-2xl font-bold text-green-400">${price}</span>
              <span className="text-sm text-zinc-400 ml-1">{t('guide.ui.perPerson')}</span>
            </div>

            {/* Próximas reservas */}
            {upcomingBookings.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase mb-2">
                  {t('guide.ui.upcomingBookings', { count: upcomingBookings.length })}
                </h4>
                <div className="space-y-1">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="text-sm text-zinc-300 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {formatDate(booking.tourDate)} - {booking.numberOfPeople} {booking.numberOfPeople === 1 ? t('guide.ui.personSingular') : t('guide.ui.personPlural')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors font-medium"
            >
              {t('guide.ui.edit')}
            </button>


            <button
              onClick={handleToggleStatus}
              disabled={isToggling}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                tour.Activo
                  ? "bg-neutral border border-green-700 hover:bg-green-800 text-white"
                  : "bg-green-600 hover:bg-green-500 text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isToggling ? t('common.loadingShort') : tour.Activo ? t('guide.ui.deactivate') : t('guide.ui.activate')}
            </button>
            {/* Nuevo botón Agregar slot */}
            <button
              onClick={onAddSlot}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors font-medium"
            >
              {t('guide.ui.addSlot')}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}