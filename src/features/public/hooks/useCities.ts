import { useMemo } from 'react';
import { useTours } from './useTours';

export const useCities = () => {
  const { data: tours = [], isLoading, error } = useTours();

  const { cities, popularDestinations } = useMemo(() => {
    if (!tours.length) return { cities: [], popularDestinations: [] };

    // Extraer ciudades y contar frecuencia
    const cityCount = new Map<string, number>();
    
    tours.forEach(tour => {
      if (tour.ciudad && tour.ciudad.trim()) {
        const city = tour.ciudad.trim();
        cityCount.set(city, (cityCount.get(city) || 0) + 1);
      }
    });

    // Convertir a arrays ordenados por popularidad (más tours primero)
    const sortedCities = Array.from(cityCount.entries())
      .sort((a, b) => {
        // Primero ordenar por cantidad de tours (descendente)
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }
        // Si tienen la misma cantidad, ordenar alfabéticamente
        return a[0].localeCompare(b[0]);
      })
      .map(([city]) => city);
    
    // Obtener los 5 destinos más populares (con más tours)
    const popularDestinations = sortedCities.slice(0, 5);

    return { cities: sortedCities, popularDestinations };
  }, [tours]);

  return {
    cities,
    popularDestinations,
    isLoading,
    error
  };
};