import React, { useState } from 'react';
import { X, Mail, Phone, Calendar, MapPin, User, MessageSquare, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { updateEnquiryStatus } from '../services/enquiryService';

const statusColors = {
  New: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Contacted: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Converted: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Closed: 'bg-cream/10 text-cream/60 border-cream/20',
};

export default function EnquiryDetailsModal({ enquiry, onClose, onStatusUpdated }) {
  const [currentStatus, setCurrentStatus] = useState(enquiry?.status || 'New');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!enquiry) return null;

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus || updating) return;
    setUpdating(true);
    setError('');
    setSuccessMsg('');

    try {
      await updateEnquiryStatus(enquiry._id, newStatus);
      setCurrentStatus(newStatus);
      setSuccessMsg(`Status updated to "${newStatus}"`);
      if (onStatusUpdated) {
        onStatusUpdated(enquiry._id, newStatus);
      }
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const formattedDate = enquiry.createdAt
    ? new Date(enquiry.createdAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-espresso/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-gold/30 bg-walnut shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gold/15 px-6 py-4 bg-cocoa/40">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg tracking-wider text-parchment">
              Enquiry Details
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${
                statusColors[currentStatus] || statusColors.New
              }`}
            >
              {currentStatus}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-cream/50 transition-colors hover:bg-gold/10 hover:text-cream"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Contact Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-lg border border-gold/20 bg-cocoa/30">
            <a
              href={`tel:${enquiry.phone}`}
              className="flex items-center justify-center gap-2 rounded-md bg-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-espresso transition-all hover:bg-goldlight shadow-sm"
            >
              <Phone size={14} />
              Call {enquiry.phone}
            </a>
            <a
              href={`mailto:${enquiry.email}?subject=Regarding your enquiry at Nritya Degula`}
              className="flex items-center justify-center gap-2 rounded-md border border-gold/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-goldlight transition-all hover:bg-gold/10"
            >
              <Mail size={14} />
              Email Visitor
            </a>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-cream/40 flex items-center gap-1.5">
                <User size={13} className="text-gold/70" /> Full Name
              </span>
              <p className="font-serif text-base text-parchment font-medium">{enquiry.fullName}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-cream/40 flex items-center gap-1.5">
                <Calendar size={13} className="text-gold/70" /> Submitted Date
              </span>
              <p className="text-cream/90">{formattedDate}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-cream/40 flex items-center gap-1.5">
                <Mail size={13} className="text-gold/70" /> Email Address
              </span>
              <p className="text-cream/90 break-words">
                <a
                  href={`mailto:${enquiry.email}?subject=Regarding your enquiry at Nritya Degula`}
                  className="hover:text-goldlight hover:underline transition-colors"
                >
                  {enquiry.email}
                </a>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-cream/40 flex items-center gap-1.5">
                <Phone size={13} className="text-gold/70" /> Phone Number
              </span>
              <p className="text-cream/90">
                <a
                  href={`tel:${enquiry.phone.replace(/\s+/g, '')}`}
                  className="hover:text-goldlight hover:underline transition-colors font-medium"
                >
                  {enquiry.phone}
                </a>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-cream/40">Student Age</span>
              <p className="text-cream/90">
                {enquiry.studentAge ? `${enquiry.studentAge} years old` : 'Not specified'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-cream/40 flex items-center gap-1.5">
                <MapPin size={13} className="text-gold/70" /> Preferred Branch
              </span>
              <p className="text-cream/90">{enquiry.preferredBranch || 'Not specified'}</p>
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-1.5 pt-2 border-t border-gold/15">
            <span className="text-xs uppercase tracking-wider text-cream/40 flex items-center gap-1.5">
              <MessageSquare size={13} className="text-gold/70" /> Visitor Message
            </span>
            <div className="rounded-lg border border-gold/15 bg-espresso/50 p-4 text-sm text-cream/80 whitespace-pre-wrap leading-relaxed min-h-[80px]">
              {enquiry.message || <span className="italic text-cream/35">No message provided.</span>}
            </div>
          </div>

          {/* Status Controls */}
          <div className="space-y-2 pt-2 border-t border-gold/15">
            <span className="text-xs uppercase tracking-wider text-cream/40 block">
              Update Enquiry Status
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['New', 'Contacted', 'Converted', 'Closed'].map((statusOption) => {
                const isActive = currentStatus === statusOption;
                return (
                  <button
                    key={statusOption}
                    type="button"
                    disabled={updating}
                    onClick={() => handleStatusChange(statusOption)}
                    className={`rounded-md border py-2 px-3 text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 ${
                      isActive
                        ? 'border-gold bg-gold text-espresso shadow-md'
                        : 'border-gold/20 bg-cocoa/40 text-cream/70 hover:border-gold/40 hover:text-cream'
                    } disabled:opacity-50`}
                  >
                    {isActive && <CheckCircle2 size={13} />}
                    {statusOption}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gold/15 bg-cocoa/40 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md border border-gold/25 px-4 py-2 text-xs font-medium uppercase tracking-wider text-cream/80 hover:bg-gold/10 hover:text-cream"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
