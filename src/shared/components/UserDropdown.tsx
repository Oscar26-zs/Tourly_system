import { useState, useRef, useEffect } from 'react';
import { User, LogOut, MapPin } from 'lucide-react';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    console.log(`Clicked: ${option}`);
    setIsOpen(false);
    // Aquí puedes agregar la lógica para cada opción
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Icon Button */}
      <button
        onClick={handleToggle}
        className="w-8 h-8 relative overflow-hidden cursor-pointer hover:bg-white/10 rounded-full p-1 transition-colors"
      >
        <User className="w-full h-full text-white" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-900/95 backdrop-blur-lg border border-green-700/20 rounded-lg shadow-lg shadow-black/50 z-50">
          <div className="py-2">
            {/* Mis Tours */}
            <button
              onClick={() => handleOptionClick('mis-tours')}
              className="w-full px-4 py-3 text-left text-white font-poppins hover:bg-green-700/20 transition-colors flex items-center gap-3"
            >
              <MapPin className="w-4 h-4 text-green-700" />
              <span>Mis Tours</span>
            </button>

            {/* Divider */}
            <div className="mx-4 h-px bg-gradient-to-r from-transparent via-green-700/30 to-transparent my-1"></div>

            {/* Cerrar Sesión */}
            <button
              onClick={() => handleOptionClick('cerrar-sesion')}
              className="w-full px-4 py-3 text-left font-poppins hover:bg-red-500/10 transition-colors flex items-center gap-3"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}