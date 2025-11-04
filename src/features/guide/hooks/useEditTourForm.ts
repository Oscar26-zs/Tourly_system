import { useState, useEffect } from "react";
import type { Tour } from "../../public/types/tour";
import { useUpdateTour } from "./useUpdateTour";
import { uploadImageCloudinary } from "../services/uploadImage";

type ItineraryItem = {
  step: string;
  title: string;
  duration: string;
  description: string;
};

type UseEditTourFormProps = {
  tour: Tour;
  guideId?: string | null;
  onUpdated?: () => void;
};

export function useEditTourForm({ tour, guideId, onUpdated }: UseEditTourFormProps) {
  const mutation = useUpdateTour();
  const isLoading = mutation.status === "pending";

  // Estados básicos
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">("");
  const [duracion, setDuracion] = useState<number | "">("");
  const [ciudad, setCiudad] = useState("");
  const [puntoEncuentro, setPuntoEncuentro] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  // Estados para arrays
  const [incluye, setIncluye] = useState<string[]>([]);
  const [incluyeInput, setIncluyeInput] = useState("");
  const [noIncluye, setNoIncluye] = useState<string[]>([]);
  const [noIncluyeInput, setNoIncluyeInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightsInput, setHighlightsInput] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

  // Estados para itinerario
  const [itineraryTitle, setItineraryTitle] = useState("");
  const [itineraryDuration, setItineraryDuration] = useState("");
  const [itineraryDescription, setItineraryDescription] = useState("");

  // Estados para imagen
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cargar datos del tour cuando cambia
  useEffect(() => {
    if (tour) {
      const t = tour as any;
      setTitulo(t.title ?? t.titulo ?? "");
      setDescripcion(t.description ?? t.descripcion ?? "");
      setPrecio((t.price ?? t.precio) ?? "");
      setDuracion((t.duration ?? t.duracion) ?? "");
      setCiudad(t.city ?? t.ciudad ?? "");
      setPuntoEncuentro(t.meetingPoint ?? t.puntoEncuentro ?? "");
      setCategoriaId(t.categoryId ?? t.categoriaId ?? "");

      setIncluye(t.includes ?? t.incluye ?? []);
      setNoIncluye(t.notIncluded ?? t.noIncluye ?? []);
      setHighlights(t.highlights ?? []);
      setItinerary(t.itinerary ?? []);

      const imgs = t.images ?? t.imagenes ?? [];
      setPreviewUrl(
        Array.isArray(imgs) && imgs.length > 0 ? String(imgs[0]) : ""
      );
    }
  }, [tour]);

  // Preview de archivo local
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Funciones para manejar arrays - Incluye
  const addIncluye = () => {
    if (incluyeInput.trim()) {
      setIncluye([...incluye, incluyeInput.trim()]);
      setIncluyeInput("");
    }
  };

  const removeIncluye = (index: number) => {
    setIncluye(incluye.filter((_, i) => i !== index));
  };

  // Funciones para manejar arrays - No Incluye
  const addNoIncluye = () => {
    if (noIncluyeInput.trim()) {
      setNoIncluye([...noIncluye, noIncluyeInput.trim()]);
      setNoIncluyeInput("");
    }
  };

  const removeNoIncluye = (index: number) => {
    setNoIncluye(noIncluye.filter((_, i) => i !== index));
  };

  // Funciones para manejar arrays - Highlights
  const addHighlight = () => {
    if (highlightsInput.trim()) {
      setHighlights([...highlights, highlightsInput.trim()]);
      setHighlightsInput("");
    }
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // Funciones para manejar itinerario
  const addItineraryItem = () => {
    if (itineraryTitle.trim()) {
      const newItem: ItineraryItem = {
        step: String(itinerary.length + 1),
        title: itineraryTitle,
        duration: itineraryDuration,
        description: itineraryDescription,
      };
      setItinerary([...itinerary, newItem]);
      setItineraryTitle("");
      setItineraryDuration("");
      setItineraryDescription("");
    }
  };

  const removeItineraryItem = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index);
    // Renumerar los pasos
    const renumbered = updated.map((item, i) => ({
      ...item,
      step: String(i + 1),
    }));
    setItinerary(renumbered);
  };

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!titulo || !descripcion || precio === "" || duracion === "") {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setUploadingImage(true);
      let imageUrl = previewUrl;

      // Si hay un nuevo archivo, subirlo
      if (file) {
        const url = await uploadImageCloudinary(file);
        if (url) imageUrl = url;
      }

      const payload: any = {
        titulo,
        descripcion,
        precio: Number(precio),
        duracion: Number(duracion),
        ciudad,
        puntoEncuentro,
        categoriaId: categoriaId || null,
        incluye,
        noIncluye,
        highlights,
        itinerary,
        imagenes: imageUrl ? [imageUrl] : [],
      };

      await mutation.mutateAsync({ id: tour.id, data: payload, guideId });
      setSuccess("Tour updated successfully!");
      
      if (onUpdated) {
        setTimeout(() => {
          onUpdated();
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating tour:", err);
      setError((err as Error).message || "Error updating tour.");
    } finally {
      setUploadingImage(false);
    }
  };

  return {
    // Estados básicos
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    precio,
    setPrecio,
    duracion,
    setDuracion,
    ciudad,
    setCiudad,
    puntoEncuentro,
    setPuntoEncuentro,
    categoriaId,
    setCategoriaId,

    // Incluye
    incluye,
    incluyeInput,
    setIncluyeInput,
    addIncluye,
    removeIncluye,

    // No incluye
    noIncluye,
    noIncluyeInput,
    setNoIncluyeInput,
    addNoIncluye,
    removeNoIncluye,

    // Highlights
    highlights,
    highlightsInput,
    setHighlightsInput,
    addHighlight,
    removeHighlight,

    // Itinerario
    itinerary,
    itineraryTitle,
    setItineraryTitle,
    itineraryDuration,
    setItineraryDuration,
    itineraryDescription,
    setItineraryDescription,
    addItineraryItem,
    removeItineraryItem,

    // Imagen
    previewUrl,
    handleFileChange,
    uploadingImage,

    // Control del formulario
    error,
    success,
    isLoading,
    handleSubmit,
  };
}

export default useEditTourForm;
