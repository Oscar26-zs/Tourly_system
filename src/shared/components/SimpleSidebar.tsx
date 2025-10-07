import React from 'react';
import { User, BookCheck } from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface SimpleSidebarProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

export default function SimpleSidebar({ activeItem, onItemClick }: SimpleSidebarProps) {
  const sidebarItems: SidebarItem[] = [
    {
      id: 'profile',
      label: 'Perfil',
      icon: <User className="w-5 h-5" />,
      active: activeItem === 'profile'
    },
    {
      id: 'settings',
      label: 'Mis reservas',
      icon: <BookCheck className="w-5 h-5" />,
      active: activeItem === 'settings'
    },
  ];

  return (
    <div className="w-64 bg-gradient-to-r from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-xl text-white min-h-screen border-r border-green-700/20">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-green-700/20">
        <h2 className="text-lg font-semibold">Configuración</h2>
      </div>

      {/* Sidebar Content */}
      <div className="p-4">
        {/* Help Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-neutral-400 mb-3 uppercase tracking-wider">
            Help
          </h3>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
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
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}