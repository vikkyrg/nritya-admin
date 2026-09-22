import { useCallback, useEffect, useState } from 'react';
import {
  addGalleryImage,
  deleteGalleryImage,
  getGalleryImages,
  reorderGalleryImage,
  updateGalleryImage,
} from '../services/galleryService';

/**
 * Loads gallery images once and exposes CRUD operations that keep local
 * state in sync with the storage layer.
 */
export function useGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getGalleryImages();
      setImages(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load from the API (MongoDB stays the source of truth).
  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (payload) => {
      const record = await addGalleryImage(payload);
      await refresh();
      return record;
    },
    [refresh],
  );

  const update = useCallback(
    async (id, changes) => {
      await updateGalleryImage(id, changes);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id) => {
      await deleteGalleryImage(id);
      await refresh();
    },
    [refresh],
  );

  const reorder = useCallback(
    async (id, newOrder) => {
      const data = await reorderGalleryImage(id, newOrder);
      setImages(data);
    },
    [],
  );

  const stats = {
    total: images.length,
    active: images.filter((i) => i.status === 'active').length,
    hidden: images.filter((i) => i.status === 'hidden').length,
  };

  return { images, loading, error, stats, refresh, create, update, remove, reorder };
}
