import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useTourById } from '../hooks/useTourById';
import { TourImageGallery } from '../components/TourImageGallery';
import { TourHeader } from '../components/TourHeader';
import { TourTabs } from '../components/TourTabs';
import { TourOverview } from '../components/TourOverview';
import { TourItinerary } from '../components/TourItinerary';
import { TourReviews } from '../components/TourReviews';
import { TourBookingButtons } from '../components/TourBookingButtons';
import { Navbar } from '../../../shared/components';

export function TourDetailPage() {
  const { tourId } = useParams<{ tourId: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: tour, isLoading, error } = useTourById(tourId || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Cargando tour...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-500 text-xl">Error al cargar el tour: {error.message}</div>
      </div>
    );
  }
  
  if (!tour) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">
          Tour con ID "{tourId}" no encontrado
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    // Lógica para reservar el tour
    console.log('Booking tour:', tourId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <TourOverview
            description={tour.descripcion}
            includes={tour.incluye || []}
            notIncludes={tour.noIncluye || []}
          />
        );
      case 'itinerary':
        return (
          <TourItinerary
            meetingPoint={tour.puntoEncuentro || 'Meeting point TBD'}
          />
        );
      case 'reviews':
        return (
          <TourReviews
            averageRating={tour.ratingPromedio || 0}
            totalReviews={tour.cantidadReseñas || 0}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="tour-detail bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 min-h-screen">
      <Navbar/>
      
      {/* Galería de imágenes */}
      <TourImageGallery images={tour.imagenes || []} />
      
      {/* Contenido principal */}
      <div className="relative text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header con título, ubicación y precio */}
          <TourHeader 
            title={tour.titulo}
            location={tour.ciudad || 'Ubicación no especificada'}
            price={tour.precio}
          />
          
          {/* Features rápidas debajo del header */}
          <div className="flex items-center justify-center gap-8 mt-8 p-6 bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-semibold text-lg">{tour.ratingPromedio || 'N/A'}</span>
            </div>

            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-medium">{Math.round((tour.duracion || 180) / 60)} hour{Math.round((tour.duracion || 180) / 60) !== 1 ? 's' : ''}</span>
            </div>

            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-white font-medium">Up to 15</span>
            </div>

            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-medium">Transportation</span>
            </div>
          </div>
          
          {/* Tabs de navegación */}
          <div className="mt-8">
            <TourTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          
          {/* Contenido de tabs */}
          <div>
            {renderTabContent()}
          </div>
          
          {/* Botones de reserva */}
          <TourBookingButtons 
            price={tour.precio}
            onBookNow={handleBookNow}
          />
        </div>
      </div>
    </div>
  );
}