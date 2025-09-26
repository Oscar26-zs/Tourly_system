import { Link, useLocation } from "react-router-dom";

export default function PasswordResetSent() {
  const location = useLocation();
  const email = location.state?.email || "";

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#1E1E1E' }}>
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
             style={{ boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                 style={{ backgroundColor: '#22C55E' }}>
              <svg width="40" height="40" fill="#ffffff" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Revisa tu correo
            </h1>
            <p className="text-[#B3B3B3] text-base mb-6">
              Hemos enviado un enlace de recuperación de contraseña a:
            </p>
            <p className="text-white font-semibold text-lg mb-6 bg-white/10 rounded-lg py-3 px-4">
              {email}
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
              <h3 className="text-blue-400 font-semibold mb-2">Instrucciones:</h3>
              <ul className="text-[#B3B3B3] text-sm text-left space-y-1">
                <li>• Revisa tu bandeja de entrada</li>
                <li>• También verifica la carpeta de spam</li>
                <li>• Haz clic en el enlace del correo</li>
                <li>• Sigue las instrucciones para crear una nueva contraseña</li>
              </ul>
            </div>
            <div className="space-y-3">
              <Link 
                to="/login" 
                className="block w-full py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 text-center"
                style={{
                  background: 'linear-gradient(135deg, #228B22 100%)',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Volver al inicio de sesión
              </Link>
              <Link 
                to="/forgot-password" 
                className="block w-full py-3 rounded-lg font-bold text-base transition-all duration-300 transform hover:scale-105 text-center border border-white/20 text-white hover:bg-white/5"
                style={{
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Reenviar correo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}