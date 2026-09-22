import React, { useMemo, useState } from 'react';
import { Images, Plus, Eye, LayoutGrid } from 'lucide-react';
import { useGallery } from '../hooks/useGallery';
import ImageFormModal from '../components/ImageFormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import GalleryCard from '../components/GalleryCard';

const Gallery = () => {
  const { images, loading, error, stats, create, update, remove, reorder } = useGallery();
  const [modalState, setModalState] = useState({ open: false, image: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [actionError, setActionError] = useState(null);

  const visible = useMemo(() => images.filter((img) => img.status === 'active'), [images]);
  const nextOrder = images.length + 1;

  // The raw File travels to the service layer, which wraps it in FormData
  // and uploads it straight to the API — no FileReader/base64 conversion.
  const handleSubmit = async ({ id, file, title, order, status }) => {
    setActionError(null);
    try {
      if (id) {
        await update(id, { file, title, order, status });
      } else {
        await create({ file, title, order, status });
      }
      setModalState({ open: false, image: null });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to save the image.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionError(null);
    try {
      await remove(deleteTarget.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to delete the image.');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleMove = async (image, direction) => {
    const sorted = [...images].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((img) => img.id === image.id);
    const target = sorted[index + direction];
    if (!target) return;
    setActionError(null);
    try {
      await reorder(image.id, target.order);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to reorder the gallery.');
    }
  };

  const openAdd = () => setModalState({ open: true, image: null });
  const openEdit = (image) => setModalState({ open: true, image });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="animate-fade-up">
        <p className="mb-2 text-xs tracking-[0.4em] text-gold uppercase">Gallery Management</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl text-parchment">Gallery</h1>
            <p className="mt-1.5 max-w-xl text-sm text-cream/55">
              Manage the images displayed in the Nrithya Degula website gallery.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewOpen((open) => !open)}
              className="flex items-center gap-2 rounded-md border border-gold/35 px-4 py-2.5 text-xs tracking-[0.18em] text-goldlight uppercase transition-colors hover:border-gold/70 hover:bg-gold/10"
            >
              <Eye size={15} strokeWidth={1.6} />
              {previewOpen ? 'Hide Preview' : 'Website Preview'}
            </button>
            <button
              onClick={openAdd}
              className="gold-ring flex items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-xs font-medium tracking-[0.18em] text-espresso uppercase transition-all hover:bg-goldlight hover:shadow-[0_2px_14px_rgba(176,138,69,0.35)]"
            >
              <Plus size={15} strokeWidth={2} />
              Add Image
            </button>
          </div>
        </div>
        <div className="gold-divider mt-6">
          <span className="size-1.5 rotate-45 bg-gold/60" />
        </div>
      </div>

      {/* Action feedback */}
      {actionError && (
        <div className="mt-4 rounded-md border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {actionError}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 gap-5 py-10 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg border border-gold/15 bg-cocoa/30" />
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center">
          <p className="text-sm text-red-300/90">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-3 text-xs tracking-[0.2em] text-goldlight uppercase underline underline-offset-4">
            Retry
          </button>
        </div>
      ) : images.length === 0 ? (
        /* Empty state */
        <div className="py-16 text-center animate-fade-up">
          <span className="mx-auto mb-6 grid size-16 place-items-center rounded-full border border-gold/35 text-gold/80">
            <Images size={26} strokeWidth={1.2} />
          </span>
          <h2 className="font-serif text-3xl text-parchment">Your Gallery is Empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-cream/55">
            Upload images to display them in the Nrithya Degula website gallery.
          </p>
          <button
            onClick={openAdd}
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-xs font-medium tracking-[0.18em] text-espresso uppercase transition-all hover:bg-goldlight hover:shadow-[0_2px_14px_rgba(176,138,69,0.35)]"
          >
            <Plus size={15} strokeWidth={2} />
            Add Image
          </button>
        </div>
      ) : (
        <>
          {/* Count summary */}
          <div className="mt-8 mb-4 flex items-center gap-5 text-xs tracking-[0.18em] text-cream/45 uppercase">
            <span className="flex items-center gap-2">
              <LayoutGrid size={13} className="text-gold/70" />
              {stats.total} image{stats.total !== 1 ? 's' : ''}
            </span>
            <span>{stats.active} active</span>
            {stats.hidden > 0 && <span>{stats.hidden} hidden</span>}
          </div>

          {/* Grid: 4 desktop / 3 tablet / 2 mobile */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {images.map((image, index) => (
              <GalleryCard
                key={image.id}
                image={image}
                isFirst={index === 0}
                isLast={index === images.length - 1}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onMove={handleMove}
              />
            ))}
          </div>

          {/* Website Preview */}
          {previewOpen && (
            <section className="mt-12 animate-fade-up rounded-lg border border-gold/25 bg-walnut p-5 sm:p-8">
              <div className="mb-6 text-center">
                <p className="mb-1 text-[11px] tracking-[0.4em] text-gold uppercase">Website Preview</p>
                <h2 className="font-serif text-3xl tracking-[0.06em] text-goldlight uppercase">Our Gallery</h2>
                <p className="mx-auto mt-2 max-w-md text-xs text-cream/50">
                  How these images appear in the gallery section of the Nrithya Degula website.
                </p>
              </div>
              <div className="gold-divider mb-6">
                <span className="size-1.5 rotate-45 bg-gold/60" />
              </div>
              {visible.length === 0 ? (
                <p className="py-8 text-center text-sm text-cream/45">
                  No active images — the website gallery is currently empty.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {visible.map((image) => (
                    <figure key={image.id} className="overflow-hidden rounded-md border border-gold/15">
                      <img
                        src={image.src}
                        alt={image.title || 'Gallery image'}
                        loading="lazy"
                        className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </figure>
                  ))}
                </div>
              )}
              <p className="mt-5 text-center text-[11px] tracking-[0.14em] text-cream/35 uppercase">
                Showing {visible.length} of {stats.total} images · hidden images are not displayed on the website
              </p>
            </section>
          )}
        </>
      )}

      {/* Modals */}
      {modalState.open && (
        <ImageFormModal
          initial={modalState.image}
          nextOrder={nextOrder}
          onClose={() => setModalState({ open: false, image: null })}
          onSubmit={handleSubmit}
        />
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Image"
        message={
          deleteTarget
            ? `This will permanently remove "${deleteTarget.title || 'this image'}" from the website gallery. This action cannot be undone.`
            : ''
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Gallery;
