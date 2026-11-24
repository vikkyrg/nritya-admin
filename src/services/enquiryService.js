import api from './api';

/**
 * Fetch enquiries list with pagination, search, status, and branch filters
 */
export async function getEnquiries({ page = 1, limit = 10, search = '', status = '', branch = '', sort = 'newest' } = {}) {
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (search) params.search = search;
  if (status) params.status = status;
  if (branch) params.branch = branch;
  if (sort) params.sort = sort;

  const res = await api.get('/admin/enquiries', { params });
  return res.data;
}

/**
 * Fetch single enquiry by ID
 */
export async function getEnquiryById(id) {
  const res = await api.get(`/admin/enquiries/${id}`);
  return res.data;
}

/**
 * Update status of an enquiry (New, Contacted, Converted, Closed)
 */
export async function updateEnquiryStatus(id, status) {
  const res = await api.patch(`/admin/enquiries/${id}/status`, { status });
  return res.data;
}

/**
 * Delete an enquiry
 */
export async function deleteEnquiry(id) {
  const res = await api.delete(`/admin/enquiries/${id}`);
  return res.data;
}
