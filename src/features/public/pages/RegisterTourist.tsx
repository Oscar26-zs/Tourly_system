import { useForm } from '@tanstack/react-form';
import { useTranslation } from 'react-i18next';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useRegisterTourist } from '../hooks/useRegisterTourist';
import { RegisterGuideStepOne } from '../../guide/components/RegisterGuideStepOne';
import { RegisterGuideStepTwo } from '../../guide/components/RegisterGuideStepTwo';
import { Navbar } from '../../../shared/components';

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
  const { t } = useTranslation();
  const form = useForm({
    defaultValues: {
      nombreCompleto: '',
      email: '',
      photo: null as File | null,
      contraseña: '',
      telefono: '',
      genero: '',
      descripcion: '',
      acceptTerms: false,
    },
    onSubmit: async ({ value }) => {
      await registerTouristLogic.handleSubmit(value);
    },
  });

  const registerTouristLogic = useRegisterTourist(form);
  const {
    currentPhase,
    showPassword,
    setShowPassword,
    photoPreview,
    isGoogleLoading,
    error,
    googleUserData,
    handlePhotoChange,
    handleContinueToPhase2,
    handleBackToPhase1,
    handleGoogleRegister,
  } = registerTouristLogic;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" 
               style={{ backgroundColor: '#228B22' }}>
            <svg width="32" height="32" fill="#f7fcf7ff" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            {t('public.registerTourist.title')}
          </h1>
          <p className="text-[#B3B3B3] text-base">{t('public.registerTourist.subtitle')}</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <div className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentPhase >= 1 ? 'bg-[#228B22] text-white' : 'bg-white/20 text-[#B3B3B3]'
                }`}
              >
                1
              </div>
              <span className={`ml-2 text-sm ${currentPhase >= 1 ? 'text-[#228B22]' : 'text-[#B3B3B3]'}`}>
                {t('public.registerTourist.progress.basicInfo')}
              </span>
            </div>
            <div className={`w-8 h-0.5 ${currentPhase >= 2 ? 'bg-[#228B22]' : 'bg-white/20'}`}></div>
            <div className="flex items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentPhase >= 2 ? 'bg-[#228B22] text-white' : 'bg-white/20 text-[#B3B3B3]'
                }`}
              >
                2
              </div>
              <span className={`ml-2 text-sm ${currentPhase >= 2 ? 'text-[#228B22]' : 'text-[#B3B3B3]'}`}>
                {t('public.registerTourist.progress.profileDetails')}
              </span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
             style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Phase 1: Basic Information */}
          {currentPhase === 1 && (
            <RegisterGuideStepOne
              form={form}
              photoPreview={photoPreview}
              googleUserData={googleUserData}
              handlePhotoChange={handlePhotoChange}
              handleContinueToPhase2={handleContinueToPhase2}
              FieldInfo={FieldInfo}
            />
          )}

          {/* Phase 2: Profile Details */}
          {currentPhase === 2 && (
            <RegisterGuideStepTwo
              form={form}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              googleUserData={googleUserData}
              handleBackToPhase1={handleBackToPhase1}
              FieldInfo={FieldInfo}
            />
          )}

          {/* Footer Links - Only show in Phase 1 */}
          {currentPhase === 1 && (
            <div className="mt-8 text-center border-t border-white/10 pt-6">
              {/* Google Register Button - Now at the bottom */}
              {!googleUserData && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={handleGoogleRegister}
                    disabled={isGoogleLoading}
                    className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {isGoogleLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    <span>{isGoogleLoading ? t('guide.register.google.signing') : t('guide.register.google.signIn')}</span>
                  </button>
                </div>
              )}
              <p className="text-[#B3B3B3] text-sm mb-3">
                {t('public.registerTourist.alreadyHaveAccount')}
              </p>
              <div className="space-y-2">
                <a href="/login" className="block text-[#228B22] hover:underline font-bold text-sm">
                  {t('public.registerTourist.signIn')}
                </a>
                <div className="flex items-center justify-center space-x-2 text-xs text-[#B3B3B3]">
                  <span>{t('public.registerTourist.areYouAGuide')}</span>
                  <a href="/registerGuide" className="text-[#228B22] hover:underline font-bold">
                    {t('public.registerTourist.registerHere')}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
