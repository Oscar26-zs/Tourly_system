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

  return <div>Solo el guía puede ver esta página.</div>;
}