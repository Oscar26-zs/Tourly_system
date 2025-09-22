import { Navbar } from '../../../shared/components';
import HeroSection from '../components/HeroSection';
import SearchSection from '../components/SearchSection';
import StatsSection from '../components/StatsSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-neutral-950 text-white relative">
      {/* Gradient overlay centered */}
      <div className="absolute inset-0 bg-gradient-radial from-[#228B22]/20 via-transparent to-transparent opacity-50"></div>
      
      <Navbar />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-16 px-4">
        <HeroSection />
        <SearchSection />
        <StatsSection />
      </div>
    </div>
  );
}