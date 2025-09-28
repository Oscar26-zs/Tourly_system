interface ItineraryItem {
  time: string;
  title: string;
  duration: string;
  description?: string;
}

interface TourItineraryProps {
  meetingPoint: string;
}

export function TourItinerary({ meetingPoint }: TourItineraryProps) {
  const itineraryItems: ItineraryItem[] = [
    {
      time: "9:00 AM",
      title: `Meet at designated meeting point in ${meetingPoint || 'Manzanillo'}`,
      duration: "15 min",
      description: "Check-in and meet your tour guide and group"
    },
    {
      time: "9:15 AM",
      title: "Safety briefing and horse assignment (based on experience level)",
      duration: "20 min",
      description: "Learn basic riding techniques and safety protocols"
    },
    {
      time: "9:35 AM",
      title: "Begin horseback ride along the beach and coastal trails",
      duration: "60 min",
      description: "Enjoy stunning ocean views and pristine natural beauty"
    },
    {
      time: "10:35 AM",
      title: "Photo stop at a scenic viewpoint by the Caribbean Sea",
      duration: "20 min",
      description: "Capture memories with professional photos included"
    },
    {
      time: "10:55 AM",
      title: "Continue riding through lush coastal vegetation",
      duration: "45 min",
      description: "Experience diverse ecosystems and wildlife spotting"
    },
    {
      time: "11:40 AM",
      title: "Return to starting point and tour conclusion",
      duration: "20 min",
      description: "Final group photo and farewell"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Detailed Itinerary</h2>
        
        <div className="space-y-6">
          {itineraryItems.map((item, index) => (
            <div key={index} className="flex gap-6 pb-6 border-b border-gray-700 last:border-b-0">
              {/* Tiempo */}
              <div className="flex-shrink-0 w-24">
                <span className="text-green-400 font-semibold text-lg">
                  {item.time}
                </span>
              </div>
              
              {/* Contenido */}
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {item.duration}
                </p>
                {item.description && (
                  <p className="text-gray-300">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-gray-800 rounded-lg p-6 mt-8">
        <h3 className="text-xl font-semibold text-white mb-4">Important Information</h3>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start">
            <span className="text-yellow-400 mr-3 mt-1">⚠</span>
            <span>Please arrive 15 minutes before the scheduled start time</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-3 mt-1">⚠</span>
            <span>Wear comfortable clothing and closed-toe shoes</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-3 mt-1">⚠</span>
            <span>Bring sunscreen and a hat for sun protection</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-3 mt-1">⚠</span>
            <span>Maximum weight limit: 220 lbs (100 kg)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}