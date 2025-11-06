import { User, Menu, X, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import UserDropdown from './UserDropdown';
import { useNavbar } from '../hooks/useNavbar';

// ...existing code...

export default function Navbar({ hideBecomeHost = false }: { hideBecomeHost?: boolean }) {
  const { t } = useTranslation();
  const {
    // Estados
    isMenuOpen,
    isDropdownOpen,
    user,
    isHostDropdownOpen,
    
  // Handlers
  handleBecomeHost,
    handleGoHome,
    handleLogin,
    handleLogout,
    handleHostRegister,
    handleHostLogin,
    
  // Toggle functions
  toggleMenu,
  toggleDropdown,
    
    // Utility functions
    getUserName,
    
    // Setters
    setIsDropdownOpen,
  } = useNavbar();
  

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full h-16 md:h-24 px-4 py-2.5 bg-gradient-to-r from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border-b border-green-700/20 flex justify-center items-center">
      <div className="w-full max-w-7xl flex justify-between items-center">
        
  {/* Logo - Become a host button (Desktop) */}
      {!hideBecomeHost && (
    <div className="hidden md:flex justify-center items-center gap-1 relative">
      <button 
        onClick={handleBecomeHost}
        className="text-white text-xl lg:text-2xl font-medium font-inter hover:text-green-400 hover:cursor-pointer hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-200 cursor-pointer px-2 py-1 rounded-md"
      >
        {t('navbar.becomeHost')}
      </button>
      {/* Host dropdown for desktop */}
      {/* The dropdown will be positioned relative to this container */}
      {isHostDropdownOpen && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-neutral-900 border border-green-700/20 rounded-lg shadow-xl z-50">
          <div className="py-2">
            <div
              onClick={handleHostRegister}
              className="px-4 py-3 text-white hover:bg-green-700/20 cursor-pointer flex items-center gap-3"
            >
              <UserPlus className="w-4 h-4 text-green-700" />
              <span>{t('navbar.signUp')}</span>
            </div>

            <div
              onClick={handleHostLogin}
              className="px-4 py-3 text-white hover:bg-green-700/20 cursor-pointer flex items-center gap-3"
            >
              <LogIn className="w-4 h-4 text-green-700" />
              <span>{t('navbar.signIn')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )}

        {/* Navigation Links - Home button (Always visible) */}
        <div className="flex justify-start items-center cursor-pointer hover:cursor-pointer hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] transition-all duration-200 px-2 py-1 rounded-md" onClick={handleGoHome}>
          <button className="text-white text-xl md:text-2xl font-medium font-inter hover:cursor-pointer hover:text-green-400 transition-colors duration-200">
            {t('navbar.tourly')}
          </button>
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex justify-start items-center gap-3.5">
          {/* globe icon removed */}

          {/* Language selector (desktop) */}
          <LanguageSwitcher variant="compact" className="mr-2" />

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
            {!hideBecomeHost && (
              <button
                onClick={handleBecomeHost}
                className="text-left text-white hover:text-green-400 hover:bg-green-700/10 transition-all duration-200 px-4 py-3 rounded-md"
              >
                {t('navbar.becomeHost')}
              </button>
            )}

            {/* Host options for mobile */}
            <div className="pl-4">
              <button
                onClick={handleHostRegister}
                className="w-full flex items-center gap-3 text-left text-white hover:text-green-400 hover:bg-green-700/10 transition-all duration-200 px-4 py-3 rounded-md"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t('navbar.signUp')}</span>
              </button>

              <button
                onClick={handleHostLogin}
                className="w-full flex items-center gap-3 text-left text-white hover:text-green-400 hover:bg-green-700/10 transition-all duration-200 px-4 py-3 rounded-md"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('navbar.signIn')}</span>
              </button>
            </div>

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
                  <span>{t('navbar.signOut')}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full flex items-center gap-3 text-left text-white hover:text-green-400 hover:bg-green-700/10 transition-all duration-200 px-4 py-3 rounded-md"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('navbar.signIn')}</span>
              </button>
            )}

            <div className="border-t border-neutral-700/30 my-2"></div>

            {/* Language selector (mobile) - inline switcher */}
            <div className="w-full">
              <LanguageSwitcher variant="full" className="w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}