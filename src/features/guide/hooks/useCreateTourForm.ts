import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useCreateTour } from "../hooks/useCreateTour";
import type { CreateTourInput } from "../services/createTour";
import { uploadImageCloudinary } from "../services/uploadImage";

type UseCreateTourFormProps = {
  guideId?: string | null;
  onCreated?: (id: string) => void;
};

export function useCreateTourForm({ guideId: guideIdProp, onCreated }: UseCreateTourFormProps) {
  const authUser = getAuth().currentUser;
  const guideId = guideIdProp ?? authUser?.uid ?? null;

  const createTour = useCreateTour();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">("");
  const [ciudad, setCiudad] = useState("");
  const [duracion, setDuracion] = useState<number | "">("");
  const [puntoEncuentro, setPuntoEncuentro] = useState("");
  const [categoriaId, setCategoriaId] = useState<string>("");

  const [incluyeInput, setIncluyeInput] = useState("");
  const [incluye, setIncluye] = useState<string[]>([]);
  const [noIncluyeInput, setNoIncluyeInput] = useState("");
  const [noIncluye, setNoIncluye] = useState<string[]>([]);

  const [highlightsInput, setHighlightsInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);

  type ItineraryItem = { step: string; title: string; duration: string; description: string };
  const [itineraryTitle, setItineraryTitle] = useState("");
  const [itineraryDuration, setItineraryDuration] = useState("");
  const [itineraryDescription, setItineraryDescription] = useState("");
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const resetForm = () => {
    setTitulo("");
    setDescripcion("");
    setPrecio("");
    setCiudad("");
    setDuracion("");
    setPuntoEncuentro("");
    setCategoriaId("");
    setIncluyeInput("");
    setIncluye([]);
    setNoIncluyeInput("");
    setNoIncluye([]);
    setHighlightsInput("");
    setHighlights([]);
    setItineraryTitle("");
    setItineraryDuration("");
    setItineraryDescription("");
    setItinerary([]);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  // incluye / noIncluye
  const addIncluye = () => {
    const v = incluyeInput.trim();
    if (!v) return;
    setIncluye((s) => [...s, v]);
    setIncluyeInput("");
  };
  const removeIncluye = (idx: number) => setIncluye((s) => s.filter((_, i) => i !== idx));
  const addNoIncluye = () => {
    const v = noIncluyeInput.trim();
    if (!v) return;
    setNoIncluye((s) => [...s, v]);
    setNoIncluyeInput("");
  };
  const removeNoIncluye = (idx: number) => setNoIncluye((s) => s.filter((_, i) => i !== idx));

  // highlights
  const addHighlight = () => {
    const v = highlightsInput.trim();
    if (!v) return;
    setHighlights((s) => [...s, v]);
    setHighlightsInput("");
  };
  const removeHighlight = (idx: number) => setHighlights((s) => s.filter((_, i) => i !== idx));

  // itinerary
  const addItineraryItem = () => {
    const title = itineraryTitle.trim();
    if (!title) return;
    const item: ItineraryItem = {
      step: String(itinerary.length + 1),
      title,
      duration: itineraryDuration.trim() || "",
      description: itineraryDescription.trim() || "",
    };
    setItinerary((s) => [...s, item]);
    setItineraryTitle("");
    setItineraryDuration("");
    setItineraryDescription("");
  };
  const removeItineraryItem = (idx: number) => setItinerary((s) => s.filter((_, i) => i !== idx));

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!titulo.trim()) {
      setError("Title is required");
      return;
    }
    if (precio === "" || Number(precio) < 0) {
      setError("Price must be a positive number");
      return;
    }

    try {
      setUploadingImage(true);
      let imagenes: string[] = [];

      if (file) {
        const url = await uploadImageCloudinary(file);
        if (url) imagenes = [url];
      }

      const payload: CreateTourInput = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        ciudad: ciudad.trim(),
        duracion: duracion === "" ? 0 : Number(duracion),
        puntoEncuentro: puntoEncuentro.trim(),
        incluye,
        noIncluye,
        highlights,
        itinerary,
        imagenes,
        idGuia: guideId ?? undefined,
        idCategoria: categoriaId || undefined,
        Activo: true,
      };

      // Debug: payload
      // eslint-disable-next-line no-console
      console.debug("CreateTour - payload to send:", JSON.parse(JSON.stringify(payload)));

      const id = await createTour.mutateAsync(payload);
      setSuccess("Tour created");
      resetForm();
      if (onCreated) onCreated(id);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError(err?.message || "Error creating tour");
    } finally {
      setUploadingImage(false);
    }
  };

  return {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    precio,
    setPrecio,
    ciudad,
    setCiudad,
    duracion,
    setDuracion,
    puntoEncuentro,
    setPuntoEncuentro,
    categoriaId,
    setCategoriaId,
    incluyeInput,
    setIncluyeInput,
    incluye,
    addIncluye,
    removeIncluye,
    noIncluyeInput,
    setNoIncluyeInput,
    noIncluye,
    addNoIncluye,
    removeNoIncluye,
    highlightsInput,
    setHighlightsInput,
    highlights,
    addHighlight,
    removeHighlight,
    itineraryTitle,
    setItineraryTitle,
    itineraryDuration,
    setItineraryDuration,
    itineraryDescription,
    setItineraryDescription,
    itinerary,
    addItineraryItem,
    removeItineraryItem,
    file,
    previewUrl,
    handleFileChange,
    uploadingImage,
    error,
    success,
    handleSubmit,
    resetForm,
  };
}

export default useCreateTourForm;
