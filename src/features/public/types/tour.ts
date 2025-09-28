export interface Tour {
  id: string;
  Activo: boolean;
  cantidadReseñas: number;
  ciudad: string;
  descripcion: string;
  duracion: number;
  fotos: string[];
  idCategoria: string;
  imagenes: string[];
  idGuia: string;
  idTour: string;
  incluye: string[];
  noIncluye: string[];
  precio: number;
  puntoEncuentro: string;
  ratingPromedio: number;
  titulo: string;
  ubicacion: {
    lat: number;
    lng: number;
  };
  itinerary?: ItineraryItem[];
  highlights?: string[];
}

interface ItineraryItem {
  time: string;
  title: string;
  duration: string;
  description: string;
}

// Tipo para las categorías
export interface Categoria {
  id: string;
  nombre: string;
}

// Tipo para los guías
export interface Guia {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  foto?: string;
}