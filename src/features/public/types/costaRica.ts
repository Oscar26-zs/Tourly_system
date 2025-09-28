// Tipos para la API Geo CR - Costa Rica Geographic Data

export interface Provincia {
  idProvincia: number;
  descripcion: string;
}

export interface Canton {
  idCanton: number;
  idProvincia: number;
  descripcion: string;
}

export interface Distrito {
  idDistrito: number;
  idCanton: number;
  descripcion: string;
}

// Interfaces para las respuestas de la API
interface ApiMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  timestamp: string;
}

export interface ApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T[];
  meta: ApiMeta;
}

// Tipos específicos para las respuestas
export type ProvinciasResponse = ApiResponse<Provincia>;
export type CantonesResponse = ApiResponse<Canton>;
export type DistritosResponse = ApiResponse<Distrito>;

// Tipo unificado para ubicaciones de Costa Rica
export interface CostaRicaLocation {
  id: string;
  name: string;
  type: 'provincia' | 'canton' | 'distrito';
  parentId?: number;
  fullName: string; // ej: "San José, San José, Costa Rica"
}