import React, { useState, useEffect } from 'react';
import { User, Save, X, Camera } from 'lucide-react';
import { useUserProfileEditor } from '../hooks/useUpdateUserProfile';
import type { UserProfile } from '../types/userProfile';
import { useTranslation } from 'react-i18next';

export interface EditUserProfileSectionProps {
  userProfile: UserProfile | null;
  onCancel: () => void;
  onSave: () => void;
  className?: string;
}

interface ProfileFormData {
  nombreCompleto: string;
  telefono: string;
  genero: 'male' | 'female' | 'other' | '';
  fotoPerfil: string;
  descripcion: string;
}

export const EditUserProfileSection: React.FC<EditUserProfileSectionProps> = ({
  userProfile,
  onCancel,
  className = ''
}) => {
  const { t } = useTranslation();
  const { updateProfile, isUpdatingProfile, isLoading } = useUserProfileEditor();
  
  const [formData, setFormData] = useState<ProfileFormData>({
    nombreCompleto: '',
    telefono: '',
    genero: '',
    fotoPerfil: '',
    descripcion: ''
  });

  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Llenar el formulario con los datos del usuario cuando se carga
  useEffect(() => {
    if (userProfile) {
      setFormData({
        nombreCompleto: userProfile.nombreCompleto || '',
        telefono: userProfile.telefono || '',
        genero: userProfile.genero || '',
        fotoPerfil: userProfile.fotoPerfil || '',
        descripcion: userProfile.descripcion || ''
      });
    }
  }, [userProfile]);

  // Limpiar mensaje después de unos segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async () => {
    try {
      // Preparar datos filtrando valores vacíos
      const updateData: any = {};
      
      if (formData.nombreCompleto.trim()) {
        updateData.nombreCompleto = formData.nombreCompleto.trim();
      }
      if (formData.telefono.trim()) {
        updateData.telefono = formData.telefono.trim();
      }
      if (formData.genero) {
        updateData.genero = formData.genero;
      }
      if (formData.fotoPerfil.trim()) {
        updateData.fotoPerfil = formData.fotoPerfil.trim();
      }
      if (formData.descripcion.trim()) {
        updateData.descripcion = formData.descripcion.trim();
      }

      const result = await updateProfile(updateData);
      if (result.success) {
        setMessage({ type: 'success', text: t('profile.updateSuccess') });
        // Opcional: cerrar el modal después de un breve delay
        setTimeout(() => {
          onCancel();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || t('profile.updateFailed') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: t('profile.updateError') });
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="h-64 bg-neutral-800/50 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{t('profile.editProfile')}</h2>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg">
          <User className="w-5 h-5" />
          <h3 className="font-semibold">{t('profile.editProfileInformation')}</h3>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-6">
            <div className="relative">
              {formData.fotoPerfil ? (
                <img
                  src={formData.fotoPerfil}
                  alt={t('profile.picture')}
                  className="w-20 h-20 rounded-full object-cover border-2 border-green-700/30"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                <Camera className="w-3 h-3 text-white" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{t('profile.picture')}</h3>
              <p className="text-sm text-neutral-400">{t('profile.pictureUploadHint')}</p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">{t('profile.personalInformation')}</label>
            <input
              type="text"
              value={formData.nombreCompleto}
              onChange={(e) => setFormData(prev => ({ ...prev, nombreCompleto: e.target.value }))}
              className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder={t('profile.fullNamePlaceholder')}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">{t('profile.phone')}</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
              className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder={t('profile.phonePlaceholder')}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">{t('profile.gender')}</label>
            <select
              value={formData.genero}
              onChange={(e) => setFormData(prev => ({ ...prev, genero: e.target.value as 'male' | 'female' | 'other' | '' }))}
              className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="">{t('profile.genderPlaceholder')}</option>
              <option value="male">{t('profile.genderOptions.male')}</option>
              <option value="female">{t('profile.genderOptions.female')}</option>
              <option value="other">{t('profile.genderOptions.other')}</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">{t('profile.description')}</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              rows={4}
              className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
              placeholder={t('profile.descriptionPlaceholder')}
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isUpdatingProfile}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isUpdatingProfile ? t('profile.saving') : t('profile.saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};