import { useState } from 'react';
import { Navbar, Footer } from '../../../shared/components';
import HeroSection from '../components/HeroSection';
import SearchSection from '../components/SearchSection';
import StatsSection from '../components/StatsSection';
import TourGrid from '../components/TourGrid';
import type { SearchFilters } from '../types/filters';

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-[#228B22]/40 via-[#228B22]/10 to-transparent opacity-80"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#228B22]/5 via-transparent to-[#228B22]/15 opacity-60"></div>
      
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-16 px-4 pt-18 md:pt-26">
        <HeroSection />
        <SearchSection onFiltersChange={handleFiltersChange} />
        <StatsSection />
      </div>

      {/* Tours Section */}
      <div className="relative z-10">
        <TourGrid filters={filters} />
      </div>
        <Footer />
    </div>
  );
}