import { useForm } from '@tanstack/react-form';
import type { AnyFieldApi } from '@tanstack/react-form';
import { useRegisterGuide } from '../hooks/useRegisterGuide';

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

export default function RegisterGuide() {
  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      photo: null as File | null,
      password: '',
      phone: '',
      gender: '',
      description: '',
      acceptTerms: false,
    },
    onSubmit: async ({ value }) => {
      await registerGuideLogic.handleSubmit(value);
    },
  });

  const registerGuideLogic = useRegisterGuide(form);
  const {
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
    validatePhase1,
  } = registerGuideLogic;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#1E1E1E' }}>
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
            Become a <span style={{ color: '#228B22' }}>Tour Guide</span>
          </h1>
          <p className="text-[#B3B3B3] text-base">Register to share your tours and experiences</p>
          
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
               Basic Information
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
                profile details
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
            <div className="space-y-8">

              {/* Google User Info Display */}
              {googleUserData && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-400 font-medium">¡Connected to Google!</p>
                      <p className="text-green-300 text-sm">Basic information complete automatically</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column - Profile Photo */}
                <div className="lg:col-span-1 flex flex-col items-center justify-start">
                  <div className="w-full">
                    <h3 className="text-white font-medium mb-4 text-center">Profile Photo</h3>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center relative">
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
                        {googleUserData && photoPreview && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <form.Field
                        name="photo"
                        children={(field) => (
                          <>
                            <label className="relative cursor-pointer w-full">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handlePhotoChange(e.target.files?.[0] || null, field)}
                              />
                              <div
                                className=" py-3 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:cursor-pointer flex items-center justify-center space-x-2"
                                style={{
                                  background: 'linear-gradient(135deg, #228B22 100%)',
                                  boxShadow: '0 8px 25px rgba(34, 139, 34, 0.3)',
                                  color: '#FFFFFF',
                                  fontFamily: 'Inter, sans-serif',
                                  cursor: 'pointer'
                                }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>{photoPreview ? 'Change profile photo' : 'Upload profile photo'}</span>
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
                            <p className="text-[#B3B3B3] text-xs text-center">Optional Profile Photo. JPG or PNG up to 5MB.</p>
                            <FieldInfo field={field} />
                            {googleUserData && (
                              <p className="text-green-400 text-xs text-center">✓ Photo obtained from Google. You can change it if you want.</p>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Columns - Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Name Field */}
                  <div>
                    <form.Field
                      name="fullName"
                      validators={{
                        onChange: ({ value }) =>
                          !value ? 'Full name is required' : undefined,
                      }}
                      children={(field) => (
                        <>
                          <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                            Full Name <span className="text-red-400">*</span>
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
                              disabled={!!googleUserData}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              {googleUserData ? (
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              )}
                            </div>
                          </div>
                          {googleUserData && (
                            <p className="text-green-400 text-xs mt-1">✓ Full name obtained from Google</p>
                          )}
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
                            ? 'The email is required'
                            : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
                            ? 'Invalid email'
                            : undefined,
                      }}
                      children={(field) => (
                        <>
                          <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                            Email <span className="text-red-400">*</span>
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
                              disabled={!!googleUserData}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              {googleUserData ? (
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                              )}
                            </div>
                          </div>
                          {googleUserData && (
                            <p className="text-green-400 text-xs mt-1">✓ Email obtained from Google</p>
                          )}
                          <FieldInfo field={field} />
                        </>
                      )}
                    />
                  </div>

                  {/* Continue Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleContinueToPhase2}
                      className="w-full py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 hover:cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #228B22 100%)',
                        boxShadow: '0 8px 25px rgba(34, 139, 34, 0.3)',
                        color: '#FFFFFF',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Phase 2: Profile Details */}
          {currentPhase === 2 && (
            <div className="space-y-6">
              
              {/* Back Button */}
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={handleBackToPhase1}
                  className="flex items-center space-x-2 text-[#B3B3B3] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
                
                <div className="text-[#B3B3B3] text-sm">
                  Step 2 of 2
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Phone Field */}
                <div>
                  <form.Field
                    name="phone"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Phone is required' : undefined,
                    }}
                    children={(field) => (
                      <>
                        <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                          Phone <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id={field.name}
                            name={field.name}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm"
                            placeholder="Enter your phone number"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="w-4 h-4 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3l2 5h-5a11 11 0 0011 11v-5l5 2v3a2 2 0 01-2 2h-1C9 21 3 15 3 6V5z" />
                            </svg>
                          </div>
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
                          Gender <span className="text-red-400">*</span>
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
                            <option value="" className="bg-[#1E1E1E] text-[#B3B3B3]">Choose gender</option>
                            <option value="Male" className="bg-[#1E1E1E] text-white">Male</option>
                            <option value="Female" className="bg-[#1E1E1E] text-white">Female</option>
                            <option value="Other" className="bg-[#1E1E1E] text-white">Other</option>
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

                {/* Password Field */}
                <div className="md:col-span-2">
                  <form.Field
                    name="password"
                    validators={{
                      onChange: ({ value }) =>
                        !value
                          ? 'Password is required'
                          : value.length < 8
                          ? 'Password must be at least 8 characters'
                          : undefined,
                    }}
                    children={(field) => (
                      <>
                        <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                          Password <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <input
                            id={field.name}
                            name={field.name}
                            type={showPassword ? "text" : "password"}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 pr-10 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm"
                            placeholder={googleUserData ? "Create a password for future logins" : "Enter your password"}
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {googleUserData && (
                          <p className="text-[#B3B3B3] text-xs mt-1">Necessary for future sessions without Google</p>
                        )}
                        <FieldInfo field={field} />
                      </>
                    )}
                  />
                </div>

                {/* Description Field */}
                <div className="md:col-span-2">
                  <form.Field
                    name="description"
                    validators={{
                      onChange: ({ value }) =>
                        value && value.length > 200 ? 'Description too long (maximum 200 characters)' : undefined,
                    }}
                    children={(field) => (
                      <>
                        <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                          Description (optional)
                        </label>
                        <textarea
                          id={field.name}
                          name={field.name}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm resize-none"
                          placeholder="Tell us a bit about yourself and your experience as a tour guide (max 200 characters)"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          rows={4}
                        />
                        <div className="flex justify-between items-center mt-1">
                          <FieldInfo field={field} />
                          <span className="text-[#B3B3B3] text-xs">
                            {field.state.value?.length || 0}/200
                          </span>
                        </div>
                      </>
                    )}
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="md:col-span-2">
                  <form.Field
                    name="acceptTerms"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'You must accept the terms and conditions' : undefined,
                    }}
                    children={(field) => (
                      <>
                        <div className="flex items-start space-x-3 bg-white/5 rounded-lg p-4 border border-white/10">
                          <input
                            id={field.name}
                            name={field.name}
                            type="checkbox"
                            className="mt-1 w-4 h-4 text-[#20B2AA] bg-transparent border-2 border-white/30 rounded focus:ring-[#20B2AA] focus:ring-1"
                            checked={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.checked)}
                            style={{ accentColor: '#228B22' }}
                          />
                          <div className="flex-1">
                            <label htmlFor={field.name} className="text-white text-sm leading-6">
                              I accept the{' '}
                              <a href="#" className="text-[#228B22] hover:underline font-medium">
                                Terms of Service
                              </a>
                              {' '}and the{' '}
                              <a href="#" className="text-[#228B22] hover:underline font-medium">
                                Privacy Policy
                              </a>{' '}
                              of Tourly. I understand that my information will be used to create my tour guide profile.
                            </label>
                          </div>
                        </div>
                        <FieldInfo field={field} />
                      </>
                    )}
                  />
                </div>

                {/* Submit Button */}
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
                            <span>Creating account...</span>
                          </div>
                        ) : (
                          'Create Guide Account'
                        )}
                      </button>
                    )}
                  />
                </div>
              </div>
            </div>
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
                    <span>{isGoogleLoading ? 'Signing in with Google...' : 'Sign in with Google'}</span>
                  </button>
                </div>
              )}
              <p className="text-[#B3B3B3] text-sm mb-3">
                Already have an account?
              </p>
              <div className="space-y-2">
                <a href="/login" className="block text-[#228B22] hover:underline font-bold text-sm">
                  Sign In
                </a>
                <div className="flex items-center justify-center space-x-2 text-xs text-[#B3B3B3]">
                  <span>Are you a tourist?</span>
                  <a href="/registerTourist" className="text-[#228B22] hover:underline font-bold">
                    Register here
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  }
