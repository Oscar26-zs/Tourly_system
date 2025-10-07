import { Navbar } from '../../../shared/components';

const TouristSettings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
      <Navbar />
      <div className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Configuración del Turista</h1>
          <p className="text-lg text-gray-300">Aquí puedes ajustar tus preferencias y configuraciones.</p>
        </div>
      </div>
    </div>
  )
}

export default TouristSettings