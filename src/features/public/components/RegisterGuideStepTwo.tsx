import type { AnyFieldApi } from '@tanstack/react-form';

export function RegisterGuideStepTwo({
  form,
  showPassword,
  setShowPassword,
  googleUserData,
  handleBackToPhase1,
  FieldInfo,
}: {
  form: any;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  googleUserData: any;
  handleBackToPhase1: () => void;
  FieldInfo: React.FC<{ field: AnyFieldApi }>;
}) {
  return (
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
        <div className="text-[#B3B3B3] text-sm">Step 2 of 2</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Field */}
        <form.Field
          name="telefono"
          validators={{
            onChange: ({ value }) =>
              !value ? 'Phone is required' : undefined,
          }}
          children={(field: AnyFieldApi) => (
            <div>
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
            </div>
          )}
        />
        {/* Gender Field */}
        <form.Field
          name="genero"
          validators={{
            onChange: ({ value }) =>
              !value ? 'Gender is required' : undefined,
          }}
          children={(field: AnyFieldApi) => (
            <div>
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
                  <option value="Masculino" className="bg-[#1E1E1E] text-white">Male</option>
                  <option value="Femenino" className="bg-[#1E1E1E] text-white">Female</option>
                  <option value="Otro" className="bg-[#1E1E1E] text-white">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-[#B3B3B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <FieldInfo field={field} />
            </div>
          )}
        />
        {/* Password Field */}
        <form.Field
          name="contraseña"
          validators={{
            onChange: ({ value }) =>
              !value
                ? 'Password is required'
                : value.length < 8
                ? 'Password must be at least 8 characters'
                : undefined,
          }}
          children={(field: AnyFieldApi) => (
            <div className="md:col-span-2">
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
            </div>
          )}
        />
        {/* Description Field */}
        <form.Field
          name="descripcion"
          validators={{
            onChange: ({ value }) =>
              value && value.length > 200 ? 'Description too long (maximum 200 characters)' : undefined,
          }}
          children={(field: AnyFieldApi) => (
            <div className="md:col-span-2">
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
            </div>
          )}
        />
        {/* Terms Checkbox */}
        <form.Field
          name="acceptTerms"
          validators={{
            onChange: ({ value }) =>
              !value ? 'You must accept the terms and conditions' : undefined,
          }}
          children={(field: AnyFieldApi) => (
            <div className="md:col-span-2">
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
            </div>
          )}
        />
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
  );
}