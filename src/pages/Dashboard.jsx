import React from 'react';
import { Images, Eye, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGallery } from '../hooks/useGallery';

const Dashboard = () => {
  const { loading, stats } = useGallery();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="animate-fade-up">
        <p className="mb-2 text-xs tracking-[0.4em] text-gold uppercase">Welcome</p>
        <h1 className="font-serif text-4xl text-parchment">Welcome to Nrithya Degula</h1>
        <p className="mt-1.5 max-w-xl text-sm text-cream/55">
          Manage the images displayed across the website Gallery.
        </p>
        <div className="gold-divider mt-6">
          <span className="size-1.5 rotate-45 bg-gold/60" />
        </div>
      </div>

      {/* Real gallery counts only */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-2xl">
        <Link
          to="/gallery"
          className="group animate-fade-up rounded-lg border border-gold/25 bg-cocoa/40 p-6 transition-colors hover:border-gold/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-[0.25em] text-cream/55 uppercase">Gallery Images</span>
            <Images size={18} strokeWidth={1.4} className="text-gold/80" />
          </div>
          <p className="mt-4 font-serif text-5xl text-goldlight">
            {loading ? '—' : stats.total}
          </p>
          <p className="mt-2 text-xs text-cream/40 transition-colors group-hover:text-goldlight">
            Manage images →
          </p>
        </Link>

        <Link
          to="/gallery"
          className="group animate-fade-up rounded-lg border border-gold/25 bg-cocoa/40 p-6 transition-colors hover:border-gold/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-[0.25em] text-cream/55 uppercase">Active Images</span>
            <Eye size={18} strokeWidth={1.4} className="text-gold/80" />
          </div>
          <p className="mt-4 font-serif text-5xl text-goldlight">
            {loading ? '—' : stats.active}
          </p>
          <p className="mt-2 text-xs text-cream/40 transition-colors group-hover:text-goldlight">
            Manage visibility →
          </p>
        </Link>
      </div>

      {/* Gentle pointer to the main section */}
      <div className="mt-10 flex flex-col items-start gap-4 rounded-lg border border-gold/20 bg-walnut p-6 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
        <p className="max-w-md text-sm leading-relaxed text-cream/60">
          Everything you upload, edit or hide here is reflected in the Gallery section of the
          Nrithya Degula website.
        </p>
        <Link
          to="/gallery"
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-xs font-medium tracking-[0.18em] text-espresso uppercase transition-all hover:bg-goldlight"
        >
          <Plus size={14} strokeWidth={2} />
          Go to Gallery
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
