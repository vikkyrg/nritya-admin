import React from 'react';
import { ArrowDown, ArrowUp, Pencil, Trash2 } from 'lucide-react';

/**
 * One gallery image card: preview, title, order, status badge and actions.
 * Actions appear on hover (desktop) and are always visible on touch screens.
 */
const GalleryCard = ({ image, isFirst, isLast, onEdit, onDelete, onMove }) => {
  const isActive = image.status === 'active';

  return (
    <div className="group animate-fade-up overflow-hidden rounded-lg border border-gold/20 bg-cocoa/40 transition-all duration-300 hover:border-gold/50">
      {/* Image preview */}
      <div className="relative aspect-square overflow-hidden bg-espresso">
        <img
          src={image.src}
          alt={image.title || 'Gallery image'}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Status badge */}
        <span
          className={`absolute top-2.5 left-2.5 rounded-sm border px-2 py-0.5 text-[10px] tracking-[0.18em] uppercase backdrop-blur-sm ${
            isActive
              ? 'border-gold/50 bg-espresso/70 text-goldlight'
              : 'border-cream/20 bg-espresso/70 text-cream/55'
          }`}
        >
          {isActive ? 'Active' : 'Hidden'}
        </span>

        {/* Hover actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2.5 bg-espresso/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 max-lg:opacity-100 lg:bg-espresso/0 lg:group-hover:bg-espresso/60">
          <button
            onClick={() => onEdit(image)}
            className="flex items-center gap-1.5 rounded-md border border-gold/50 bg-espresso/80 px-3 py-1.5 text-xs tracking-[0.15em] text-goldlight uppercase transition-colors hover:bg-gold hover:text-espresso"
            aria-label={`Edit ${image.title || 'image'}`}
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={() => onDelete(image)}
            className="flex items-center gap-1.5 rounded-md border border-cream/25 bg-espresso/80 px-3 py-1.5 text-xs tracking-[0.15em] text-cream/80 uppercase transition-colors hover:border-red-400/60 hover:text-red-300"
            aria-label={`Delete ${image.title || 'image'}`}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2 px-3.5 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm text-cream/90">
            {image.title || <span className="text-cream/40 italic">Untitled</span>}
          </p>
          <p className="mt-0.5 text-[11px] tracking-[0.14em] text-cream/40 uppercase">
            Order {image.order}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onMove(image, -1)}
            disabled={isFirst}
            className="grid size-7 place-items-center rounded border border-gold/25 text-cream/60 transition-colors hover:border-gold/60 hover:text-goldlight disabled:opacity-25"
            aria-label="Move earlier"
          >
            <ArrowUp size={13} />
          </button>
          <button
            onClick={() => onMove(image, 1)}
            disabled={isLast}
            className="grid size-7 place-items-center rounded border border-gold/25 text-cream/60 transition-colors hover:border-gold/60 hover:text-goldlight disabled:opacity-25"
            aria-label="Move later"
          >
            <ArrowDown size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
