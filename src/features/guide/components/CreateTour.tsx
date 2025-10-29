import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useCreateTour } from "../hooks/useCreateTour";
import { uploadImageFile } from "../services/uploadImage";
import type { CreateTourInput } from "../services/createTour";

export default function GuideCreateTourSection({
  guideId: guideIdProp,
  onCreated,
}: {
  guideId?: string | null;
  onCreated?: (id: string) => void;
}) {
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

  // Helpers to manage incluye / noIncluye lists
  const addIncluye = () => {
    const v = incluyeInput.trim();
    if (!v) return;
    setIncluye((s) => [...s, v]);
    setIncluyeInput("");
  };

  const removeIncluye = (idx: number) => {
    setIncluye((s) => s.filter((_, i) => i !== idx));
  };

  const addNoIncluye = () => {
    const v = noIncluyeInput.trim();
    if (!v) return;
    setNoIncluye((s) => [...s, v]);
    setNoIncluyeInput("");
  };

  const removeNoIncluye = (idx: number) => {
    setNoIncluye((s) => s.filter((_, i) => i !== idx));
  };

  // Highlights helpers
  const addHighlight = () => {
    const v = highlightsInput.trim();
    if (!v) return;
    setHighlights((s) => [...s, v]);
    setHighlightsInput("");
  };

  const removeHighlight = (idx: number) => {
    setHighlights((s) => s.filter((_, i) => i !== idx));
  };

  // Itinerary helpers
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

  const removeItineraryItem = (idx: number) => {
    setItinerary((s) => s.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        // uploadImageFile should return download URL string
        const path = guideId ? `tours/${guideId}` : `uploads`;
        const url = await uploadImageFile(file, path);
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

      const id = await createTour.mutateAsync(payload);
      setSuccess("Tour created");
      resetForm();
      if (onCreated) onCreated(id);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error creating tour");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <section className="max-w-3xl w-full mx-auto bg-neutral-900/95 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Create new tour</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Title</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
            placeholder="Tour title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Description</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700 h-28"
            placeholder="Short description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Price</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              min={0}
            />
          </div>
        </div>

          {/* Highlights */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">Highlights</label>
            <div className="flex items-center gap-2">
              <input
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
                placeholder="Add a highlight and press Enter or Add"
              />
              <button type="button" onClick={addHighlight} className="px-3 py-2 bg-neutral-700 rounded text-white">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {highlights.map((it, i) => (
                <span key={i} className="inline-flex items-center gap-2 bg-neutral-800 text-white px-2 py-1 rounded">
                  <span className="text-sm">{it}</span>
                  <button type="button" onClick={() => removeHighlight(i)} className="text-xs text-red-400">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">Itinerary (steps)</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                value={itineraryTitle}
                onChange={(e) => setItineraryTitle(e.target.value)}
                className="col-span-2 px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
                placeholder="Step title"
              />
              <input
                value={itineraryDuration}
                onChange={(e) => setItineraryDuration(e.target.value)}
                className="px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
                placeholder="Duration"
              />
            </div>
            <div className="mt-2">
              <textarea
                value={itineraryDescription}
                onChange={(e) => setItineraryDescription(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700 h-20"
                placeholder="Step description (optional)"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button type="button" onClick={addItineraryItem} className="px-3 py-2 bg-neutral-700 rounded text-white">Add step</button>
            </div>
            <div className="mt-2 space-y-2">
              {itinerary.map((it, i) => (
                <div key={i} className="bg-neutral-800 p-2 rounded flex items-start justify-between">
                  <div>
                    <div className="text-sm font-medium text-white">{it.step}. {it.title}</div>
                    <div className="text-xs text-zinc-300">{it.duration}</div>
                    {it.description && <div className="text-sm text-zinc-300 mt-1">{it.description}</div>}
                  </div>
                  <div>
                    <button type="button" onClick={() => removeItineraryItem(i)} className="text-red-400">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">City</label>
          <input
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Meeting point</label>
          <input
            value={puntoEncuentro}
            onChange={(e) => setPuntoEncuentro(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Category ID (optional)</label>
          <input
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
            placeholder="Category document id"
          />
        </div>

        {/* Includes / Not-Includes dynamic lists */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">Includes</label>
          <div className="flex items-center gap-2">
            <input
              value={incluyeInput}
              onChange={(e) => setIncluyeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addIncluye())}
              className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              placeholder="Add an included feature and press Enter or Add"
            />
            <button type="button" onClick={addIncluye} className="px-3 py-2 bg-neutral-700 rounded text-white">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {incluye.map((it, i) => (
              <span key={i} className="inline-flex items-center gap-2 bg-neutral-800 text-white px-2 py-1 rounded">
                <span className="text-sm">{it}</span>
                <button type="button" onClick={() => removeIncluye(i)} className="text-xs text-red-400">×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Not included</label>
          <div className="flex items-center gap-2">
            <input
              value={noIncluyeInput}
              onChange={(e) => setNoIncluyeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNoIncluye())}
              className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              placeholder="Add a non-included item and press Enter or Add"
            />
            <button type="button" onClick={addNoIncluye} className="px-3 py-2 bg-neutral-700 rounded text-white">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {noIncluye.map((it, i) => (
              <span key={i} className="inline-flex items-center gap-2 bg-neutral-800 text-white px-2 py-1 rounded">
                <span className="text-sm">{it}</span>
                <button type="button" onClick={() => removeNoIncluye(i)} className="text-xs text-red-400">×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">Image</label>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <img src={previewUrl} alt="preview" className="w-24 h-16 object-cover rounded-md border" />
            )}
            {uploadingImage && <div className="text-sm text-zinc-300">Uploading image...</div>}
          </div>
        </div>

        {error && <div className="text-red-400">{error}</div>}
        {success && <div className="text-green-400">{success}</div>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={uploadingImage}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white disabled:opacity-60"
          >
            {uploadingImage  ? "Saving..." : "Create tour"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-white"
          >
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
