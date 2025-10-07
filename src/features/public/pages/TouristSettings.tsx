import { useState } from 'react';
import { Navbar } from '../../../shared/components';
import SimpleSidebar from '../../../shared/components/SimpleSidebar';

const TouristSettings = () => {
  const [activeItem, setActiveItem] = useState('profile');

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
            <p className="text-gray-300">Aquí puedes editar tu información personal.</p>
          </div>
        );
      case 'settings':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Configuraciones</h2>
            <p className="text-gray-300">Ajusta tus preferencias de la aplicación.</p>
          </div>
        );
      case 'help':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Ayuda</h2>
            <p className="text-gray-300">Encuentra respuestas a preguntas frecuentes.</p>
          </div>
        );
      case 'support':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Soporte</h2>
            <p className="text-gray-300">Contacta con nuestro equipo de soporte.</p>
          </div>
        );
      case 'feedback':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Feedback</h2>
            <p className="text-gray-300">Comparte tus comentarios y sugerencias.</p>
          </div>
        );
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
            <p className="text-gray-300">Aquí puedes editar tu información personal.</p>
          </div>
        );
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