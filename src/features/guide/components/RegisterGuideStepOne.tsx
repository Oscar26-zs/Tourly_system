import type { AnyFieldApi } from '@tanstack/react-form';

export function RegisterGuideStepOne({
  form,
  photoPreview,
  googleUserData,
  handlePhotoChange,
  handleContinueToPhase2,
  FieldInfo,
}: {
  form: any;
  photoPreview: string | null;
  googleUserData: any;
  handlePhotoChange: (file: File | null, field: AnyFieldApi) => void;
  handleContinueToPhase2: () => void;
  FieldInfo: React.FC<{ field: AnyFieldApi }>;
}) {
  return (
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
                  <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
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
                children={(field: AnyFieldApi) => (
                  <>
                    <label className="relative cursor-pointer w-full">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoChange(e.target.files?.[0] || null, field)}
                      />
                      <div
                        className="py-3 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:cursor-pointer flex items-center justify-center space-x-2"
                        style={{
                          background: 'linear-gradient(135deg, #228B22 100%)',
                          boxShadow: '0 8px 25px rgba(34, 139, 34, 0.3)',
                          color: '#FFFFFF',
                          fontFamily: 'Inter, sans-serif',
                          cursor: 'pointer',
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
          <form.Field
            name="nombreCompleto"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value ? 'Full name is required' : undefined,
            }}
            children={(field: AnyFieldApi) => (
              <div>
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
              </div>
            )}
          />

          {/* Email Field */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value
                  ? 'The email is required'
                  : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
                  ? 'Invalid email'
                  : undefined,
            }}
            children={(field: AnyFieldApi) => (
              <div>
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
              </div>
            )}
          />

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
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}