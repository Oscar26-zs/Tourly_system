import { useState } from 'react';
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import { useUserProfileById } from '../../../shared/hooks/useUserProfileById';
import { useAuth } from '../../../app/providers/useAuth';
import EditUserProfileSection from '../../../shared/components/EditUserProfileSection';

interface UserProfileSectionProps {
  className?: string;
}

export default function UserProfileSection({ className = '' }: UserProfileSectionProps) {
  const { user } = useAuth();
  const { data: userProfile, isLoading, error, isError, refetch } = useUserProfileById(user?.uid || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    refetch(); // Refrescar los datos después de guardar
  };

  // Si está en modo edición, mostrar el componente de edición
  if (isEditing) {
    return (
      <EditUserProfileSection
        onCancel={handleCancelEdit}
        onSave={handleSaveEdit}
        className={className}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-neutral-700 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 bg-neutral-700 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-neutral-700 rounded w-32 animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-neutral-800/50 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !userProfile) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Error loading profile</h3>
          <p className="text-red-300 text-sm">
            {error?.message || 'Could not load user information'}
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not available';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleLabel = (roleId: number) => {
    switch (roleId) {
      case 1: return 'Tourist';
      case 2: return 'Tour Guide';
      default: return 'User';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con foto y nombre */}
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          {userProfile.fotoPerfil ? (
            <img
              src={userProfile.fotoPerfil}
              alt={userProfile.nombreCompleto}
              className="w-20 h-20 rounded-full object-cover border-2 border-green-700/30"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          )}
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-neutral-900 flex items-center justify-center ${
            userProfile.activo ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white">{userProfile.nombreCompleto}</h2>
          <p className="text-green-400 font-medium">{getRoleLabel(userProfile.idRol)}</p>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Shield className="w-4 h-4" />
            <span>{userProfile.activo ? 'Active account' : 'Inactive account'}</span>
          </div>
        </div>
      </div>

      {/* Información del perfil */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        
        {/* Email */}
        <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-neutral-400">Email address</label>
              <p className="text-white font-medium">{userProfile.email}</p>
            </div>
          </div>
        </div>

        {/* Teléfono */}
        <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-neutral-400">Phone</label>
              <p className="text-white font-medium">
                {userProfile.telefono || 'Not provided'}
              </p>
            </div>
          </div>
        </div>

        {/* Género */}
        <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <label className="text-sm text-neutral-400">Gender</label>
              <p className="text-white font-medium">{userProfile.genero}</p>
            </div>
          </div>
        </div>

        {/* Fecha de registro */}
        {userProfile.fechaCreacion && (
          <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <label className="text-sm text-neutral-400">Member since</label>
                <p className="text-white font-medium">{formatDate(userProfile.fechaCreacion)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Descripción */}
        {userProfile.descripcion && (
          <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700/50">
            <label className="text-sm text-neutral-400 block mb-2">Description</label>
            <p className="text-white leading-relaxed">{userProfile.descripcion}</p>
          </div>
        )}
      </div>

      {/* Botón de editar */}
      <div className="flex justify-end pt-6">
        <button 
          onClick={handleEditClick}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Edit Profile
        </button>
      </div>
    </div>
  );
}