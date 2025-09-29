import { Globe, User, Menu, X, LogOut, LogIn, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../app/providers/useAuth';
import { logoutService } from '../../services/logoutService';
import UserDropdown from './UserDropdown';

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();

  const handleBecomeHost = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleGoHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutService();
      setIsMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const toggleLanguage = () => {
    setIsLanguageOpen(prev => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-16 md:h-24 px-4 py-2.5 bg-gradient-to-r from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border-b border-green-700/20 flex justify-center items-center">
      <div className="w-full max-w-7xl flex justify-between items-center">
        
        {/* Logo - Become a host button (Desktop) */}
        <div className="hidden md:flex justify-center items-center gap-1">
          <button 
            onClick={handleBecomeHost}
            className="text-white text-xl lg:text-2xl font-medium font-inter hover:text-green-400 hover:cursor-pointer hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-200 cursor-pointer px-2 py-1 rounded-md"
          >
            Become a host
          </button>
        </div>

        {/* Navigation Links - Home button (Always visible) */}
        <div className="flex justify-start items-center cursor-pointer hover:cursor-pointer hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-200 px-2 py-1 rounded-md" onClick={handleGoHome}>
          <div className="w-8 h-8 md:w-9 md:h-9 relative">
            <Globe className="w-6 h-6 md:w-7 md:h-7 text-green-700 absolute top-1 left-1 hover:text-green-500 transition-colors duration-200" />
          </div>
          <button className="text-white text-xl md:text-2xl font-medium font-inter hover:cursor-pointer hover:text-green-400 transition-colors duration-200">
            Tourly
          </button>
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex justify-start items-center gap-3.5">
          <div className="w-6 h-6 relative cursor-pointer hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-200 p-1 rounded-md">
            <Globe className="w-6 h-6 relative text-white cursor-pointer hover:text-green-400 transition-colors duration-200" />
          </div>
          
          {/* User Dropdown Button */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-3 py-2 text-white hover:cursor-pointer hover:text-green-400 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-200 rounded-md"
            >
              {user ? (
                <>
                  <span className="text-sm">{getUserName()}</span>
                  <User className="w-4 h-4" />
                </>
              ) : (
                <User className="w-6 h-6" />
              )}
            </button>
            
            <UserDropdown 
              isOpen={isDropdownOpen} 
              onClose={() => setIsDropdownOpen(false)} 
            />
          </div>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white hover:text-green-400 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-200 p-2 rounded-md"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-neutral-900/98 backdrop-blur-xl border-b border-green-700/20 shadow-xl">
          <div className="flex flex-col py-4 px-4 space-y-2">
            
            {/* Become a host (Mobile) */}
            <button
              onClick={handleBecomeHost}
              className="text-left text-white hover:text-green-400 hover:bg-green-700/10 transition-all duration-200 px-4 py-3 rounded-md"
            >
              Become a host
            </button>

            <div className="border-t border-neutral-700/30 my-2"></div>

            {/* User Section */}
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-2">
                  <div className="text-white font-medium text-sm">{getUserName()}</div>
                  <div className="text-zinc-400 text-xs">{user.email}</div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 text-left text-white hover:text-red-400 hover:bg-red-600/10 transition-all duration-200 px-4 py-3 rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full flex items-center gap-3 text-left text-white hover:text-green-400 hover:bg-green-700/10 transition-all duration-200 px-4 py-3 rounded-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </button>
            )}

            <div className="border-t border-neutral-700/30 my-2"></div>

            {/* Language Section */}
            <div className="relative">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center gap-3 text-left text-white hover:text-green-400 hover:bg-green-700/10 transition-all duration-200 px-4 py-3 rounded-md"
              >
                <Languages className="w-4 h-4" />
                <span>Idioma</span>
              </button>
              
              {isLanguageOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  <button
                    onClick={() => {
                      console.log('Cambiar a Español');
                      setIsLanguageOpen(false);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-zinc-300 hover:text-white hover:bg-neutral-700/30 transition-all duration-200 px-4 py-2 rounded-md text-sm"
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => {
                      console.log('Cambiar a English');
                      setIsLanguageOpen(false);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-zinc-300 hover:text-white hover:bg-neutral-700/30 transition-all duration-200 px-4 py-2 rounded-md text-sm"
                  >
                    🇺🇸 English
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}