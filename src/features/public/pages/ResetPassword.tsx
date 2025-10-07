import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from '@tanstack/react-form';
import { FieldInfo, Navbar } from '../../../shared/components';
import { verifyResetCode, confirmPasswordResetWithCode } from "../../../services/confirmPasswordReset";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [oobCode] = useState(searchParams.get('oobCode') || '');
  const [mode] = useState(searchParams.get('mode') || '');
  
  const [email, setEmail] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await confirmPasswordResetWithCode(oobCode, value.newPassword);
        setSuccess(true);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate("/login", { state: { message: "Contraseña actualizada exitosamente. Inicia sesión con tu nueva contraseña." } });
        }, 3000);
      } catch (error: any) {
        throw error;
      }
    },
  });

  // Verificar el código al cargar la página
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode || mode !== 'resetPassword') {
        setVerificationError("Enlace de recuperación inválido");
        setVerifying(false);
        return;
      }

      try {
        const userEmail = await verifyResetCode(oobCode);
        setEmail(userEmail);
        setVerifying(false);
      } catch (error: any) {
        setVerificationError(error.message);
        setVerifying(false);
      }
    };

    verifyCode();
  }, [oobCode, mode]);

  // Página de verificación
  if (verifying) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4 pt-24">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                 style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                     style={{ backgroundColor: '#228B22' }}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Verificando enlace
                </h1>
                <p className="text-[#B3B3B3] text-base">
                  Por favor espera mientras verificamos tu solicitud...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Página de error
  if (verificationError && !email) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4 pt-24">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                 style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                     style={{ backgroundColor: '#EF4444' }}>
                  <svg width="32" height="32" fill="#ffffff" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Enlace inválido
                </h1>
                <p className="text-[#B3B3B3] text-base mb-6">
                  {verificationError}
                </p>
                <Link 
                  to="/forgot-password" 
                  className="inline-block py-3 px-6 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #228B22 100%)',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  Solicitar nuevo enlace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Página de éxito
  if (success) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4 pt-24">
          <div className="w-full max-w-md">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                 style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                     style={{ backgroundColor: '#22C55E' }}>
                  <svg width="40" height="40" fill="#ffffff" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  ¡Contraseña actualizada!
                </h1>
                <p className="text-[#B3B3B3] text-base mb-6">
                  Tu contraseña ha sido cambiada exitosamente. Serás redirigido al login en unos segundos.
                </p>
                <div className="animate-pulse">
                  <div className="flex justify-center">
                    <div className="rounded-full h-2 w-2 bg-[#228B22] mx-1"></div>
                    <div className="rounded-full h-2 w-2 bg-[#228B22] mx-1"></div>
                    <div className="rounded-full h-2 w-2 bg-[#228B22] mx-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Página de formulario para nueva contraseña
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
             style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                 style={{ backgroundColor: '#228B22' }}>
              <svg width="32" height="32" fill="#f7fcf7ff" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Nueva contraseña
            </h1>
            <p className="text-[#B3B3B3] text-base">
              Crear una nueva contraseña para <strong className="text-white">{email}</strong>
            </p>
          </div>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="space-y-6"
              >
                {/* Campo Nueva Contraseña */}
                <div>
                  <form.Field
                    name="newPassword"
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
                          Nueva contraseña
                        </label>
                        <div className="relative">
                          <input
                            id={field.name}
                            name={field.name}
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 8 caracteres"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 pr-10 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm"
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
                
                {/* Campo Confirmar Contraseña */}
                <div>
                  <form.Field
                    name="confirmPassword"
                    validators={{
                      onChange: ({ value, fieldApi }) => {
                        const newPassword = fieldApi.form.getFieldValue('newPassword');
                        return !value
                          ? 'Por favor confirma tu contraseña'
                          : value !== newPassword
                          ? 'Las contraseñas no coinciden'
                          : undefined;
                      },
                    }}
                    children={(field) => (
                      <>
                        <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                          Confirmar contraseña
                        </label>
                        <div className="relative">
                          <input
                            id={field.name}
                            name={field.name}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repite tu nueva contraseña"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 pr-10 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#B3B3B3] hover:text-[#228B22] transition-colors"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
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
                
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  style={{
                    background: 'linear-gradient(135deg, #228B22 100%)',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, sans-serif'
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Actualizando...</span>
                    </div>
                  ) : (
                    "Actualizar contraseña"
                  )}
                </button>
                
                {/* Mostrar errores de envío */}
                {form.state.errors.length > 0 && (
                  <div className="text-red-400 text-center text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    {form.state.errors.join(', ')}
                  </div>
                )}
              </form>
            )}
          />
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="text-[#20B2AA] hover:text-[#17a2a2] text-sm font-medium transition-colors duration-200"
            >
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}