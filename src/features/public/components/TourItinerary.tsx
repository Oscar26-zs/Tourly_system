interface ItineraryItem {
  step: string;
  title: string;
  duration: string;
  description: string;
}

interface TourItineraryProps {
  itinerary?: ItineraryItem[];
}

import { useTranslation } from 'react-i18next';

export function TourItinerary({ itinerary }: TourItineraryProps) {

  const { t } = useTranslation();
  const tourItinerary = itinerary && itinerary.length > 0 ? itinerary : [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">{t('public.itinerary.title')}</h3>
      </div>

      <div className="space-y-4">
        {tourItinerary.map((item, index) => (
          <div key={index} className="bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6">
            <div className="flex gap-6">
              {/* Hora */}
              <div className="flex-shrink-0">
                <div className="text-green-400 font-semibold text-lg">
                  {item.step}
                </div>
              </div>
              
              {/* Contenido */}
              <div className="flex-1">
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
          </div>
        ))}
        
        {tourItinerary.length === 0 && (
          <div className="bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">{t('public.itinerary.noItinerary')}</p>
            <p className="text-gray-500 mt-2">{t('public.itinerary.willBeProvided')}</p>
          </div>
        )}
      </div>
    </div>
  );
}