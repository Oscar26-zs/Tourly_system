interface TourFeaturesProps {
  rating: number;
  duration: number;
  capacity: number;
  transportation: string[];
  meetingPoint: string;
}

export function TourFeatures({ 
  rating, 
  duration, 
  capacity, 
  meetingPoint
}: TourFeaturesProps) {
  // Convertir duración de minutos a horas
  const durationInHours = duration >= 60 ? Math.round(duration / 60) : 1;
  
  return (
    <div className="space-y-6">
      {/* Características principales */}
      <div className="flex items-center justify-between py-6 border-b border-gray-700">
        {/* Rating */}
        <div className="flex items-center">
          <svg className="w-6 h-6 text-green-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-white font-semibold text-xl">{rating}</span>
        </div>

        {/* Duración */}
        <div className="flex items-center">
          <svg className="w-6 h-6 text-green-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-medium text-lg">{durationInHours} hour{durationInHours !== 1 ? 's' : ''}</span>
        </div>

        {/* Capacidad */}
        <div className="flex items-center">
          <svg className="w-6 h-6 text-green-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span className="text-white font-medium text-lg">Up to {capacity}</span>
        </div>

        {/* Transporte */}
        <div className="flex items-center">
          <svg className="w-6 h-6 text-green-700 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-medium text-lg">Transportation</span>
        </div>
      </div>

      {/* Punto de encuentro */}
      {meetingPoint && meetingPoint !== 'Por definir' && (
        <div className="pt-2">
          <h3 className="text-white font-semibold text-lg mb-3">Punto de encuentro:</h3>
          <p className="text-gray-300">{meetingPoint}</p>
        </div>
      )}
    </div>
  );
}