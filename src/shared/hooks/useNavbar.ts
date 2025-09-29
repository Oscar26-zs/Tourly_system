import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/useAuth';
import { logoutService } from '../../services/logoutService';

export function useNavbar() {
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

  const handleLanguageChange = (language: string) => {
    console.log(`Cambiar a ${language}`);
    setIsLanguageOpen(false);
    setIsMenuOpen(false);
  };

  return {
    // Estados
    isMenuOpen,
    isLanguageOpen,
    isDropdownOpen,
    user,
    
    // Handlers
    handleBecomeHost,
    handleGoHome,
    handleLogin,
    handleLogout,
    handleLanguageChange,
    
    // Toggle functions
    toggleMenu,
    toggleLanguage,
    toggleDropdown,
    
    // Utility functions
    getUserName,
    
    // Setters para control externo
    setIsDropdownOpen,
  };
}