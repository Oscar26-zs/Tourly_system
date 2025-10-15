import type { 
  Provincia, 
  Canton, 
  Distrito, 
  ProvinciasResponse, 
  CantonesResponse, 
  DistritosResponse,
  CostaRicaLocation 
} from '../shared/types/costaRica';

const BASE_URL = 'https://api-geo-cr.vercel.app';

// Función auxiliar para hacer requests
async function apiRequest<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Obtener todas las provincias
export async function getProvincias(): Promise<Provincia[]> {
  const response = await apiRequest<ProvinciasResponse>('/provincias');
  return response.data;
}

// Obtener cantones de una provincia específica
export async function getCantonesByProvincia(provinciaId: number): Promise<Canton[]> {
  const response = await apiRequest<CantonesResponse>(`/provincias/${provinciaId}/cantones`);
  return response.data;
}

// Obtener todos los cantones (con paginación si es necesario)
export async function getAllCantones(): Promise<Canton[]> {
  const response = await apiRequest<CantonesResponse>('/cantones');
  
  // Si hay más páginas, obtenemos todas
  const allCantones = [...response.data];
  
  if (response.meta.totalPages > 1) {
    const promises = [];
    for (let page = 2; page <= response.meta.totalPages; page++) {
      promises.push(apiRequest<CantonesResponse>(`/cantones?page=${page}`));
    }
    
    const additionalPages = await Promise.all(promises);
    additionalPages.forEach(pageResponse => {
      allCantones.push(...pageResponse.data);
    });
  }
  
  return allCantones;
}

// Obtener distritos de un cantón específico
export async function getDistritosByCanton(cantonId: number): Promise<Distrito[]> {
  const response = await apiRequest<DistritosResponse>(`/cantones/${cantonId}/distritos`);
  return response.data;
}

// Obtener todos los distritos (con paginación)
export async function getAllDistritos(): Promise<Distrito[]> {
  const response = await apiRequest<DistritosResponse>('/distritos');
  
  const allDistritos = [...response.data];
  
  if (response.meta.totalPages > 1) {
    const promises = [];
    for (let page = 2; page <= response.meta.totalPages; page++) {
      promises.push(apiRequest<DistritosResponse>(`/distritos?page=${page}`));
    }
    
    const additionalPages = await Promise.all(promises);
    additionalPages.forEach(pageResponse => {
      allDistritos.push(...pageResponse.data);
    });
  }
  
  return allDistritos;
}

// Función para crear ubicaciones combinadas (provincias + cantones + distritos)
export async function getCombinedLocations(): Promise<CostaRicaLocation[]> {
  try {
    const [provincias, cantones, distritos] = await Promise.all([
      getProvincias(),
      getAllCantones(),
      getAllDistritos()
    ]);

    const locations: CostaRicaLocation[] = [];

    // Crear mapa de provincias para referencia rápida
    const provinciaMap = new Map<number, string>();
    provincias.forEach(provincia => {
      provinciaMap.set(provincia.idProvincia, provincia.descripcion);
    });

    // Crear mapa de cantones para referencia rápida
    const cantonMap = new Map<number, { descripcion: string; idProvincia: number }>();
    cantones.forEach(canton => {
      cantonMap.set(canton.idCanton, {
        descripcion: canton.descripcion,
        idProvincia: canton.idProvincia
      });
    });

    // Agregar provincias
    provincias.forEach(provincia => {
      locations.push({
        id: `provincia-${provincia.idProvincia}`,
        name: provincia.descripcion,
        type: 'provincia',
        fullName: `${provincia.descripcion}, Costa Rica`
      });
    });

    // Agregar cantones
    cantones.forEach(canton => {
      const provincia = provinciaMap.get(canton.idProvincia);
      locations.push({
        id: `canton-${canton.idCanton}`,
        name: canton.descripcion,
        type: 'canton',
        parentId: canton.idProvincia,
        fullName: `${canton.descripcion}, ${provincia}, Costa Rica`
      });
    });

    // Agregar distritos
    distritos.forEach(distrito => {
      const canton = cantonMap.get(distrito.idCanton);
      if (canton) {
        const provincia = provinciaMap.get(canton.idProvincia);
        locations.push({
          id: `distrito-${distrito.idDistrito}`,
          name: distrito.descripcion,
          type: 'distrito',
          parentId: distrito.idCanton,
          fullName: `${distrito.descripcion}, ${canton.descripcion}, ${provincia}, Costa Rica`
        });
      }
    });

    // Ordenar por relevancia: provincias primero, luego cantones, luego distritos
    // Dentro de cada tipo, ordenar alfabéticamente
    return locations.sort((a, b) => {
      // Orden por tipo
      const typeOrder = { provincia: 0, canton: 1, distrito: 2 };
      const typeComparison = typeOrder[a.type] - typeOrder[b.type];
      
      if (typeComparison !== 0) {
        return typeComparison;
      }
      
      // Si son del mismo tipo, ordenar alfabéticamente
      return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
    });

  } catch (error) {
    console.error('Error fetching Costa Rica locations:', error);
    throw error;
  }
}

// Función para buscar ubicaciones con filtro de texto
export function filterCostaRicaLocations(
  locations: CostaRicaLocation[], 
  searchText: string
): CostaRicaLocation[] {
  if (!searchText.trim()) {
    // Si no hay texto de búsqueda, mostrar solo provincias y cantones principales
    return locations.filter(location => 
      location.type === 'provincia' || location.type === 'canton'
    ).slice(0, 10);
  }

  const searchLower = searchText.toLowerCase();
  
  return locations
    .filter(location => 
      location.name.toLowerCase().includes(searchLower) ||
      location.fullName.toLowerCase().includes(searchLower)
    )
    .slice(0, 15); // Máximo 15 resultados
}