import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getCombinedLocations, filterCostaRicaLocations } from '../../services/costaRicaApi';
import type { CostaRicaLocation } from '../types/costaRica';

interface UseCostaRicaLocationsResult {
  locations: CostaRicaLocation[];
  filteredLocations: CostaRicaLocation[];
  isLoading: boolean;
  error: string | null;
  filterByText: (searchText: string) => void;
  getPopularDestinations: () => string[];
}

export function useCostaRicaLocations(): UseCostaRicaLocationsResult {
  const [locations, setLocations] = useState<CostaRicaLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<CostaRicaLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Cargar todas las ubicaciones al montar el componente
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const allLocations = await getCombinedLocations();
        setLocations(allLocations);
        
        // Inicialmente mostrar ubicaciones principales (sin filtro)
        const initialFiltered = filterCostaRicaLocations(allLocations, '');
        setFilteredLocations(initialFiltered);
        
      } catch (err) {
        console.error('Error loading Costa Rica locations:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar ubicaciones');
        
        // En caso de error, usar ubicaciones de fallback
        const fallbackLocations: CostaRicaLocation[] = [
          { id: 'fallback-1', name: t('costaRica.provinces.sanJose'), type: 'provincia', fullName: `${t('costaRica.provinces.sanJose')}, Costa Rica` },
          { id: 'fallback-2', name: t('costaRica.provinces.alajuela'), type: 'provincia', fullName: `${t('costaRica.provinces.alajuela')}, Costa Rica` },
          { id: 'fallback-3', name: t('costaRica.provinces.cartago'), type: 'provincia', fullName: `${t('costaRica.provinces.cartago')}, Costa Rica` },
          { id: 'fallback-4', name: t('costaRica.provinces.heredia'), type: 'provincia', fullName: `${t('costaRica.provinces.heredia')}, Costa Rica` },
          { id: 'fallback-5', name: t('costaRica.provinces.guanacaste'), type: 'provincia', fullName: `${t('costaRica.provinces.guanacaste')}, Costa Rica` },
          { id: 'fallback-6', name: t('costaRica.provinces.puntarenas'), type: 'provincia', fullName: `${t('costaRica.provinces.puntarenas')}, Costa Rica` },
          { id: 'fallback-7', name: t('costaRica.provinces.limon'), type: 'provincia', fullName: `${t('costaRica.provinces.limon')}, Costa Rica` },
        ];
        
        setLocations(fallbackLocations);
        setFilteredLocations(fallbackLocations);
        
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, []);

  // Función para filtrar ubicaciones por texto de búsqueda
  const filterByText = useCallback((searchText: string) => {
    const filtered = filterCostaRicaLocations(locations, searchText);
    setFilteredLocations(filtered);
  }, [locations]);

  // Función para obtener destinos populares (provincias principales)
  const getPopularDestinations = useCallback((): string[] => {
    // Retornar las provincias más conocidas como destinos populares
    const popularProvinces = locations
      .filter(location => location.type === 'provincia')
      .slice(0, 6) // Máximo 6 destinos populares
      .map(location => location.name);

    // Si no hay provincias cargadas, usar fallback
    if (popularProvinces.length === 0) {
      return [
        t('costaRica.provinces.sanJose'),
        t('costaRica.provinces.alajuela'),
        t('costaRica.provinces.cartago'),
        t('costaRica.provinces.heredia'),
        t('costaRica.provinces.guanacaste'),
        t('costaRica.provinces.puntarenas'),
      ];
    }

    return popularProvinces;
  }, [locations]);

  return {
    locations,
    filteredLocations,
    isLoading,
    error,
    filterByText,
    getPopularDestinations,
  };
}