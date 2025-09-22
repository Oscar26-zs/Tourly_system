export interface Slot {
  id: string;
  idTour: any; // DocumentReference o string - Firebase puede usar ambos
  activo: boolean;
  asientosDisponibles: number;
  capacidadMax: number;
  fechaHoraFin: string;
  fechaHoraInicio: string;
  idSlot?: string; // Campo opcional que vi en Firebase
}