import React, { useState, useEffect, useCallback } from 'react';
import {
  Inbox,
  Search,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Users,
  Clock,
  CheckCheck,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { getEnquiries, deleteEnquiry, updateEnquiryStatus } from '../services/enquiryService';
import EnquiryDetailsModal from '../components/EnquiryDetailsModal';
import ConfirmDialog from '../components/ConfirmDialog';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Converted', 'Closed'];

const statusBadgeClasses = {
  New: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  Contacted: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  Converted: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Closed: 'bg-cream/10 text-cream/60 border-cream/20',
};

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, New: 0, Contacted: 0, Converted: 0, Closed: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [branchFilter, setBranchFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Modals
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchList = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const data = await getEnquiries({
        page,
        limit: 10,
        search,
        status: statusFilter === 'All' ? '' : statusFilter,
        branch: branchFilter,
        sort: sortOrder,
      });

      setEnquiries(data.enquiries || []);
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setError(err.message || 'Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, branchFilter, sortOrder]);

  useEffect(() => {
    fetchList(1);
  }, [fetchList]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchList(1);
  };

  const handleStatusUpdated = (id, newStatus) => {
    setEnquiries((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
    );
    if (selectedEnquiry && selectedEnquiry._id === id) {
      setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
    }
    // Refresh stats
    fetchList(pagination.page);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteEnquiry(deleteTarget._id);
      setDeleteTarget(null);
      if (selectedEnquiry?._id === deleteTarget._id) {
        setSelectedEnquiry(null);
      }
      fetchList(pagination.page);
    } catch (err) {
      alert(err.message || 'Failed to delete enquiry');
    } finally {
      setDeleting(false);
    }
  };

  // Unique branches for branch filter
  const branchOptions = [
    'Banashankari',
    'Basavanagudi',
    'Vijayanagar',
    'Rajarajeshwari Nagar',
    'Jayanagar',
    'Kumaraswamy Layout',
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-up">
        <div>
          <p className="mb-2 text-xs tracking-[0.4em] text-gold uppercase">Enquiry Management</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-parchment">Student & Visitor Enquiries</h1>
          <p className="mt-1.5 text-sm text-cream/55">
            View, track, and manage all contact requests submitted from the dance school website.
          </p>
        </div>
        <button
          onClick={() => fetchList(pagination.page)}
          disabled={loading}
          className="inline-flex items-center gap-2 self-start rounded-md border border-gold/30 bg-cocoa/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-goldlight hover:bg-gold/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="gold-divider mt-6 mb-8">
        <span className="size-1.5 rotate-45 bg-gold/60" />
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8 animate-fade-up">
        {/* Total */}
        <div className="rounded-lg border border-gold/20 bg-cocoa/30 p-4 transition-colors hover:border-gold/40">
          <div className="flex items-center justify-between text-cream/55">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total</span>
            <Inbox size={16} className="text-gold/80" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-parchment">
            {loading ? 'â€”' : stats.total}
          </p>
        </div>

        {/* New */}
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-4 transition-colors hover:border-amber-500/40">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-[11px] font-semibold uppercase tracking-wider">New</span>
            <Clock size={16} />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-amber-200">
            {loading ? 'â€”' : stats.New}
          </p>
        </div>

        {/* Contacted */}
        <div className="rounded-lg border border-sky-500/25 bg-sky-500/5 p-4 transition-colors hover:border-sky-500/40">
          <div className="flex items-center justify-between text-sky-300">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Contacted</span>
            <Phone size={16} />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-sky-200">
            {loading ? 'â€”' : stats.Contacted}
          </p>
        </div>

        {/* Converted */}
        <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-4 transition-colors hover:border-emerald-500/40">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Converted</span>
            <CheckCheck size={16} />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-emerald-200">
            {loading ? 'â€”' : stats.Converted}
          </p>
        </div>

        {/* Closed */}
        <div className="col-span-2 sm:col-span-1 rounded-lg border border-cream/15 bg-walnut p-4 transition-colors hover:border-cream/30">
          <div className="flex items-center justify-between text-cream/55">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Closed</span>
            <XCircle size={16} />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-cream/70">
            {loading ? 'â€”' : stats.Closed}
          </p>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="mb-6 rounded-lg border border-gold/20 bg-cocoa/30 p-4 space-y-4 animate-fade-up">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" />
            <input
              type="text"
              placeholder="Search by name, email, phone or branch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-gold/25 bg-walnut pl-10 pr-4 py-2 text-xs text-cream placeholder-cream/35 focus:border-gold focus:outline-none"
            />
          </form>

          {/* Status tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_OPTIONS.map((opt) => {
              const active = statusFilter === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setStatusFilter(opt)}
                  className={`rounded-md border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-all ${
                    active
                      ? 'border-gold bg-gold text-espresso font-semibold'
                      : 'border-gold/15 bg-walnut text-cream/70 hover:border-gold/30 hover:text-cream'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Second row: branch and sort */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gold/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-cream/50 uppercase tracking-wider">Branch:</span>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="rounded-md border border-gold/25 bg-walnut px-3 py-1.5 text-cream focus:border-gold focus:outline-none"
            >
              <option value="">All Branches</option>
              {branchOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-cream/50 uppercase tracking-wider">Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-md border border-gold/25 bg-walnut px-3 py-1.5 text-cream focus:border-gold focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {(search || statusFilter !== 'All' || branchFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
                setBranchFilter('');
              }}
              className="ml-auto text-xs text-gold hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Enquiries Table */}
      <div className="overflow-hidden rounded-lg border border-gold/20 bg-walnut shadow-lg animate-fade-up">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-gold/15 bg-cocoa/40 text-[11px] uppercase tracking-wider text-cream/50">
              <tr>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Age</th>
                <th className="py-3.5 px-4">Branch</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {loading && enquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-cream/40">
                    <RefreshCw size={24} className="mx-auto mb-2 animate-spin text-gold/60" />
                    Loading enquiries...
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <Inbox size={32} className="mx-auto mb-2 text-gold/40" />
                    <p className="text-sm font-serif text-cream/70">No enquiries found</p>
                    <p className="mt-1 text-xs text-cream/40">
                      Enquiries submitted through the website Contact form will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                enquiries.map((enquiry) => (
                  <tr
                    key={enquiry._id}
                    className="transition-colors hover:bg-gold/5 group"
                  >
                    {/* Name */}
                    <td className="py-3.5 px-4 font-medium text-parchment">
                      {enquiry.fullName}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 max-w-[180px] truncate">
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="text-cream/80 hover:text-goldlight hover:underline transition-colors"
                        title={`Send email to ${enquiry.email}`}
                      >
                        {enquiry.email}
                      </a>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a
                        href={`tel:${enquiry.phone.replace(/\s+/g, '')}`}
                        className="text-cream/80 hover:text-goldlight hover:underline transition-colors font-medium"
                        title={`Call ${enquiry.phone}`}
                      >
                        {enquiry.phone}
                      </a>
                    </td>

                    {/* Age */}
                    <td className="py-3.5 px-4 text-cream/60">
                      {enquiry.studentAge ? `${enquiry.studentAge}y` : 'â€”'}
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 px-4 text-cream/75">
                      {enquiry.preferredBranch || 'â€”'}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-cream/60 whitespace-nowrap">
                      {enquiry.createdAt
                        ? new Date(enquiry.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'â€”'}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          statusBadgeClasses[enquiry.status] || statusBadgeClasses.New
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEnquiry(enquiry)}
                          className="rounded p-1.5 text-goldlight hover:bg-gold/15 transition-colors"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(enquiry)}
                          className="rounded p-1.5 text-red-400 hover:bg-red-500/15 transition-colors"
                          title="Delete Enquiry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gold/15 bg-cocoa/30 px-4 py-3">
            <span className="text-xs text-cream/50">
              Showing page <strong className="text-cream">{pagination.page}</strong> of{' '}
              <strong className="text-cream">{pagination.totalPages}</strong> ({pagination.total} total)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1 || loading}
                onClick={() => fetchList(pagination.page - 1)}
                className="rounded border border-gold/20 p-1.5 text-cream/70 hover:bg-gold/10 hover:text-cream disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => fetchList(pagination.page + 1)}
                className="rounded border border-gold/20 p-1.5 text-cream/70 hover:bg-gold/10 hover:text-cream disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedEnquiry && (
        <EnquiryDetailsModal
          enquiry={selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Enquiry?"
        message={`Are you sure you want to delete the enquiry from "${deleteTarget?.fullName}"? This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
