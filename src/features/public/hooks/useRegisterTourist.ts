import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerTourist, registerTouristWithGoogle, completeGoogleTouristRegistration } from '../services/registerTourist';

export function useRegisterTourist(form: any) {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleUserData, setGoogleUserData] = useState<any>(null);
  const navigate = useNavigate();

  const handlePhotoChange = (file: File | null, field: any) => {
    field.handleChange(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const validatePhase1 = () => {
    const { nombreCompleto, email } = form.state.values;
    return nombreCompleto && email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const handleContinueToPhase2 = () => {
    if (validatePhase1()) {
      setCurrentPhase(2);
      setError('');
    } else {
      setError('Por favor completa todos los campos requeridos de esta fase');
    }
  };

  const handleBackToPhase1 = () => {
    setCurrentPhase(1);
    setError('');
  };

  const handleGoogleRegister = async () => {
    try {
      setError('');
      setIsGoogleLoading(true);
      const result = await registerTouristWithGoogle();
      if (result.user) {
        setGoogleUserData(result.user);
        form.setFieldValue('nombreCompleto', result.user.displayName || '');
        form.setFieldValue('email', result.user.email || '');
        setPhotoPreview(result.user.photoURL);
      }
    } catch (error: any) {
      setError(error.message || 'Error al registrarse con Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (value: any) => {
    try {
      setError('');
      let fotoPerfil = '';
      if (value.photo) {
        fotoPerfil = photoPreview || '';
      } else if (googleUserData?.photoURL) {
        fotoPerfil = googleUserData.photoURL;
      }
      if (googleUserData) {
        await completeGoogleTouristRegistration(googleUserData.uid, {
          nombreCompleto: value.nombreCompleto,
          email: value.email,
          contrasena: value.contraseña,
          telefono: value.telefono,
          genero: value.genero,
          fotoPerfil,
          descripcion: value.descripcion,
          idRol: 1,
        });
      } else {
        await registerTourist({
          nombreCompleto: value.nombreCompleto,
          email: value.email,
          contrasena: value.contraseña,
          telefono: value.telefono,
          genero: value.genero,
          fotoPerfil,
          descripcion: value.descripcion,
          idRol: 1,
        });
      }
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Error al crear la cuenta');
    }
  };

  return {
    currentPhase,
    setCurrentPhase,
    showPassword,
    setShowPassword,
    photoPreview,
    setPhotoPreview,
    isGoogleLoading,
    setIsGoogleLoading,
    error,
    setError,
    googleUserData,
    setGoogleUserData,
    handlePhotoChange,
    handleContinueToPhase2,
    handleBackToPhase1,
    handleGoogleRegister,
    handleSubmit,
    validatePhase1,
  };
}
