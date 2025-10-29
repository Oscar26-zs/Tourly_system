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
    setFile(null);
    setPreviewUrl(null);
    setError(null);
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
