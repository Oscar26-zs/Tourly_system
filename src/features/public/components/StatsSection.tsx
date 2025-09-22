import { useEffect, useState } from 'react';
// import NumberFlow, { continuous, type Format } from '@number-flow/react';
// import clsx from 'clsx';

// Componente temporal para NumberFlow hasta que se instale la librería
const NumberFlow = ({ value, className }: { value: number; className?: string }) => (
  <span className={className}>{value}+</span>
);

export default function StatsSection() {
  const [stats, setStats] = useState({
    tours: 0,
    countries: 0,
    hosts: 0,
    travelers: 0
  });

  // Simular carga de datos con animación
  useEffect(() => {
    const timer = setTimeout(() => {
      // Animar los números gradualmente
      const intervals = [
        setInterval(() => {
          setStats(prev => ({
            ...prev,
            tours: Math.min(prev.tours + 5, 150)
          }));
        }, 50),
        setInterval(() => {
          setStats(prev => ({
            ...prev,
            countries: Math.min(prev.countries + 1, 25)
          }));
        }, 100),
        setInterval(() => {
          setStats(prev => ({
            ...prev,
            hosts: Math.min(prev.hosts + 8, 200)
          }));
        }, 40),
        setInterval(() => {
          setStats(prev => ({
            ...prev,
            travelers: Math.min(prev.travelers + 15, 500)
          }));
        }, 30)
      ];

      // Limpiar intervalos después de completar la animación
      setTimeout(() => {
        intervals.forEach(interval => clearInterval(interval));
      }, 3000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-center gap-36 flex-wrap">
      {/* Tours Available */}
      <div className="w-40 flex flex-col justify-center items-center gap-2.5 group">
        <div className="self-stretch text-center text-green-700 text-5xl font-bold font-inter transition-all duration-500 group-hover:scale-110 group-hover:text-green-600">
          <NumberFlow
            value={stats.tours}
            className="inline-block"
            // plugins={[continuous]}
            // locales="en-US"
            // format={format}
          />
        </div>
        <div className="self-stretch text-center text-zinc-400 text-2xl font-medium font-poppins transition-colors duration-300 group-hover:text-zinc-300">
          Tours available
        </div>
      </div>

      {/* Countries */}
      <div className="w-40 flex flex-col justify-center items-center gap-2.5 group">
        <div className="self-stretch text-center text-green-700 text-5xl font-bold font-inter transition-all duration-500  group-hover:scale-110 group-hover:text-green-600">
          <NumberFlow
            value={stats.countries}
            className="inline-block"
            // plugins={[continuous]}
            // locales="en-US"
            // format={format}
          />
        </div>
        <div className="self-stretch text-center text-zinc-400 text-2xl font-medium font-poppins transition-colors duration-300 group-hover:text-zinc-300">
          Countries
        </div>
      </div>

      {/* Happy Hosts */}
      <div className="w-40 flex flex-col justify-center items-center gap-2.5 group">
        <div className="self-stretch text-center text-green-700 text-5xl font-bold font-inter transition-all duration-500 group-hover:scale-110 group-hover:text-green-600">
          <NumberFlow
            value={stats.hosts}
            className="inline-block"
            // plugins={[continuous]}
            // locales="en-US"
            // format={format}
          />
        </div>
        <div className="self-stretch text-center text-zinc-400 text-2xl font-medium font-poppins transition-colors duration-300 group-hover:text-zinc-300">
          Happy hosts
        </div>
      </div>

      {/* Happy Travelers */}
      <div className="w-48 flex flex-col justify-center items-center gap-2.5 group">
        <div className="self-stretch text-center text-green-700 text-5xl font-bold font-inter transition-all duration-500 group-hover:scale-110 group-hover:text-green-600">
          <NumberFlow
            value={stats.travelers}
            className="inline-block"
            // plugins={[continuous]}
            // locales="en-US"
            // format={format}
          />
        </div>
        <div className="self-stretch text-center text-zinc-400 text-2xl font-medium font-poppins transition-colors duration-300 group-hover:text-zinc-300">
          Happy Travelers
        </div>
      </div>
    </div>
  );
}