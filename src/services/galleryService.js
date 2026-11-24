import api from './api';

function mapDoc(doc) {
  if (!doc) return null;
  return {
    id: doc._id || doc.id,
    src: doc.imageData || '',
    title: doc.title || '',
    order: typeof doc.order === 'number' ? doc.order : 1,
    status: doc.status || 'active',
    createdAt: doc.createdAt ? new Date(doc.createdAt).getTime() : Date.now(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).getTime() : Date.now(),
  };
}

export async function getGalleryImages() {
  const res = await api.get('/gallery');
  const list = Array.isArray(res.data) ? res.data : [];
  return list.map(mapDoc);
}

export async function getGalleryStats() {
  const list = await getGalleryImages();
  return {
    total: list.length,
    active: list.filter((item) => item.status === 'active').length,
    hidden: list.filter((item) => item.status === 'hidden').length,
  };
}

export async function addGalleryImage({ file, title = '', order, status = 'active' }) {
  if (!file) throw new Error('An image file is required.');

  const formData = new FormData();
  formData.append('image', file);
  if (title) formData.append('title', title);
  if (status) formData.append('status', status);
  if (typeof order === 'number' && !Number.isNaN(order)) {
    formData.append('order', String(order));
  }

  const res = await api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return mapDoc(res.data);
}

export async function updateGalleryImage(id, changes) {
  const formData = new FormData();
  if (changes.file) {
    formData.append('image', changes.file);
  }
  if (changes.title !== undefined) formData.append('title', changes.title);
  if (changes.status !== undefined) formData.append('status', changes.status);
  if (typeof changes.order === 'number' && !Number.isNaN(changes.order)) {
    formData.append('order', String(changes.order));
  }

  const isMultipart = Boolean(changes.file);
  const config = isMultipart ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const res = await api.put(`/gallery/${id}`, isMultipart ? formData : changes, config);
  return mapDoc(res.data);
}

export async function deleteGalleryImage(id) {
  const res = await api.delete(`/gallery/${id}`);
  return res.data;
}

export async function reorderGalleryImage(id, newOrder) {
  const res = await api.post(`/gallery/${id}/reorder`, { newOrder });
  return mapDoc(res.data);
}
