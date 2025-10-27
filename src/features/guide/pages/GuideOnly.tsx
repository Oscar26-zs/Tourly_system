import { SimpleSidebar, Navbar } from "../../../shared/components";
import { useAuthState } from "../../../shared/hooks/useAuthState";
import { Navigate } from "react-router-dom";

type User = {
  idRol: number;
  // agrega otros campos si es necesario
};

export default function GuideOnly() {
  const { user, loading } = useAuthState() as { user: User | null, loading: boolean };

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.idRol !== 2) return <div>No tienes acceso a esta página.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 text-white">
      <div className="flex">
        {/* Sidebar guía */}
        <SimpleSidebar variant="guide" />

        {/* Area principal: navbar arriba y contenido con el mismo fondo que userSettings */}
        <div className="flex-1 min-h-screen flex flex-col">
          <Navbar hideBecomeHost />

          <main className="p-6 flex-1">
            <h1 className="text-2xl font-semibold mb-4">Panel de guía</h1>
            {/* Aquí va el contenido específico del panel del guía (lista de tours, etc.) */}
          </main>
        </div>
      </div>
    </div>
  );
}