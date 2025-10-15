import { useState } from 'react';
import { Navbar, SimpleSidebar, UserProfileSection } from '../components';
import UserBookingsSection from '../components/UserBookingSection';

const UserSettings = () => {
  // Show bookings by default
  const [activeItem, setActiveItem] = useState('settings');

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'settings':
        return <UserBookingsSection />;
      case 'profile':
        return <UserProfileSection />;
      default:
        return <UserBookingsSection />;
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

export default UserSettings