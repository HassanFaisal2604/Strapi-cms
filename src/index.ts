import type { Core } from '@strapi/strapi';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import intoStream from 'into-stream';
import cloudinary from 'cloudinary';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse all base64 image data URIs from an HTML string.
 * Returns an array of matches with their full data URI and metadata.
 */
function extractBase64Images(html: string) {
  const regex = /src="(data:(image\/(png|jpg|jpeg|gif|webp|svg\+xml));base64,([^"]+))"/g;
  const matches: Array<{ fullMatch: string; dataUri: string; mimeType: string; ext: string; base64: string }> = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null) {
    matches.push({
      fullMatch: m[0],
      dataUri: m[1],
      mimeType: m[2],
      ext: m[3].replace('jpeg', 'jpg').replace('svg+xml', 'svg'),
      base64: m[4],
    });
  }
  return matches;
}

const IMAGE_MAX_WIDTH = 1920;
const IMAGE_MAX_HEIGHT = 1920;
const TARGET_MAX_BYTES = 100 * 1024; // 100 KB
const WEBP_QUALITY_START = 82;
const WEBP_QUALITY_MIN = 40;

/**
 * Convert to WebP (target under 100 KB), upload buffer directly to Cloudinary, create Strapi file document.
 * Bypasses Strapi's upload pipeline so no temp file is created (fixes EBUSY on Windows).
 */
async function uploadBase64Image(
  strapiInstance: Core.Strapi,
  base64: string,
  _mimeType: string,
  _ext: string,
  index: number
): Promise<{ url: string } | null> {
  const name = `blog-image-${Date.now()}-${index}.webp`;
  const hash = crypto.randomBytes(12).toString('hex');
  try {
    const inputBuffer = Buffer.from(base64, 'base64');
    let webpBuffer: Buffer;
    let width = IMAGE_MAX_WIDTH;
    let quality = WEBP_QUALITY_START;

    do {
      webpBuffer = await sharp(inputBuffer)
        .resize(width, IMAGE_MAX_HEIGHT, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();
      if (webpBuffer.length <= TARGET_MAX_BYTES) break;
      if (quality > WEBP_QUALITY_MIN) {
        quality = Math.max(WEBP_QUALITY_MIN, quality - 15);
      } else if (width > 640) {
        width = Math.max(640, Math.floor(width * 0.75));
        quality = WEBP_QUALITY_START;
      } else {
        break;
      }
    } while (true);

    const originalKB = (inputBuffer.length / 1024).toFixed(1);
    const compressedKB = (webpBuffer.length / 1024).toFixed(1);
    strapiInstance.log.info(`[blog-image-extract] Image #${index + 1} size: ${originalKB} KB → ${compressedKB} KB`);

    const cloudName = process.env.CLOUDINARY_NAME;
    const apiKey = process.env.CLOUDINARY_KEY;
    const apiSecret = process.env.CLOUDINARY_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      const missing = [
        !cloudName && 'CLOUDINARY_NAME',
        !apiKey && 'CLOUDINARY_KEY',
        !apiSecret && 'CLOUDINARY_SECRET',
      ].filter(Boolean);
      strapiInstance.log.warn(`[blog-image-extract] Skipping upload: set ${missing.join(', ')} in .env and restart Strapi.`);
      return null;
    }
    const folder = process.env.CLOUDINARY_FOLDER || 'appilot';
    cloudinary.v2.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const result = await new Promise<{ secure_url: string; public_id: string; resource_type: string } | null>(
      (resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            resource_type: 'image',
            public_id: hash,
            folder: folder || undefined,
          },
          (err, image) => {
            if (err) reject(err);
            else resolve(image ?? null);
          }
        );
        intoStream(webpBuffer).pipe(uploadStream);
      }
    );

    if (!result) return null;

    await strapiInstance.documents('plugin::upload.file').create({
      data: {
        name,
        hash,
        ext: '.webp',
        mime: 'image/webp',
        size: webpBuffer.length,
        url: result.secure_url,
        provider: 'cloudinary',
        folderPath: '/',
        provider_metadata: {
          public_id: result.public_id,
          resource_type: result.resource_type,
        },
      },
    });
