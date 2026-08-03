import imageCompression from 'browser-image-compression';

export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export const compressImage = async (file) => {
  const options = {
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.8
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // Preserve original name base but force webp extension
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    return new File([compressedFile], `${baseName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now()
    });
  } catch (err) {
    console.warn('Error comprimiendo imagen, se usa original:', err);
    return file;
  }
};

export const getMainImage = (item) => {
  if (!item) return '';
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    const index = item.main_image_index ?? 0;
    const safeIndex = Math.max(0, Math.min(index, item.images.length - 1));
    return normalizeImageUrl(item.images[safeIndex]);
  }
  return normalizeImageUrl(item.image);
};

export const getAllImages = (item) => {
  if (!item) return [];
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    return item.images.map(normalizeImageUrl);
  }
  return [normalizeImageUrl(item.image)].filter(Boolean);
};

export const normalizeImageUrl = (url) => {
  if (!url) return '';
  return url.replace('/pixelyplush/assets/', '/assets/');
};

export const getFileNameFromUrl = (url) => {
  if (!url) return null;
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('/').pop();
  } catch {
    return url.split('/').pop();
  }
};

export const validateImageFiles = (files) => {
  const errors = [];
  const validFiles = [];

  for (const file of files) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      errors.push(`${file.name} pesa más de ${MAX_IMAGE_SIZE_MB}MB`);
    } else {
      validFiles.push(file);
    }
  }

  return { validFiles, errors };
};
