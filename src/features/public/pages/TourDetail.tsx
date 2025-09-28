import { useParams } from 'react-router-dom';
import { useTourById } from '../hooks/useTourById';
import { TourImageGallery } from '../components/TourImageGallery';
import { TourHeader } from '../components/TourHeader';
import { TourDescription } from '../components/TourDescription';
import { TourFeatures } from '../components/TourFeatures';

export function TourDetailPage() {
  const { tourId } = useParams<{ tourId: string }>();
  
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

  return (
    <div className="tour-detail bg-gray-900 min-h-screen">
      {/* Galería de imágenes - ya tiene su propio container */}
      <TourImageGallery images={tour.imagenes || []} />
      
      {/* Contenido principal */}
      <div className="relative bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header con título, ubicación y precio */}
          <TourHeader 
            title={tour.titulo}
            location={tour.ciudad || 'Ubicación no especificada'}
            price={tour.precio}
          />
          
          {/* Grid de contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            {/* Descripción - ocupa 2 columnas */}
            <div className="lg:col-span-2">
              <TourDescription description={tour.descripcion} />
            </div>
            
            {/* Features sidebar - ocupa 1 columna */}
            <div className="lg:col-span-1">
              <TourFeatures 
                rating={tour.ratingPromedio || 0}
                duration={tour.duracion}
                capacity={15} // Valor por defecto
                transportation={tour.incluye || []}
                meetingPoint={tour.puntoEncuentro || 'Por definir'}
                includes={tour.incluye || []}
                notIncludes={tour.noIncluye || []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}