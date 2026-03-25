import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [],
  },
  register(app: StrapiApp) {
    // #region agent log H-E: which UID are we registering?
    // For `global::richtext-html-paste`, Strapi expects NO pluginId here.
    console.info('[DEBUG-33de34][H-E] registering custom field (admin)', {
      name: 'richtext-html-paste',
      pluginId: undefined,
      expectedUid: 'global::richtext-html-paste',
    });
    fetch('http://127.0.0.1:7705/ingest/603965e3-38e7-429a-b23a-4fd7a5669d82',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'33de34'},body:JSON.stringify({sessionId:'33de34',runId:'pre-fix',hypothesisId:'H-E',location:'app.tsx:register',message:'admin registering custom field',data:{name:'richtext-html-paste',pluginId:null,expectedUid:'global::richtext-html-paste'},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    app.customFields.register({
      name: 'richtext-html-paste',
      type: 'text',
      intlLabel: {
        id: 'richtext-html-paste.label',
        defaultMessage: 'Rich text (HTML paste)',
      },
      intlDescription: {
        id: 'richtext-html-paste.description',
        defaultMessage: 'Rich text editor with HTML compatibility, tables, images, and font controls.',
      },
      icon: () => null,
      components: {
        Input: () => {
          // #region agent log H-C: input loader invoked
          console.info('[DEBUG-33de34][H-C] custom field Input() loader invoked');
          fetch('http://127.0.0.1:7705/ingest/603965e3-38e7-429a-b23a-4fd7a5669d82',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'33de34'},body:JSON.stringify({sessionId:'33de34',runId:'pre-fix',hypothesisId:'H-C',location:'app.tsx:Input-loader',message:'Input() loader invoked',data:{field:'global::richtext-html-paste'},timestamp:Date.now()})}).catch(()=>{});
          // #endregion

          return import('./extensions/RichtextHtmlPasteInput')
            .then((module) => {
              // #region agent log H-C: input module resolved
              console.info('[DEBUG-33de34][H-C] Input module resolved', {
                exportKeys: Object.keys(module),
                hasNamed: !!(module as any).RichtextHtmlPasteInput,
                hasDefault: !!(module as any).default,
              });
              fetch('http://127.0.0.1:7705/ingest/603965e3-38e7-429a-b23a-4fd7a5669d82',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'33de34'},body:JSON.stringify({sessionId:'33de34',runId:'pre-fix',hypothesisId:'H-C',location:'app.tsx:Input-loader-resolved',message:'Input module resolved',data:{exportKeys:Object.keys(module)},timestamp:Date.now()})}).catch(()=>{});
              // #endregion

              return { default: module.RichtextHtmlPasteInput };
            })
            .catch((err: unknown) => {
              // #region agent log H-C: input module FAILED
              console.error('[DEBUG-33de34][H-C] Input module import failed', err);
              fetch('http://127.0.0.1:7705/ingest/603965e3-38e7-429a-b23a-4fd7a5669d82',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'33de34'},body:JSON.stringify({sessionId:'33de34',runId:'pre-fix',hypothesisId:'H-C',location:'app.tsx:Input-loader-error',message:'Input module import failed',data:{error:String(err)},timestamp:Date.now()})}).catch(()=>{});
              // #endregion
              throw err;
            });
        },
      },
    });
  },
  bootstrap(app: StrapiApp) {
    // Optional: extend admin UI
  },
};
