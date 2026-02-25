# Patches (reference)

This folder holds reference snippets for **strapi-cms**. The Option A compression block is already applied in `src/index.ts`; this file is for reference or re-use elsewhere.

## Option A: Image compression (plugin::upload.file afterCreate)

1. **Install Sharp:**  
   `npm install sharp`

2. **In `src/index.ts`** add imports: `sharp`, `path`, `fs`.

3. **Inside `bootstrap({ strapi })`**, add the lifecycle block from **`upload-compress-afterCreate.ts`** (e.g. at the end of bootstrap).

4. Restart Strapi. New uploads (from base64 extraction or Media Library) will be compressed on disk (max 1920×1920, JPEG 82 / PNG compression 6).

**Note:** When using the **local** provider, this runs on every uploaded image. When using **Cloudinary**, uploads go to the cloud and may not have a local path; this block is mainly for local storage.
