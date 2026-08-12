const MAX_ORIGINAL_BYTES = 3.4 * 1024 * 1024;
const MAX_DIMENSION = 2400;
const WEBP_QUALITY = 0.82;
const RASTER_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function compressImageBeforeUpload(file: File): Promise<File> {
  if (file.size <= MAX_ORIGINAL_BYTES || !RASTER_TYPES.has(file.type)) {
    return file;
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Cannot decode image'));
      el.src = url;
    });

    if (!img.naturalWidth || !img.naturalHeight) return file;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY)
    );

    if (!blob || blob.size >= file.size) return file;

    const base = file.name.replace(/\.[^.]+$/, '') || 'image';
    return new File([blob], `${base}.webp`, { type: 'image/webp' });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}