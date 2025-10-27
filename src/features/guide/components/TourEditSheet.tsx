import { useEffect, useState } from 'react';
import type { Tour } from '../../public/types/tour';
import { useUpdateTour } from '../hooks/useUpdateTour';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from './ui/sheet';

export default function TourEditSheet({
  open,
  onClose,
  tour,
  guideId,
}: {
  open: boolean;
  onClose: () => void;
  tour?: Tour | null;
  guideId?: string | null;
}) {
  const mutation = useUpdateTour();
  const mutateAsync = mutation.mutateAsync;
  const isLoading = mutation.status === 'pending';
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (tour) {
      const t = tour as any;
      setTitle(t.title ?? t.titulo ?? '');
      setDescription(t.description ?? t.descripcion ?? '');
      setPrice((t.price ?? t.precio) ?? '');
      const imgs = t.images ?? t.imagenes ?? [];
      setImage(Array.isArray(imgs) && imgs.length > 0 ? String(imgs[0]) : '');
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setImage('');
    }
  }, [tour]);

  // handle file selection + upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!guideId) {
      console.warn('No guideId provided - upload will use default path');
    }
    try {
  setUploading(true);
      // dynamic import of helper to avoid circulars and speed initial load
      const { uploadImageFile } = await import('../services/uploadImage');
      // optional path: tours/<guideId>
      const path = guideId ? `tours/${guideId}` : undefined;
      // uploadImageFile uses uploadBytesResumable; we cannot read progress from the helper easily,
      // but we use the returned URL to set the image
      const url = await uploadImageFile(file, path);
      setImage(url);
    } catch (err) {
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!tour) return;
    // Use Spanish field names to update the Firestore document
    const payload: any = {
      titulo: title,
      descripcion: description,
      precio: price === '' ? undefined : Number(price),
      imagenes: image ? [image] : [],
    } as any;

    try {
      await mutateAsync({ id: tour.id, data: payload, guideId });
      onClose();
    } catch (err) {
      console.error('Error updating tour:', err);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className='bg-neutral-900/95'>
        <SheetHeader>
            <SheetTitle className="text-white">Edit tour</SheetTitle>
            <SheetDescription className="text-zinc-200">Update the tour details below.</SheetDescription>
          </SheetHeader>

          <div className="bg-neutral-900/95 border p-4 rounded-md text-white space-y-6 mt-4">
            <label className="block">
              <div className="text-sm text-white mb-2">Title</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 rounded border border-neutral-700 focus:outline-none text-white placeholder:text-zinc-400"
              />
            </label>

            <label className="block">
              <div className="text-sm text-white mb-2">Description</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 rounded border border-neutral-700 focus:outline-none h-28 text-white placeholder:text-zinc-400"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <div className="text-sm text-white mb-2">Price</div>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-800 rounded border border-neutral-700 focus:outline-none text-white placeholder:text-zinc-400"
                />
              </label>

            </div>
              <label className="block">
                <div className="text-sm text-white mb-2">Image</div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm text-white"
                  />
                  {uploading && <div className="text-xs text-zinc-200">Uploading...</div>}
                </div>

                {image && (
                  <div className="mt-2 w-full h-32 bg-neutral-700 rounded overflow-hidden">
                    {/* preview */}
                    <img src={image} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </label>
          </div>

        <SheetFooter>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white disabled:opacity-60"
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </button>
            <button
              onClick={() => !isLoading && onClose()}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-white"
            >
              Cancel
            </button>
          </div>
        </SheetFooter>

        <SheetClose asChild>
          <button aria-label="close" className="sr-only">Close</button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
