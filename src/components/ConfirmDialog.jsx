import React from 'react';
import { TriangleAlert } from 'lucide-react';

const ConfirmDialog = ({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-espresso/85 p-4 animate-fade-in">
      <div
        className="w-full max-w-sm rounded-lg border border-gold/30 bg-walnut p-6 shadow-2xl animate-fade-up"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-gold/40 text-goldlight">
            <TriangleAlert size={16} strokeWidth={1.5} />
          </span>
          <h2 className="font-serif text-xl text-goldlight">{title}</h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-cream/70">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-gold/30 px-4 py-2 text-sm tracking-[0.15em] text-cream/75 uppercase transition-colors hover:border-gold/60 hover:text-cream"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-gold px-4 py-2 text-sm font-medium tracking-[0.15em] text-espresso uppercase transition-colors hover:bg-goldlight"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
