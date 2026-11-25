import React, { useEffect, useState } from 'react';
import { Images, Eye, Plus, Inbox, Clock, Phone, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGallery } from '../hooks/useGallery';
import { getEnquiries } from '../services/enquiryService';

const Dashboard = () => {
  const { loading: galleryLoading, stats: galleryStats } = useGallery();
  const [enquiryStats, setEnquiryStats] = useState({ total: 0, New: 0, Contacted: 0, Converted: 0 });
  const [enquiryLoading, setEnquiryLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchEnquiryStats = async () => {
      try {
        const data = await getEnquiries({ limit: 1 });
        if (isMounted && data?.stats) {
          setEnquiryStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching enquiry stats:', err);
      } finally {
        if (isMounted) setEnquiryLoading(false);
      }
    };
    fetchEnquiryStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      <div className="animate-fade-up">
        <p className="mb-2 text-xs tracking-[0.4em] text-gold uppercase">Welcome</p>
        <h1 className="font-serif text-4xl text-parchment">Welcome to Nritya Degula</h1>
        <p className="mt-1.5 max-w-xl text-sm text-cream/55">
          Manage website enquiries, registrations, and gallery showcases.
        </p>
        <div className="gold-divider mt-6">
          <span className="size-1.5 rotate-45 bg-gold/60" />
        </div>
      </div>

      {/* Top Section: Enquiries Quick Overview */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Enquiry Overview
          </h2>
          <Link to="/enquiries" className="text-xs text-gold hover:underline">
            View All Enquiries →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/enquiries"
            className="group animate-fade-up rounded-lg border border-gold/25 bg-cocoa/40 p-5 transition-colors hover:border-gold/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.2em] text-cream/55 uppercase">Total Enquiries</span>
              <Inbox size={18} strokeWidth={1.4} className="text-gold/80" />
            </div>
            <div className="mt-3 h-10 flex items-center">
              {enquiryLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-gold/15" />
              ) : (
                <p className="font-serif text-4xl text-goldlight">{enquiryStats.total}</p>
              )}
            </div>
            <p className="mt-2 text-xs text-cream/40 transition-colors group-hover:text-goldlight">
              Manage enquiries →
            </p>
          </Link>

          <Link
            to="/enquiries"
            className="group animate-fade-up rounded-lg border border-amber-500/30 bg-amber-500/5 p-5 transition-colors hover:border-amber-500/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.2em] text-amber-300 uppercase">New Enquiries</span>
              <Clock size={18} strokeWidth={1.4} className="text-amber-400" />
            </div>
            <div className="mt-3 h-10 flex items-center">
              {enquiryLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-amber-400/15" />
              ) : (
                <p className="font-serif text-4xl text-amber-200">{enquiryStats.New}</p>
              )}
            </div>
            <p className="mt-2 text-xs text-amber-300/50 transition-colors group-hover:text-amber-300">
              Needs response →
            </p>
          </Link>

          <Link
            to="/enquiries"
            className="group animate-fade-up rounded-lg border border-sky-500/30 bg-sky-500/5 p-5 transition-colors hover:border-sky-500/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.2em] text-sky-300 uppercase">Contacted</span>
              <Phone size={18} strokeWidth={1.4} className="text-sky-400" />
            </div>
            <div className="mt-3 h-10 flex items-center">
              {enquiryLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-sky-400/15" />
              ) : (
                <p className="font-serif text-4xl text-sky-200">{enquiryStats.Contacted}</p>
              )}
            </div>
            <p className="mt-2 text-xs text-sky-300/50 transition-colors group-hover:text-sky-300">
              In follow-up →
            </p>
          </Link>

          <Link
            to="/enquiries"
            className="group animate-fade-up rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 transition-colors hover:border-emerald-500/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.2em] text-emerald-300 uppercase">Converted</span>
              <CheckCheck size={18} strokeWidth={1.4} className="text-emerald-400" />
            </div>
            <div className="mt-3 h-10 flex items-center">
              {enquiryLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-emerald-400/15" />
              ) : (
                <p className="font-serif text-4xl text-emerald-200">{enquiryStats.Converted}</p>
              )}
            </div>
            <p className="mt-2 text-xs text-emerald-300/50 transition-colors group-hover:text-emerald-300">
              Enrolled students →
            </p>
          </Link>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold mb-4">
          Gallery Showcase
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <Link
            to="/gallery"
            className="group animate-fade-up rounded-lg border border-gold/25 bg-cocoa/40 p-5 transition-colors hover:border-gold/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.25em] text-cream/55 uppercase">Gallery Images</span>
              <Images size={18} strokeWidth={1.4} className="text-gold/80" />
            </div>
            <div className="mt-3 h-10 flex items-center">
              {galleryLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-gold/15" />
              ) : (
                <p className="font-serif text-4xl text-goldlight">{galleryStats.total}</p>
              )}
            </div>
            <p className="mt-2 text-xs text-cream/40 transition-colors group-hover:text-goldlight">
              Manage images →
            </p>
          </Link>

          <Link
            to="/gallery"
            className="group animate-fade-up rounded-lg border border-gold/25 bg-cocoa/40 p-5 transition-colors hover:border-gold/50"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-[0.25em] text-cream/55 uppercase">Active Images</span>
              <Eye size={18} strokeWidth={1.4} className="text-gold/80" />
            </div>
            <div className="mt-3 h-10 flex items-center">
              {galleryLoading ? (
                <div className="h-8 w-16 animate-pulse rounded bg-gold/15" />
              ) : (
                <p className="font-serif text-4xl text-goldlight">{galleryStats.active}</p>
              )}
            </div>
            <p className="mt-2 text-xs text-cream/40 transition-colors group-hover:text-goldlight">
              Manage visibility →
            </p>
          </Link>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="mt-10 flex flex-col items-start gap-4 rounded-lg border border-gold/20 bg-walnut p-6 sm:flex-row sm:items-center sm:justify-between animate-fade-up">
        <p className="max-w-md text-sm leading-relaxed text-cream/60">
          Respond quickly to new student enquiries or upload new performance photographs to keep the website active.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/enquiries"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-gold px-5 py-2.5 text-xs font-medium tracking-[0.18em] text-espresso uppercase transition-all hover:bg-goldlight"
          >
            <Inbox size={14} strokeWidth={2} />
            View Enquiries
          </Link>
          <Link
            to="/gallery"
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-gold/40 px-5 py-2.5 text-xs font-medium tracking-[0.18em] text-goldlight uppercase transition-all hover:bg-gold/10"
          >
            <Plus size={14} strokeWidth={2} />
            Add Image
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
