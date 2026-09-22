import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_MB = 5;

/**
 * Modal for adding or editing a gallery image.
 * Fields: Image (drag & drop), Title/Alt text, Display order, Status.
 */
const ImageFormModal = ({ initial, nextOrder, onClose, onSubmit }) => {
  const isEdit = Boolean(initial);
  const [preview, setPreview] = useState(initial?.src ?? null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(initial?.title ?? '');
  const [order, setOrder] = useState(initial?.order ?? nextOrder ?? 1);
  const [status, setStatus] = useState(initial?.status ?? 'active');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Release the preview object URL when the modal closes (blob URLs only).
  useEffect(
    () => () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const acceptFile = useCallback((file) => {
    setError(null);
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError('Please choose a JPG, JPEG, PNG or WEBP image.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_MB} MB.`);
      return;
    }
    setFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!preview) {
      setError('Please upload an image.');
      return;
    }
    onSubmit({ id: initial?.id, file, src: preview, title: title.trim(), order: Number(order) || 1, status });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-espresso/85 p-4 animate-fade-in">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-gold/30 bg-walnut shadow-2xl animate-fade-up"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/15 px-6 py-4">
          <h2 className="font-serif text-2xl tracking-wide text-goldlight">
            {isEdit ? 'Edit Image' : 'Add Image'}
          </h2>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-md border border-gold/25 text-cream/60 transition-colors hover:border-gold/50 hover:text-cream"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          {/* Drag & drop upload area */}
          <div>
            <label className="mb-2 block text-xs tracking-[0.25em] text-cream/55 uppercase">Image</label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`grid cursor-pointer place-items-center rounded-md border border-dashed px-6 py-8 text-center transition-colors ${
                dragging
                  ? 'border-goldlight bg-gold/10'
                  : 'border-gold/35 bg-cocoa/50 hover:border-gold/60 hover:bg-gold/5'
              }`}
            >
              {preview ? (
                <div className="space-y-3">
                  <img
                    src={preview}
                    alt="Upload preview"
                    className="mx-auto max-h-44 rounded border border-gold/20 object-contain"
                  />
                  <p className="text-xs text-cream/45">Click or drop to replace this image</p>
                </div>
              ) : (
                <div className="space-y-2 text-cream/50">
                  <Upload size={26} strokeWidth={1.4} className="mx-auto text-gold/70" />
                  <p className="text-sm text-cream/70">Drag &amp; drop your image here</p>
                  <p className="text-xs">or</p>
                  <span className="inline-block rounded border border-gold/50 px-4 py-1.5 text-xs tracking-[0.2em] text-goldlight uppercase">
                    Browse Files
                  </span>
                  <p className="text-[11px] text-cream/35">JPG · JPEG · PNG · WEBP — up to {MAX_MB} MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED.join(',')}
                className="hidden"
                onChange={(e) => acceptFile(e.target.files?.[0])}
              />
            </div>
          </div>

          {/* Title / alt text */}
          <div>
            <label htmlFor="img-title" className="mb-2 block text-xs tracking-[0.25em] text-cream/55 uppercase">
              Title / Alt Text <span className="normal-case tracking-normal text-cream/35">(optional)</span>
            </label>
            <input
              id="img-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bharatanatyam recital, 2025"
              className="gold-ring w-full rounded-md border border-gold/25 bg-cocoa/60 px-4 py-2.5 text-sm text-cream transition-colors placeholder:text-cream/30 focus:border-gold/60"
            />
          </div>

          {/* Order + status */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="img-order" className="mb-2 block text-xs tracking-[0.25em] text-cream/55 uppercase">
                Display Order
              </label>
              <input
                id="img-order"
                type="number"
                min={1}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="gold-ring w-full rounded-md border border-gold/25 bg-cocoa/60 px-4 py-2.5 text-sm text-cream transition-colors focus:border-gold/60"
              />
            </div>
            <div>
              <label htmlFor="img-status" className="mb-2 block text-xs tracking-[0.25em] text-cream/55 uppercase">
                Status
              </label>
              <select
                id="img-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="gold-ring w-full rounded-md border border-gold/25 bg-cocoa/60 px-4 py-2.5 text-sm text-cream transition-colors focus:border-gold/60"
              >
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-red-300/90">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gold/15 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gold/30 px-5 py-2.5 text-sm tracking-[0.15em] text-cream/75 uppercase transition-colors hover:border-gold/60 hover:text-cream"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gold-ring rounded-md bg-gold px-5 py-2.5 text-sm font-medium tracking-[0.15em] text-espresso uppercase transition-all hover:bg-goldlight hover:shadow-[0_2px_14px_rgba(176,138,69,0.35)]"
            >
              {isEdit ? 'Save Changes' : 'Add Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageFormModal;
