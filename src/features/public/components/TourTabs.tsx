import { useState } from 'react';

interface TourTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TourTabs({ activeTab, onTabChange }: TourTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="border-b border-gray-700 mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-2 font-medium text-lg transition-colors duration-200 border-b-2 ${
              activeTab === tab.id
                ? 'text-green-400 border-green-400'
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