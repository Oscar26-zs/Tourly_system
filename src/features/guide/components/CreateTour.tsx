import { useCategories } from "../hooks/useCategories";
import useCreateTourForm from "../hooks/useCreateTourForm";
import { useTranslation } from 'react-i18next';

export default function GuideCreateTourSection({
  guideId: guideIdProp,
  onCreated,
}: {
  guideId?: string | null;
  onCreated?: (id: string) => void;
}) {
  const {
    titulo,setTitulo,descripcion,setDescripcion,precio,setPrecio,ciudad,
    setCiudad,duracion, setDuracion,puntoEncuentro,setPuntoEncuentro,
    categoriaId,setCategoriaId,incluyeInput, setIncluyeInput,incluye,addIncluye,
    removeIncluye, noIncluyeInput,setNoIncluyeInput,noIncluye, addNoIncluye,
    removeNoIncluye,highlightsInput,setHighlightsInput, highlights, addHighlight,
    removeHighlight,itineraryTitle, setItineraryTitle, itineraryDuration, setItineraryDuration,
    itineraryDescription,setItineraryDescription, itinerary, addItineraryItem, removeItineraryItem,

    previewUrl,handleFileChange, uploadingImage, error,success, handleSubmit,resetForm,
  } = useCreateTourForm({ guideId: guideIdProp, onCreated });

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { t } = useTranslation();


  return (
    <section className="max-w-3xl w-full mx-auto bg-neutral-900/95 p-6 rounded-lg shadow-lg">
  <h2 className="text-xl font-semibold text-white mb-4">{t('guide.createTour.title')}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            {t('guide.createTour.titleLabel')}
          </label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              placeholder={t('guide.createTour.titlePlaceholder')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            {t('guide.createTour.descriptionLabel')}
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700 h-28"
              placeholder={t('guide.createTour.descriptionPlaceholder')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              {t('guide.createTour.priceLabel')}
            </label>
            <input
              type="number"
              value={precio}
              onChange={(e) =>
                setPrecio(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              {t('guide.createTour.durationLabel')}
            </label>
            <input
              type="number"
              value={duracion}
              onChange={(e) =>
                setDuracion(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              min={0}
            />
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            {t('guide.createTour.highlightsLabel')}
          </label>
          <div className="flex items-center gap-2">
            <input
              value={highlightsInput}
              onChange={(e) => setHighlightsInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addHighlight())
              }
              className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              placeholder={t('guide.createTour.highlightsPlaceholder')}
            />
            <button
              type="button"
              onClick={addHighlight}
              className="px-3 py-2 bg-neutral-700 rounded text-white"
            >
              {t('guide.createTour.add')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {highlights.map((it, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 bg-neutral-800 text-white px-2 py-1 rounded"
              >
                <span className="text-sm">{it}</span>
                <button
                  type="button"
                  onClick={() => removeHighlight(i)}
                  className="text-xs text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            {t('guide.createTour.itineraryLabel')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              value={itineraryTitle}
              onChange={(e) => setItineraryTitle(e.target.value)}
              className="col-span-2 px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              placeholder={t('guide.createTour.itineraryStepTitle')}
            />
            <input
              value={itineraryDuration}
              onChange={(e) => setItineraryDuration(e.target.value)}
              className="px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              placeholder={t('guide.createTour.itineraryDuration')}
            />
          </div>
          <div className="mt-2">
            <textarea
              value={itineraryDescription}
              onChange={(e) => setItineraryDescription(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700 h-20"
              placeholder={t('guide.createTour.itineraryDescriptionPlaceholder')}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              onClick={addItineraryItem}
              className="px-3 py-2 bg-neutral-700 rounded text-white"
            >
              {t('guide.createTour.addStep')}
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {itinerary.map((it, i) => (
              <div
                key={i}
                className="bg-neutral-800 p-2 rounded flex items-start justify-between"
              >
                <div>
                  <div className="text-sm font-medium text-white">
                    {it.step}. {it.title}
                  </div>
                  <div className="text-xs text-zinc-300">{it.duration}</div>
                  {it.description && (
                    <div className="text-sm text-zinc-300 mt-1">
                      {it.description}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => removeItineraryItem(i)}
                    className="text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            {t('guide.createTour.cityLabel')}
          </label>
          <input
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            {t('guide.createTour.meetingPointLabel')}
          </label>
          <input
            value={puntoEncuentro}
            onChange={(e) => setPuntoEncuentro(e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
          />
        </div>

        <div>
  <label className="block text-sm font-medium text-white mb-1">{t('guide.createTour.categoryLabel')}</label>
    <select
      value={categoriaId}
      onChange={(e) => setCategoriaId(e.target.value)}
      className="w-full px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
    >
      <option value="">Select category</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nombreCategoria}
        </option>
      ))}
    </select>
    {categoriesLoading && <div className="text-sm text-zinc-400 mt-1">{t('guide.createTour.loadingCategories')}</div>}
  </div>

        {/* Includes / Not-Includes dynamic lists */}
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            {t('guide.createTour.includesLabel')}
          </label>
          <div className="flex items-center gap-2">
            <input
              value={incluyeInput}
              onChange={(e) => setIncluyeInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addIncluye())
              }
              className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              placeholder={t('guide.createTour.includesPlaceholder')}
            />
            <button
              type="button"
              onClick={addIncluye}
              className="px-3 py-2 bg-neutral-700 rounded text-white"
            >
              {t('guide.createTour.add')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {incluye.map((it, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 bg-neutral-800 text-white px-2 py-1 rounded"
              >
                <span className="text-sm">{it}</span>
                <button
                  type="button"
                  onClick={() => removeIncluye(i)}
                  className="text-xs text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            {t('guide.createTour.notIncludedLabel')}
          </label>
          <div className="flex items-center gap-2">
            <input
              value={noIncluyeInput}
              onChange={(e) => setNoIncluyeInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addNoIncluye())
              }
              className="flex-1 px-3 py-2 bg-neutral-800 text-white rounded border border-neutral-700"
              placeholder={t('guide.createTour.notIncludedPlaceholder')}
            />
            <button
              type="button"
              onClick={addNoIncluye}
              className="px-3 py-2 bg-neutral-700 rounded text-white"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {noIncluye.map((it, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 bg-neutral-800 text-white px-2 py-1 rounded"
              >
                <span className="text-sm">{it}</span>
                <button
                  type="button"
                  onClick={() => removeNoIncluye(i)}
                  className="text-xs text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-white mb-1">
            {t('guide.createTour.imageLabel')}
          </label>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="w-24 h-16 object-cover rounded-md border"
              />
            )}
            {uploadingImage && (
              <div className="text-sm text-zinc-300">{t('guide.createTour.uploadingImage')}</div>
            )}
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
            {uploadingImage ? t('guide.createTour.saving') : t('guide.createTour.createTour')}
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
