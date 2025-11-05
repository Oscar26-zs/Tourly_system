import { MapPin, Clock, Users, Star } from 'lucide-react';
import type { Tour } from '../types/tour';
import { useSlotsByTour } from '../hooks/useSlotByTourId';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface TourCardProps {
  tour: Tour;
  onBookNow?: (tourId: string) => void;
}

export default function TourCard({ tour, onBookNow }: TourCardProps) {
  const { t } = useTranslation();
  // Hook para obtener slots del tour
  const { data: slots = [], isLoading: slotsLoading } = useSlotsByTour(tour.id);
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow(tour.id);
      navigate('/tour/' + tour.id);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return t('public.tourCard.minutes', { count: minutes });
    }
    const hours = Math.floor(minutes / 60);
    return t('public.tourCard.hours', { count: hours });
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  // Calcular capacidad máxima del tour
  const getMaxCapacity = () => {
    if (slots.length === 0) return 15; // Fallback
    return Math.max(...slots.map(slot => slot.capacidadMax || 0));
  };

  return (
    <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-700 hover:border-green-700/50 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/20 group">
      {/* Imagen del tour */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={tour.imagenes[0] || '/placeholder-tour.jpg'} 
          alt={tour.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Contenido de la card */}
      <div className="p-6 space-y-4">
        {/* Ubicación */}
        <div className="flex items-center text-zinc-400 text-sm font-poppins">
          <MapPin className="w-4 h-4 mr-2 text-green-700" />
          <span>{tour.ciudad}, {t('public.tourCard.country')}</span>
        </div>

        {/* Título */}
        <h3 className="text-white text-xl font-inter font-semibold leading-tight">
          {tour.titulo}
        </h3>

        {/* Descripción */}
        <p className="text-zinc-400 text-sm font-poppins line-clamp-2">
          {tour.descripcion}
        </p>

        {/* Información del tour */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-zinc-400 font-poppins">
            <Clock className="w-4 h-4 mr-1 text-green-700" />
            <span>{formatDuration(tour.duracion)}</span>
          </div>
          
          <div className="flex items-center text-zinc-400 font-poppins">
            <Users className="w-4 h-4 mr-1 text-green-700" />
            {slotsLoading ? (
              <span className="animate-pulse">{t('public.tourCard.loading')}</span>
            ) : (
              <span>{t('public.tourCard.upTo', { count: getMaxCapacity() })}</span>
            )}
          </div>
        </div>

        {/* Rating y precio */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center bg-green-700 text-white px-2 py-1 rounded-md text-sm font-poppins">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span>{tour.ratingPromedio.toFixed(1)}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-white text-2xl font-inter font-bold">
              {formatPrice(tour.precio)}
            </div>
            <div className="text-zinc-400 text-sm font-poppins line-through">
              ${Math.round(tour.precio * 1.3)}
            </div>
            <div className="text-zinc-400 text-sm font-poppins">{t('public.tourHeader.perPerson')}</div>
          </div>
        </div>

        {/* Botón de reserva */}
        <button
          onClick={handleBookNow}
          className="w-full bg-green-700 hover:bg-green-600 text-white font-inter font-medium py-3 px-4 hover:cursor-pointer rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-700/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          {t('public.tourCard.bookNow')}
        </button>
      </div>
    </div>
  );
}