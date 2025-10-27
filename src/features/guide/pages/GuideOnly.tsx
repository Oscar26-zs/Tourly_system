import { useState } from "react";
import { getAuth } from "firebase/auth";
import { SimpleSidebar, Navbar } from "../../../shared/components";
import { useAuthState } from "../../../shared/hooks/useAuthState";
import { Navigate } from "react-router-dom";
import GuideToursSection from "../components/GuideToursSection";

type User = {
  idRol: number;
  // agrega otros campos si es necesario
};

export default function GuideOnly() {
  const [activeItem, setActiveItem] = useState('tours');

  const { user, loading } = useAuthState() as { user: User | null, loading: boolean };

  // fallback: usa el usuario autenticado de Firebase si el user del hook no contiene el id
  const firebaseAuthUser = getAuth().currentUser;
  const guideId = firebaseAuthUser?.uid
    || (user as any)?.uid
    || (user as any)?.id
    || (user as any)?.uidAuth
    || null;

  console.log('GuideOnly -> resolved guideId:', guideId);

  if (loading) return <div>Cargando...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.idRol !== 2) return <div>No tienes acceso a esta página.</div>;

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'tours':
        return <GuideToursSection guideId={guideId} />;
      case 'config':
        return (
          <section>
            <h2 className="text-lg font-medium mb-2">Configuración</h2>
            <div className="text-zinc-400">Aquí van las opciones de configuración del guía.</div>
          </section>
        );
      case 'profile':
        return (
          <section>
            <h2 className="text-lg font-medium mb-2">Perfil</h2>
            <div className="text-zinc-400">Información del perfil del guía.</div>
          </section>
        );
      default:
        return <GuideToursSection guideId={guideId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900/95 via-neutral-800/95 to-neutral-900/95 text-white">
      <div className="flex">
        <SimpleSidebar variant="guide" activeItem={activeItem} onItemClick={handleItemClick} />
        <div className="flex-1 min-h-screen flex flex-col">
          <Navbar hideBecomeHost />
        <main className="p-36 flex-1">
            <div className="max-w-4xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}