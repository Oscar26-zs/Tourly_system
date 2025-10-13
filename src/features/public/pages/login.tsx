import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { getUserData } from "../../../services/userService";
import { Navbar } from '../../../shared/components';

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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