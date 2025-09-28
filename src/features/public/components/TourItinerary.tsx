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
  // Itinerario por defecto si no viene de Firebase
  const defaultItinerary: ItineraryItem[] = [
    {
      time: "9:00 AM",
      title: "Meet at designated meeting point in Manzanillo",
      duration: "15 min",
      description: "Check-in and meet your professional guide who will provide a safety briefing"
    },
    {
      time: "9:15 AM", 
      title: "Safety briefing and horse assignment (based on experience level)",
      duration: "20 min",
      description: "Learn basic riding techniques and get familiar with your horse"
    },
    {
      time: "9:35 AM",
      title: "Begin horseback ride along the beach and coastal trails",
      duration: "60 min",
      description: "Enjoy stunning views of the Caribbean Sea and pristine beaches"
    },
    {
      time: "10:35 AM",
      title: "Photo stop at a scenic viewpoint by the Caribbean Sea",
      duration: "20 min", 
      description: "Capture memories with professional photos and enjoy the ocean breeze"
    }
  ];

  const tourItinerary = itinerary && itinerary.length > 0 ? itinerary : defaultItinerary;

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
              <div className="text-green-400 font-semibold text-lg">
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