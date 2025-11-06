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
import { TourFeatures } from '../components/TourFeatures';
import { Navbar, Footer } from '../../../shared/components';
import { useTranslation } from 'react-i18next';

export function TourDetailPage() {
  const { tourId } = useParams<{ tourId: string }>();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: tour, isLoading, error } = useTourById(tourId || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">{t('public.tourDetail.loading')}</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-500 text-xl">{t('public.tourDetail.errorLoading', { message: error.message })}</div>
      </div>
    );
  }
  
  if (!tour) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">
          {t('public.tourDetail.notFound', { id: tourId })}
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
            highlights={tour.highlights || []} // Nuevo prop
          />
        );
      case 'itinerary':
        return <TourItinerary itinerary={tour.itinerary || []} />; // Nuevo prop
      case 'reviews':
        return <TourReviews averageRating={0} totalReviews={0} />;
      default:
        return (
          <TourOverview 
            description={tour.descripcion}
            includes={tour.incluye || []}
            notIncludes={tour.noIncluye || []}
            highlights={tour.highlights || []} // Nuevo prop
          />
        );
    }
  };

  return (
   <>
   <div className="tour-detail bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 min-h-screen pt-24">
      <Navbar/>
      
      {/* Galería de imágenes */}
      <TourImageGallery images={tour.imagenes || []} />
      
      {/* Contenido principal */}
      <div className="relative text-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16 xl:px-20 py-8 max-w-7xl">
          {/* Header con título, ubicación y precio */}
          <TourHeader 
            title={tour.titulo}
            location={tour.ciudad || 'Ubicación no especificada'}
            price={tour.precio}
          />
          
          {/* Features rápidas usando el componente */}
          <TourFeatures 
            rating={typeof tour.ratingPromedio === 'number' ? tour.ratingPromedio : 0}
            duration={tour.duracion || 180}
            capacity={15}
            transportation={['Transporte privado']} 
            meetingPoint={''}          />
          
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
    <Footer />
    </>
  );
}