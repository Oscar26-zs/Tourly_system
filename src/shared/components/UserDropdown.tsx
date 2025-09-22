import { useState, useRef, useEffect } from 'react';
import { User, LogOut, MapPin, LogIn } from 'lucide-react';
import { useAuth } from '../../app/providers/useAuth';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('Click fuera del dropdown');
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    console.log('Toggling dropdown');
    setIsOpen(prev => !prev);
  };

  const handleMyTours = () => {
    console.log('Navegando a Mis Tours');
    setIsOpen(false);
  };

  const handleLogout = async () => {
    console.log('Cerrando sesión');
    try {
      await signOut(auth);
      setIsOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-8 h-8 hover:bg-white/10 rounded-full p-1 transition-colors"
      >
        <User className="w-full h-full text-white" />
      </button>

      {isOpen && (
        <div 
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
              
              <div className="mx-4 h-px bg-neutral-700/50"></div>
              
              <div
                onClick={handleLogout}
                className="px-4 py-3 text-red-400 hover:bg-red-500/10 cursor-pointer flex items-center gap-3"
              >
                <LogOut className="w-4 h-4 text-red-400" />
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
      )}
    </div>
  );
}
