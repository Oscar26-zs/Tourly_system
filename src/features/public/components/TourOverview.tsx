interface TourOverviewProps {
  description: string;
  includes: string[];
  notIncludes: string[];
  highlights?: string[];
}

import { useTranslation } from 'react-i18next';

export function TourOverview({ description, includes, notIncludes, highlights }: TourOverviewProps) {
  const { t } = useTranslation();
  const tourHighlights = highlights && highlights.length > 0 ? highlights : [];

  return (
    <div className="space-y-8">
      {/* Descripción */}
      <div>
        <p className="text-gray-300 text-lg leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tour Highlights */}
        <div className="bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{t('public.overview.highlightsTitle')}</h3>
          {tourHighlights.length > 0 ? (
            <ul className="space-y-3">
              {tourHighlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">•</span>
                  <span className="text-gray-300">{highlight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">{t('public.overview.noHighlights')}</p>
          )}
        </div>

        {/* What's Included */}
        <div className="bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">{t('public.overview.whatsIncluded')}</h3>
          
          {/* Incluye - Solo datos de Firebase */}
          {includes && includes.length > 0 ? (
            <div className="mb-6">
              <ul className="space-y-3">
                {includes.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-400 mr-3 mt-1">•</span>
                    <span className="text-gray-300">{String(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400 mb-6">{t('public.overview.noIncludes')}</p>
          )}

          {/* No incluye */}
          {notIncludes && notIncludes.length > 0 && (
            <div>
              <h4 className="text-lg font-medium text-white mb-3">{t('public.overview.notIncluded')}</h4>
              <ul className="space-y-2">
                {notIncludes.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-400 mr-3 mt-1">•</span>
                    <span className="text-gray-300">{String(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}