interface ItineraryItem {
  time: string;
  title: string;
  duration: string;
  description: string;
}

interface TourItineraryProps {
  itinerary?: ItineraryItem[];
}

export function TourItinerary({ itinerary }: TourItineraryProps) {

  const tourItinerary = itinerary && itinerary.length > 0 ? itinerary : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Detailed Itinerary</h3>
      </div>

      <div className="space-y-6">
        {tourItinerary.map((item, index) => (
          <div key={index} className="flex gap-6">
            {/* Hora */}
            <div className="flex-shrink-0">
              <div className="text-green-700 font-semibold text-lg">
                {item.time}
              </div>
            </div>
            
            {/* Contenido */}
            <div className="flex-1 pb-6 border-b border-gray-700 last:border-b-0">
              <h4 className="text-white font-semibold text-lg mb-2">
                {item.title}
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                {item.duration}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}