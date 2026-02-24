import type { StrapiApp } from '@strapi/strapi/admin';
import { RichtextHtmlPasteInput } from './extensions/RichtextHtmlPasteInput';

export default {
  config: {
    locales: [],
  },
  register(app: StrapiApp) {
    app.customFields.register({
      name: 'richtext-html-paste',
      type: 'text',
      intlLabel: {
        id: 'richtext-html-paste.label',
        defaultMessage: 'Rich text (HTML paste)',
      },
      intlDescription: {
        id: 'richtext-html-paste.description',
        defaultMessage: 'Rich text editor that preserves HTML when pasting from Google Docs or other sources.',
      },
      icon: () => null,
      components: {
        Input: () =>
          import('./extensions/RichtextHtmlPasteInput').then((module) => ({
            default: module.RichtextHtmlPasteInput,
          })),
      },
    });
  },
  bootstrap(app: StrapiApp) {
    // Optional: extend admin UI
  },
};
