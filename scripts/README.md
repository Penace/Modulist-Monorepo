# Scripts

## Image Upload Scripts

Two scripts are available for uploading images to Supabase Storage:

### `upload-images.js`
- Uploads all images from specified directories to Supabase Storage
- Generates random-named object keys 
- Creates `uploads-manifest.json` with array of public URLs

### `upload-images-by-slug.js` (Recommended)
- Scans directories for images and derives slugs from filenames
- Uses deterministic object keys based on slugs
- Creates `uploads-manifest.json` with both URL array and slug mapping
- Enables predictable seeding where database items match image filenames

## Usage

```bash
# Upload with slug-based naming (recommended)
npm run upload:images:slugs

# Upload with random naming
npm run upload:images
```

## Environment Variables

Required:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY` or `SUPABASE_KEY`
- `SUPABASE_BUCKET`

Optional:
- `SUPABASE_PREFIX` (default: `public/`)
- `SOURCE_DIRS` (comma-separated; default: `uploads,packages,frontend/public`)

## Seeding

After uploading, seed your database:

```bash
npm run seed:manifest
```

The seed script will create database items matching your uploaded images when using the slug-based upload approach.
