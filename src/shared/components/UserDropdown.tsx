import { useRef, useEffect } from 'react';
import { MapPin, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../app/providers/useAuth';
import { useNavigate } from 'react-router-dom';
import { logoutService } from '../../services/logoutService';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('Click fuera del dropdown');
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleMyTours = () => {
    console.log('Navegando a Mis Tours');
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logoutService();
      onClose();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-56 bg-neutral-900 border border-green-700/20 rounded-lg shadow-xl z-50"
      onClick={(e) => e.stopPropagation()}
    >
      {user ? (
        <div className="py-2">
          <div className="px-4 py-3 border-b border-neutral-700/50">
            <div className="text-white font-medium text-sm">{getUserName()}</div>
            <div className="text-zinc-400 text-xs">{user.email}</div>
          </div>
          
          <div
            onClick={handleMyTours}
            className="px-4 py-3 text-white hover:bg-green-700/20 cursor-pointer flex items-center gap-3"
          >
            <MapPin className="w-4 h-4 text-green-700" />
            <span>Mis Tours</span>
          </div>
          
          <div className="border-t border-neutral-700/50"></div>
          
          <div
            onClick={handleLogout}
            className="px-4 py-3 text-white hover:bg-red-600/20 cursor-pointer flex items-center gap-3"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      ) : (
        <div className="py-2">
          <div
            onClick={() => navigate('/login')}
            className="px-4 py-3 text-white hover:bg-green-700/20 cursor-pointer flex items-center gap-3"
          >
            <LogIn className="w-4 h-4 text-green-700" />
            <span>Iniciar Sesión</span>
          </div>
        </div>
      )}
    </div>
  );
}