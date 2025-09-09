import { useForm } from '@tanstack/react-form';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useState } from 'react';
import { registerTourist } from '../../../services/registerTourist';

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-400 text-xs mt-1 block">{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? <span className="text-[#20B2AA] text-xs">Validating...</span> : null}
    </>
  );
}

export default function TouristRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      contrasena: '', // <-- usa "contrasena" en vez de "password"
      gender: '',
      photo: null as File | null,
      acceptTerms: false,
    },
    onSubmit: async ({ value }) => {
      let fotoPerfil = '';
      if (value.photo) {
        fotoPerfil = photoPreview || '';
      }
      await registerTourist({
        nombreCompleto: value.name,
        email: value.email,
        contrasena: value.contrasena,
        genero: value.gender,
        fotoPerfil,
        idRol: 1, // Turista
        telefono: '', // Puedes agregar campo si lo necesitas
        descripcion: '',
      });
      // Puedes redirigir o mostrar mensaje de éxito aquí
    },
  });

  const handlePhotoChange = (file: File | null, field: AnyFieldApi) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#1E1E1E' }}>
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" 
               style={{ backgroundColor: '#228B22' }}>
            <svg width="32" height="32" fill="#f7fcf7ff" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Join <span style={{ color: '#228B22' }}>Tourly</span>
          </h1>
          <p className="text-[#B3B3B3] text-base">Create your account to discover amazing experiences</p>
        </div>

        {/* Form Container - Horizontal Layout */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
             style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column - Profile Photo */}
            <div className="lg:col-span-1 flex flex-col items-center justify-start">
              <div className="w-full">
                <h3 className="text-white font-medium mb-4 text-center">Profile Photo</h3>
                
                {/* Photo Preview */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-16 h-16 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>

                  <form.Field
                    name="photo"
                    children={(field) => (
                      <>
                        <label className="relative cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handlePhotoChange(e.target.files?.[0] || null, field)}
                          />
                          <div className="bg-[#228B22] hover:bg-[#00695C] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>{photoPreview ? 'Change Photo' : 'Upload Photo'}</span>
                          </div>
                        </label>
                        
                        {photoPreview && (
                          <button
                            type="button"
                            onClick={() => handlePhotoChange(null, field)}
                            className="text-red-400 hover:text-red-300 text-sm underline"
                          >
                            Remove Photo
                          </button>
                        )}
                        
                        <p className="text-[#B3B3B3] text-xs text-center">Optional - JPG, PNG up to 5MB</p>
                        <FieldInfo field={field} />
                      </>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Right Columns - Form Fields */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Name Field */}
              <div>
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Name is required' : undefined,
                  }}
                  children={(field) => (
                    <>
                      <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          id={field.name}
                          name={field.name}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm"
                          placeholder="Enter your full name"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="w-4 h-4 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>

              {/* Email Field */}
              <div>
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? 'Email is required'
                        : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
                        ? 'Invalid email address'
                        : undefined,
                  }}
                  children={(field) => (
                    <>
                      <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          id={field.name}
                          name={field.name}
                          type="email"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm"
                          placeholder="Enter your email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="w-4 h-4 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                          </svg>
                        </div>
                      </div>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>

              {/* Contraseña Field */}
              <div>
                <form.Field
                  name="contrasena"
                  validators={{
                    onChange: ({ value }) =>
                      !value
                        ? 'La contraseña es obligatoria'
                        : value.length < 8
                        ? 'La contraseña debe tener al menos 8 caracteres'
                        : undefined,
                  }}
                  children={(field) => (
                    <>
                      <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                        Contraseña
                      </label>
                      <div className="relative">
                        <input
                          id={field.name}
                          name={field.name}
                          type={showPassword ? "text" : "password"}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 pr-10 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm"
                          placeholder="Ingresa tu contraseña"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#B3B3B3] hover:text-[#228B22] transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>

              {/* Gender Field */}
              <div>
                <form.Field
                  name="gender"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'Gender is required' : undefined,
                  }}
                  children={(field) => (
                    <>
                      <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                        Gender
                      </label>
                      <div className="relative">
                        <select
                          id={field.name}
                          name={field.name}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 appearance-none text-sm"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        >
                          <option value="" className="bg-[#1E1E1E] text-[#B3B3B3]">Select gender</option>
                          <option value="male" className="bg-[#1E1E1E] text-white">Male</option>
                          <option value="female" className="bg-[#1E1E1E] text-white">Female</option>
                          <option value="other" className="bg-[#1E1E1E] text-white">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>

              {/* Terms Checkbox - Full Width */}
              <div className="md:col-span-2">
                <form.Field
                  name="acceptTerms"
                  validators={{
                    onChange: ({ value }) =>
                      !value ? 'You must accept the terms and conditions' : undefined,
                  }}
                  children={(field) => (
                    <>
                      <div className="flex items-start space-x-3 bg-white/5 rounded-lg p-3 border border-white/10">
                        <input
                          id={field.name}
                          name={field.name}
                          type="checkbox"
                          className="mt-0.5 w-4 h-4 text-[#20B2AA] bg-transparent border-2 border-white/30 rounded focus:ring-[#20B2AA] focus:ring-1"
                          checked={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          style={{ accentColor: '#228B22' }}
                        />
                        <label htmlFor={field.name} className="text-white text-sm leading-5">
                          I agree to the{' '}
                          <a href="#" className="text-[#228B22] hover:underline">Terms of Service</a>
                          {' '}and{' '}
                          <a href="#" className="text-[#228B22] hover:underline">Privacy Policy</a>
                        </label>
                      </div>
                      <FieldInfo field={field} />
                    </>
                  )}
                />
              </div>

              {/* Submit Button - Full Width */}
              <div className="md:col-span-2">
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                      }}
                      className="w-full py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      style={{ 
                        background: canSubmit 
                          ? 'linear-gradient(135deg, #228B22 100%)' 
                          : '#B3B3B3',
                        boxShadow: canSubmit
                          ? '0 8px 25px rgba(34, 139, 34, 0.3)'
                          : 'none',
                        color: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      disabled={!canSubmit} 
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center border-t border-white/10 pt-4">
            <p className="text-[#B3B3B3] text-sm">
              Already have an account?{' '}
              <a href="#" className="text-[#228B22] hover:underline font-medium">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}