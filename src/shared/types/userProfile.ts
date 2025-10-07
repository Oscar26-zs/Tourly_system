// Types para el perfil del usuario y configuración

export interface UserProfile {
  // Información básica del usuario
  idUsuario: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  genero: 'male' | 'female' | 'other';
  fotoPerfil: string;
  
  // Información específica del turista
  idRol: number; // 1 para turista, 2 para guía
  activo: boolean;
  descripcion: string;
  
  // Contraseña (solo para cambios)
  contrasena?: string;
  
  // Fechas de sistema
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}

// Type para la edición del perfil (algunos campos son opcionales)
export interface UserProfileEdit {
  nombreCompleto?: string;
  email?: string;
  telefono?: string;
  genero?: 'male' | 'female' | 'other';
  fotoPerfil?: string;
  descripcion?: string;
  nuevaContrasena?: string;
  confirmarContrasena?: string;
  contrasenaActual?: string; // Para validar cambio de contraseña
}