//this is the url that will be used to display the image in the blog post
    return { url: result.secure_url };
  } catch (err) {
    strapiInstance.log.warn(`[blog-image-extract] Failed to upload image #${index}: ${err}`);
    return null;
  }
}

/**
 * Scan blog content HTML, extract all base64 images, upload them to Strapi
 * media library, and replace the data URIs with the real upload URLs.
 * Returns the cleaned HTML (or the original if nothing changed).
 */
async function processBase64Images(strapiInstance: Core.Strapi, html: string): Promise<string> {
  if (!html || !html.includes('data:image')) return html;

  const matches = extractBase64Images(html);
  if (matches.length === 0) return html;

  strapiInstance.log.info(`[blog-image-extract] Found ${matches.length} base64 image(s) — uploading…`);

  let result = html;
  for (let i = 0; i < matches.length; i++) {
    const { fullMatch, dataUri, mimeType, ext, base64 } = matches[i];
    const uploaded = await uploadBase64Image(strapiInstance, base64, mimeType, ext, i);
    if (uploaded?.url) {
      // Build absolute URL (Strapi local uploads return a relative path like /uploads/...)
      const baseUrl = strapiInstance.config.get('server.url', '') as string;
      const absoluteUrl = uploaded.url.startsWith('http') ? uploaded.url : `${baseUrl}${uploaded.url}`;
      result = result.replace(fullMatch, `src="${absoluteUrl}"`);
      strapiInstance.log.info(`[blog-image-extract]  ✓ Image #${i + 1} → ${absoluteUrl}`);
    } else {
      strapiInstance.log.warn(`[blog-image-extract]  ✗ Image #${i + 1} upload failed — keeping original`);
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Strapi lifecycle
// ---------------------------------------------------------------------------

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.customFields.register({
      name: 'richtext-html-paste',
      type: 'text',
      inputSize: {
        default: 12,
        isResizable: true,
      },
    });
  },

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // ---------------------------------------------------------------------------
    // Blog — process base64 images in `content` field
    // ---------------------------------------------------------------------------
    strapi.db.lifecycles.subscribe({
      models: ['api::blog.blog'],

      async beforeCreate(event) {
        const { data } = event.params;
        if (data?.content) {
          data.content = await processBase64Images(strapi, data.content as string);
        }
      },

      async beforeUpdate(event) {
        const { data } = event.params;
        if (data?.content) {
          data.content = await processBase64Images(strapi, data.content as string);
        }
      },
    });

    // ---------------------------------------------------------------------------
    // Service — process base64 images in `description` field
    // ---------------------------------------------------------------------------
    strapi.db.lifecycles.subscribe({
      models: ['api::service.service'],

      async beforeCreate(event) {
        const { data } = event.params;
        if (data?.description) {
          data.description = await processBase64Images(strapi, data.description as string);
        }
      },

      async beforeUpdate(event) {
        const { data } = event.params;
        if (data?.description) {
          data.description = await processBase64Images(strapi, data.description as string);
        }
      },
    });

    // ---------------------------------------------------------------------------
    // Bot — process base64 images in `description` field
    // ---------------------------------------------------------------------------
    strapi.db.lifecycles.subscribe({
      models: ['api::bot.bot'],

      async beforeCreate(event) {
        const { data } = event.params;
        if (data?.description) {
          data.description = await processBase64Images(strapi, data.description as string);
        }
      },

      async beforeUpdate(event) {
        const { data } = event.params;
        if (data?.description) {
          data.description = await processBase64Images(strapi, data.description as string);
        }
      },
    });

    // ---------------------------------------------------------------------------
    // Upload — compress images on disk after creation (Option A)
    // ---------------------------------------------------------------------------
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
  },
};
