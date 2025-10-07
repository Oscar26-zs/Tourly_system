import { useState } from 'react';
import { Navbar, SimpleSidebar, UserProfileSection } from '../../../shared/components';
import UserBookingsSection from '../components/UserBookingSection';

const TouristSettings = () => {
  const [activeItem, setActiveItem] = useState('profile');

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'profile':
        return <UserProfileSection />;
      case 'settings':
        return <UserBookingsSection />;
      default:
        return <UserProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
      <Navbar />
      <div className="pt-24 flex">
        {/* Sidebar */}
        <SimpleSidebar activeItem={activeItem} onItemClick={handleItemClick} />
        
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TouristSettings