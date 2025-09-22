import { useTours } from '../hooks/useTours';
import TourCard from './TourCard';

export default function TourGrid() {
  const { data: tours = [], isLoading, error, refetch } = useTours();

  const handleBookNow = (tourId: string) => {
    console.log('Reservar tour:', tourId);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-inter font-bold text-white mb-4">
              Featured Tours
            </h2>
            <p className="text-zinc-400 text-lg font-poppins">
              Discover handpicked experiences from around the world
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700 animate-pulse">
                <div className="h-64 bg-neutral-700" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-neutral-700 rounded w-3/4" />
                  <div className="h-6 bg-neutral-700 rounded w-full" />
                  <div className="h-4 bg-neutral-700 rounded w-full" />
                  <div className="h-4 bg-neutral-700 rounded w-2/3" />
                  <div className="flex justify-between">
                    <div className="h-8 bg-neutral-700 rounded w-16" />
                    <div className="h-8 bg-neutral-700 rounded w-20" />
                  </div>
                  <div className="h-12 bg-neutral-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-8">
            <h2 className="text-2xl font-inter font-bold text-red-400 mb-4">
              Error al cargar tours
            </h2>
            <p className="text-red-300 font-poppins mb-6">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
            <button 
              onClick={() => refetch()}
              className="bg-red-700 hover:bg-red-600 text-white font-inter font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Intentar nuevamente
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-inter font-bold text-white mb-4">
            Featured Tours
          </h2>
          <p className="text-zinc-400 text-lg font-poppins">
            Discover handpicked experiences from around the world
          </p>
        </div>

        {/* Grid de tours */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <TourCard 
                key={tour.id} 
                tour={tour} 
                onBookNow={handleBookNow}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg font-poppins">
              No hay tours disponibles en este momento.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}