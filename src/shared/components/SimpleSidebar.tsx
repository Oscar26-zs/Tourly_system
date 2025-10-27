import React from 'react';
import { User, BookCheck, MapPin,  LogOut } from 'lucide-react';
import { logoutService } from '../../services/logoutService';
import { useNavigate } from 'react-router-dom';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface SimpleSidebarProps {
  variant?: 'public' | 'guide';
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  onLogout?: () => void;
}

export default function SimpleSidebar({
  variant = 'public',
  activeItem,
  onItemClick,
  onLogout
}: SimpleSidebarProps) {
  const navigate = useNavigate();
  // Items para la vista pública (mantener comportamiento actual)
  const publicItems: SidebarItem[] = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      active: activeItem === 'profile'
    },
    {
      id: 'settings',
      label: 'My Bookings',
      icon: <BookCheck className="w-5 h-5" />,
      active: activeItem === 'settings'
    },
  ];

  // Items para la vista del guía (admin)
  const guideMainItems: SidebarItem[] = [
    {
      id: 'tours',
      label: 'Tours',
      icon: <MapPin className="w-5 h-5" />,
      active: activeItem === 'tours'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: <BookCheck className="w-5 h-5" />,
      active: activeItem === 'bookings'
    },
  ];

   const handleLogout = async () => {
      try {
        await logoutService();
        onLogout?.();
        navigate('/login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    };

  return (
    <div className="w-64 bg-gradient-to-r from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-xl text-white min-h-screen border-r border-green-700/20 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-green-700/20">
        <h2 className="text-lg font-semibold">
          {variant === 'guide' ? 'Dashboard Guide' : 'Settings'}
        </h2>
      </div>

      {/* Sidebar Content */}
      <div className="p-4 flex-1">
        <nav className="space-y-1">
          {variant === 'public' &&
            publicItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick?.(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200
                  ${item.active
                    ? 'bg-neutral-700/60 text-white border border-green-700/30'
                    : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
                  }
                `}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))
          }

          {variant === 'guide' &&
            guideMainItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick?.(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200
                  ${item.active
                    ? 'bg-neutral-700/60 text-white border border-green-700/30'
                    : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
                  }
                `}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))
          }
        </nav>
      </div>

      {/* Bottom area: sólo en vista guía mostrar perfil y cerrar sesión */}
      {variant === 'guide' && (
        <div className="p-4 border-t border-green-700/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-neutral-300 hover:bg-red-600/10 hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      )}
    </div>
  );
}