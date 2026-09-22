/**
 * Gallery data service.
 *
 * Single integration point between the admin panel and the gallery backend.
 * All records live in MongoDB behind the Express API; image binaries are
 * stored server-side and served through /api/gallery/:id/image URLs.
 *
 * Image record shape:
 * {
 *   id: string        — MongoDB document id
 *   src: string       — URL serving the stored image bytes
 *   title: string     — title / alt text for accessibility
 *   order: number     — display order on the website gallery
 *   status: 'active' | 'hidden'
 *   createdAt: number
 *   updatedAt: number
 * }
 */

import { getAdminToken, logout } from './authService';

const API_BASE_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL;
const GALLERY_URL = `${API_BASE_URL}/api/gallery`;

function authHeaders() {
  const headers = {};
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(path, options = {}) {
  const res = await fetch(`${GALLERY_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });

  if (res.status === 401) {
    // Session missing/expired — drop it and return to the login screen.
    logout();
    window.location.assign('/login');
    throw new Error('Your session has expired. Please sign in again.');
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body && body.message) message = body.message;
    } catch {
      // Non-JSON error responses keep the default message.
    }
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return res.json();
}

/** Maps a backend gallery document to the admin panel record shape. */
function toRecord(doc) {
  const src = doc.imageData || '';
  // Cache-busting version keeps previews fresh after an image is replaced.
  const version = doc.updatedAt ? new Date(doc.updatedAt).getTime() : 0;
  return {
    id: doc._id,
    src: src ? `${src}${src.includes('?') ? '&' : '?'}v=${version}` : src,
    title: doc.title || '',
    altText: doc.altText || '',
    order: Number(doc.order) || 1,
    status: doc.status === 'hidden' ? 'hidden' : 'active',
    createdAt: doc.createdAt ? new Date(doc.createdAt).getTime() : 0,
    updatedAt: version,
  };
}

export async function getGalleryImages() {
  const docs = await request('');
  return (Array.isArray(docs) ? docs : []).map(toRecord);
}

export async function getGalleryStats() {
  const items = await getGalleryImages();
  return {
    total: items.length,
    active: items.filter((item) => item.status === 'active').length,
    hidden: items.filter((item) => item.status === 'hidden').length,
  };
}

/**
 * Uploads a new image: File -> FormData -> POST /api/gallery.
 * The browser generates the multipart boundary automatically.
 */
export async function addGalleryImage({ file, title = '', order, status = 'active' }) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('title', title);
  formData.append('altText', title);
  if (order !== undefined && order !== null && Number.isFinite(Number(order))) {
    formData.append('order', String(order));
  }
  formData.append('status', status || 'active');
  const doc = await request('', { method: 'POST', body: formData });
  return toRecord(doc);
}

/**
 * Updates an existing image. Sends multipart/form-data when a new file was
 * selected (replacing the stored binary); otherwise a plain JSON body that
 * leaves the stored image untouched.
 */
export async function updateGalleryImage(id, changes) {
  const { file, title, order, status } = changes;

  let options;
  if (file instanceof File) {
    const formData = new FormData();
    formData.append('image', file);
    if (title !== undefined) {
      formData.append('title', title);
      formData.append('altText', title);
    }
    if (order !== undefined) formData.append('order', String(order));
    if (status !== undefined) formData.append('status', status);
    options = { method: 'PUT', body: formData };
  } else {
    const body = {};
    if (title !== undefined) {
      body.title = title;
      body.altText = title;
    }
    if (order !== undefined) body.order = order;
    if (status !== undefined) body.status = status;
    options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    };
  }

  const doc = await request(`/${id}`, options);
  return toRecord(doc);
}

export async function deleteGalleryImage(id) {
  await request(`/${id}`, { method: 'DELETE' });
  return { id };
}

/**
 * Moves an image to a new position; the backend renumbers every record 1..n
 * and returns the full reordered list.
 */
export async function reorderGalleryImage(id, newOrder) {
  const docs = await request(`/${id}/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order: newOrder }),
  });
  return (Array.isArray(docs) ? docs : []).map(toRecord);
}
