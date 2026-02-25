import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  upload: {
    config: {
      // Disable so pre-compressed WebP from blog paste don't get re-processed (avoids EBUSY on Windows when Strapi unlinks its temp file)
      sizeOptimization: false,
      provider: '@strapi/provider-upload-cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
        params: {
          // All uploaded images go into a dedicated folder in your Cloudinary account
          folder: env('CLOUDINARY_FOLDER', 'appilot'),
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});

export default config;
