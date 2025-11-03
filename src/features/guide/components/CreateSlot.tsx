import { useState } from "react";
import type { CreateSlotInput } from "../services/createSlot";
import { useCreateSlot } from "../hooks/useCreateSlot";
import { useAuth } from "../../../app/providers/useAuth";

export default function AddSlotSection({
  tourId,
  guideId,
  onCreated,
  onCancel,
}: {
  tourId: string;
  guideId?: string | null;
  onCreated?: (id: string) => void;
  onCancel?: () => void;
}) {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [capacidadMax, setCapacidadMax] = useState<number | "">("");
  const [asientosDisponibles, setAsientosDisponibles] = useState<number | "">("");
  const [activo, setActivo] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const createSlot = useCreateSlot({
    onSuccess: (id) => {
      setSuccess("Slot creado correctamente.");
      setError(null);
      if (onCreated) onCreated(id);
      // opcional: limpiar formulario
      setFechaInicio("");
      setFechaFin("");
      setCapacidadMax("");
      setAsientosDisponibles("");
      setActivo(true);
    },
    onError: (err: any) => {
      setError(err?.message ?? "Error al crear el slot");
      setSuccess(null);
    },
  });

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // validaciones básicas
    if (!fechaInicio || !fechaFin) {
      setError("Por favor ingresa fecha/hora de inicio y fin.");
      return;
    }
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError("Fechas inválidas.");
      return;
    }
    if (end <= start) {
      setError("La fecha/hora de fin debe ser posterior a la de inicio.");
      return;
    }
    if (capacidadMax === "" || Number(capacidadMax) <= 0) {
      setError("Ingresa una capacidad máxima válida.");
      return;
    }
    if (asientosDisponibles === "" || Number(asientosDisponibles) < 0) {
      setError("Ingresa asientos disponibles válidos.");
      return;
    }

    const payload: CreateSlotInput & { guideId?: string } = {
      idTour: tourId,
      activo,
      asientosDisponibles: Number(asientosDisponibles),
      capacidadMax: Number(capacidadMax),
      fechaHoraInicio: start.toISOString(),
      fechaHoraFin: end.toISOString(),
    };

    // si se pasó guideId desde el padre (auth.uid), incluirlo para que el servicio guarde idGuia
    // solo asignar si es string para cumplir la firma esperada por useCreateSlot
    if (typeof guideId === "string" && guideId.length > 0) {
      payload.guideId = guideId;
    }

    // incluir el nombre legible del guía cuando esté disponible (displayName || email || uid)
    const guideName = user?.displayName ?? user?.email ?? user?.uid;
    if (typeof guideName === "string" && guideName.length > 0) {
      (payload as any).guideName = guideName;
    }

    console.debug("AddSlotSection - payload:", payload);
    createSlot.mutate(payload);
  };

  return (
    <section className="max-w-3xl w-full mx-auto bg-neutral-900/95 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Agregar slot</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Fecha y hora inicio
          </label>
          <input
            type="datetime-local"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Fecha y hora fin
          </label>
          <input
            type="datetime-local"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Capacidad máxima
            </label>
            <input
              type="number"
              min={1}
              value={capacidadMax}
                onChange={(e) => {
                  const val = e.target.value === "" ? "" : Number(e.target.value);
                  setCapacidadMax(val);
                  // Al poner la capacidad máxima, actualizar automáticamente
                  // los asientos disponibles con el mismo número.
                  setAsientosDisponibles(val);
                }}
              className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Asientos disponibles
            </label>
            <input
              type="number"
              min={0}
              value={asientosDisponibles}
              onChange={(e) =>
                setAsientosDisponibles(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full px-3 py-2 bg-neutral-800 text-white rounded border hover:cursor-not-allowed border-neutral-700"
          disabled
          />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="form-checkbox h-4 w-4 text-green-500"
            />
            Activo
          </label>
        </div>

        {error && <div className="text-red-400">{error}</div>}
        {success && <div className="text-green-400">{success}</div>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={createSlot.status === "pending"}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white disabled:opacity-60"
          >
            {createSlot.status === "pending" ? "Guardando..." : "Crear slot"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-white"
          >
            Cancelar
          </button>
        </div>
      </form>
    </section>
  );
}