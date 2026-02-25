/**
 * Option A: Compress every uploaded image on disk after creation.
 * Copy this block into strapi-cms/src/index.ts inside bootstrap({ strapi }) { ... }.
 * Ensure these top-level imports exist: sharp, path, fs.
 */
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;
const JPEG_QUALITY = 82;
const PNG_COMPRESSION = 6;

strapi.db.lifecycles.subscribe({
  models: ['plugin::upload.file'],
  afterCreate: async ({ result }) => {
    if (!result?.mime?.startsWith('image/')) return;
    const filePath = result.path
      ? path.join(strapi.dirs.static.public, result.path)
      : null;
    if (!filePath || !fs.existsSync(filePath)) return;
    console.log('[image-compress] Image detected for compression:', result.path, result.name, result.mime);
    try {
      const pipeline = sharp(filePath)
        .resize(MAX_WIDTH, MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true });
      const mime = (result.mime || '').toLowerCase();
      const buf =
        mime === 'image/png'
          ? await pipeline.png({ compressionLevel: PNG_COMPRESSION }).toBuffer()
          : await pipeline
              .jpeg({ quality: JPEG_QUALITY })
              .toBuffer()
              .catch(() => pipeline.toBuffer());
      fs.writeFileSync(filePath, buf);
      console.log('[image-compress] Image compressed successfully:', result.path);
      strapi.log.debug('[image-compress] compressed ' + result.path);
    } catch (e) {
      console.error('[image-compress] Compression failed:', result.path, e);
      strapi.log.warn('[image-compress] afterCreate failed', e);
    }
  },
});
