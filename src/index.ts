import type { Core } from '@strapi/strapi';
import { Readable } from 'stream';

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

/**
 * Upload a single base64 image buffer via Strapi's upload service.
 * Returns the uploaded file record (with .url).
 */
async function uploadBase64Image(
  strapiInstance: Core.Strapi,
  base64: string,
  mimeType: string,
  ext: string,
  index: number
): Promise<{ url: string } | null> {
  try {
    const buffer = Buffer.from(base64, 'base64');
    const filename = `blog-image-${Date.now()}-${index}.${ext}`;

    // Strapi upload service expects a file-like object
    const file = {
      name: filename,
      type: mimeType,
      size: buffer.length,
      buffer,
      // Strapi upload service also accepts a stream
      stream: Readable.from(buffer),
    };

    const uploadService = strapiInstance.plugin('upload').service('upload');
    const [uploaded] = await uploadService.upload({
      data: {},
      files: file,
    });

    return uploaded ?? null;
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
  },
};
