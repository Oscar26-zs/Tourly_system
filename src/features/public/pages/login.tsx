import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../../../app/config/firebase";
import { getUserData } from "../../../services/userService";
import { Navbar } from '../../../shared/components';

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const googleProvider = new GoogleAuthProvider();

  // Mostrar mensaje de éxito si viene de reset de contraseña
  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      setSuccess(message);
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => setSuccess(""), 5000);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validaciones básicas
    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico");
      setLoading(false);
      return;
    }

    if (!contrasena.trim()) {
      setError("Por favor ingresa tu contraseña");
      setLoading(false);
      return;
    }

    if (contrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      console.log("Intentando autenticar con:", { email });
      
      const userCredential = await signInWithEmailAndPassword(auth, email, contrasena);
      console.log("Usuario autenticado exitosamente:", {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      });
      
      // Usar el nuevo servicio para obtener/crear datos del usuario
      const userData = await getUserData(userCredential.user);
      
      if (!userData) {
        setError("Error al obtener datos del usuario. Inténtalo de nuevo.");
        setLoading(false);
        return;
      }
      
      console.log("Datos del usuario obtenidos:", userData);
      
      // Redirigir según el rol
      if (userData.idRol === 2) {
        navigate("/guide-only");
      } else if (userData.idRol === 1) {
        navigate("/");
      } else {
        setError("Rol no permitido.");
      }
    } catch (error: any) {
      
      // Manejo específico de errores de Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          setError("No existe una cuenta con este correo electrónico");
          break;
        case 'auth/wrong-password':
          setError("Contraseña incorrecta");
          break;
        case 'auth/invalid-email':
          setError("Formato de correo electrónico inválido");
          break;
        case 'auth/user-disabled':
          setError("Esta cuenta ha sido deshabilitada");
          break;
        case 'auth/too-many-requests':
          setError("Demasiados intentos fallidos. Inténtalo más tarde");
          break;
        case 'auth/network-request-failed':
          setError("Error de conexión. Verifica tu internet");
          break;
        case 'auth/invalid-credential':
          setError("Credenciales inválidas. Verifica tu correo y contraseña");
          break;
        default:
          setError(`Error de autenticación: ${error.message || 'Credenciales incorrectas'}`);
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Populate email field (password can't be retrieved from Google)
      setEmail(user.email || '');
      setContrasena('');

      // Ensure Firestore user exists and get role
      const userData = await getUserData(user);
      if (!userData) {
        setError('Error al obtener datos del usuario tras Google Sign-In');
        setIsGoogleLoading(false);
        return;
      }

      // Redirect according to role
      if (userData.idRol === 2) {
        navigate('/guide-only');
      } else if (userData.idRol === 1) {
        navigate('/');
      } else {
        setError('Rol no permitido.');
      }
    } catch (error: any) {
      // Log and fallback to redirect for popup issues
      console.error('Google sign-in error:', { code: error?.code, message: error?.message, raw: error });
      if (error?.code === 'auth/cancelled-popup-request' || error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/operation-not-supported-in-this-environment') {
        try {
          await signInWithRedirect(auth, googleProvider);
          // redirect will take over; nothing else to do now
          return;
        } catch (redirectError) {
          console.error('Redirect fallback failed:', redirectError);
          setError('Error iniciando sesión con Google. Intenta en otro navegador o sin extensiones.');
        }
      } else {
        setError(error?.message || 'Error iniciando sesión con Google');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

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
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Iniciar sesión
            </h1>
            <p className="text-[#B3B3B3] text-base">Accede con tu cuenta de Tourly</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2 text-sm">Correo electrónico</label>
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-2 text-sm">Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#20B2AA] focus:ring-1 focus:ring-[#20B2AA]/20 transition-all duration-200 text-sm"
              />
            </div>
            {/* Google Sign-In Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full mb-3 py-2 rounded-lg font-bold text-base transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-50"
                style={{ background: '#fff', color: '#222', fontFamily: 'Inter, sans-serif' }}
              >
                {isGoogleLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>{isGoogleLoading ? 'Iniciando con Google...' : 'Continuar con Google'}</span>
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #228B22 100%)',
                color: '#FFFFFF',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
            {success && (
              <div className="text-green-400 text-center text-sm bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-4">
                {success}
              </div>
            )}
            {error && <div className="text-red-400 text-center mt-2">{error}</div>}
            <div className="mt-4 text-center">
              <Link 
                to="/forgot-password" 
                className="text-[#20B2AA] hover:text-[#17a2a2] text-sm font-medium transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}