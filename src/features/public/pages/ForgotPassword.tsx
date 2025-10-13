import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from '@tanstack/react-form';
import { FieldInfo, Navbar } from '../../../shared/components';
import { resetPassword } from "../../../services/resetPassword";

export default function ForgotPassword() {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await resetPassword(value.email);
        setSuccess(true);
        // Redirigir a página de confirmación después de 2 segundos
        setTimeout(() => {
          navigate("/password-reset-sent", { state: { email: value.email } });
        }, 2000);
      } catch (error: any) {
        // Los errores se manejan en el validador
        throw error;
      }
    },
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1E1E1E' }}>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
             style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
          {!success ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                     style={{ backgroundColor: '#228B22' }}>
                  <svg width="32" height="32" fill="#f7fcf7ff" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-6h2v6zm0-8h-2V7h2v4z"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  ¿Olvidaste tu contraseña?
                </h1>
                <p className="text-[#B3B3B3] text-base">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
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
                    <div>
                        <form.Field
                        name="email"
                        validators={{
                          onChange: ({ value }) =>
                            !value
                              ? 'Por favor ingresa tu correo electrónico'
                              : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
                              ? 'Por favor ingresa un correo electrónico válido'
                              : undefined,
                        }}
                        children={(field) => (
                          <>
                            <label htmlFor={field.name} className="block text-white font-medium mb-2 text-sm">
                              Correo electrónico
                            </label>
                            <div className="relative">
                              <input
                                id={field.name}
                                name={field.name}
                                type="email"
                                placeholder="tucorreo@ejemplo.com"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 pr-10 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm"
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
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        "Enviar enlace de recuperación"
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
            </>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                   style={{ backgroundColor: '#22C55E' }}>
                <svg width="32" height="32" fill="#ffffff" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                ¡Email enviado!
              </h2>
              <p className="text-[#B3B3B3] text-base mb-4">
                Hemos enviado un enlace de recuperación a <strong className="text-white">{form.getFieldValue('email')}</strong>
              </p>
              <p className="text-[#B3B3B3] text-sm">
                Revisa tu bandeja de entrada y sigue las instrucciones del correo
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}