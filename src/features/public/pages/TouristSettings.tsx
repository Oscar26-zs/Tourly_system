import { useState } from 'react';
import { Navbar, SimpleSidebar, UserProfileSection } from '../../../shared/components';

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
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
            <p className="text-gray-300">Here you can view and manage your tour bookings.</p>
          </div>
        );
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