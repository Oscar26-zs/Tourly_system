interface TourTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

import { useTranslation } from 'react-i18next';

export function TourTabs({ activeTab, onTabChange }: TourTabsProps) {
  const { t } = useTranslation();
  const tabs = [
    { id: 'overview', label: t('public.tourTabs.overview') },
    { id: 'itinerary', label: t('public.tourTabs.itinerary') },
    { id: 'reviews', label: t('public.tourTabs.reviews') }
  ];

  return (
    <div className="border-b border-gray-700 mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-2 font-medium text-lg transition-colors hover:cursor-pointer duration-200 border-b-2 ${
              activeTab === tab.id
                ? 'text-green-700 border-green-700'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}