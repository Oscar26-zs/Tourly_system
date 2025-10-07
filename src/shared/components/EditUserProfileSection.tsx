import { useState, useEffect } from 'react';
import { User, Mail, Eye, EyeOff, Save, X, Camera } from 'lucide-react';
import { useUserProfileById } from '../../shared/hooks/useUserProfileById';
import { useUserProfileEditor } from '../../shared/hooks/useUpdateUserProfile';
import { useAuth } from '../../app/providers/useAuth';

interface EditUserProfileSectionProps {
  onCancel: () => void;
  onSave: () => void;
  className?: string;
}

export default function EditUserProfileSection({ 
  onCancel, 
  onSave, 
  className = '' 
}: EditUserProfileSectionProps) {
  const { user } = useAuth();
  const { data: userProfile, isLoading } = useUserProfileById(user?.uid || '');
  const {
    updateProfile,
    updateEmail,
    updatePassword,
    isUpdatingProfile,
    isUpdatingEmail,
    isUpdatingPassword
  } = useUserProfileEditor();

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    telefono: '',
    genero: 'other' as 'male' | 'female' | 'other',
    descripcion: '',
    fotoPerfil: ''
  });

  // Estados para cambio de email
  const [emailData, setEmailData] = useState({
    newEmail: '',
    currentPassword: '',
    showPassword: false
  });

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  // Estados de UI
  const [activeTab, setActiveTab] = useState<'profile' | 'email' | 'password'>('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cargar datos del perfil al componente
  useEffect(() => {
    if (userProfile) {
      setFormData({
        nombreCompleto: userProfile.nombreCompleto || '',
        telefono: userProfile.telefono || '',
        genero: userProfile.genero || 'other',
        descripcion: userProfile.descripcion || '',
        fotoPerfil: userProfile.fotoPerfil || ''
      });
      setEmailData(prev => ({ ...prev, newEmail: userProfile.email || '' }));
    }
  }, [userProfile]);

  // Limpiar mensaje después de 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        onSave();
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    }
  };

  const handleUpdateEmail = async () => {
    if (!emailData.currentPassword) {
      setMessage({ type: 'error', text: 'Please enter your current password' });
      return;
    }

    if (emailData.newEmail === userProfile?.email) {
      setMessage({ type: 'error', text: 'New email must be different from current email' });
      return;
    }

    try {
      const result = await updateEmail(emailData.newEmail, emailData.currentPassword);
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: result.message || 'Verification email sent! Check your inbox to complete the email change.' 
        });
        setEmailData(prev => ({ ...prev, currentPassword: '', newEmail: '' }));
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to send verification email' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all password fields' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    try {
      const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      if (result.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          showCurrentPassword: false,
          showNewPassword: false,
          showConfirmPassword: false
        });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
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
        <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
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

      {/* Tabs */}
      <div className="flex space-x-1 bg-neutral-800/50 rounded-lg p-1">
        {[
          { id: 'profile' as const, label: 'Profile Info', icon: User },
          { id: 'email' as const, label: 'Email', icon: Mail },
          { id: 'password' as const, label: 'Password', icon: Eye }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.fotoPerfil ? (
                  <img
                    src={formData.fotoPerfil}
                    alt="Profile"
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
                <h3 className="text-lg font-semibold text-white">Profile Picture</h3>
                <p className="text-sm text-neutral-400">Click the camera icon to upload a new picture</p>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.nombreCompleto}
                onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Gender</label>
              <select
                value={formData.genero}
                onChange={(e) => handleInputChange('genero', e.target.value)}
                className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Description</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={4}
                className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isUpdatingProfile}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Change Email Address</h3>
              <p className="text-sm text-neutral-400 mb-6">
                Enter your new email and current password. We'll send a verification link to your new email address to complete the change.
              </p>
            </div>

            {/* Current Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Current Email</label>
              <input
                type="email"
                value={userProfile?.email || ''}
                disabled
                className="w-full bg-neutral-700/30 border border-neutral-600 rounded-lg px-4 py-3 text-neutral-400"
              />
            </div>

            {/* New Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">New Email Address</label>
              <input
                type="email"
                value={emailData.newEmail}
                onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                placeholder="Enter new email address"
              />
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={emailData.showPassword ? 'text' : 'password'}
                  value={emailData.currentPassword}
                  onChange={(e) => setEmailData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setEmailData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {emailData.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Update Email Button */}
            <div className="flex justify-end">
              <button
                onClick={handleUpdateEmail}
                disabled={isUpdatingEmail}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {isUpdatingEmail ? 'Sending...' : 'Send Verification Email'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Change Password</h3>
              <p className="text-sm text-neutral-400 mb-6">
                Choose a strong password to keep your account secure.
              </p>
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={passwordData.showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordData(prev => ({ ...prev, showCurrentPassword: !prev.showCurrentPassword }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {passwordData.showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={passwordData.showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Enter new password (min. 6 characters)"
                />
                <button
                  type="button"
                  onClick={() => setPasswordData(prev => ({ ...prev, showNewPassword: !prev.showNewPassword }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {passwordData.showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={passwordData.showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-neutral-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordData(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {passwordData.showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Update Password Button */}
            <div className="flex justify-end">
              <button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}