#!/usr/bin/env node

/*
Scan one or more directories for image files, derive a slug from each filename,
upload to Supabase Storage using deterministic object keys, and write a manifest
mapping slug -> public URL to uploads-manifest.json

Env required:
  SUPABASE_URL, SUPABASE_ANON_KEY or SUPABASE_KEY, SUPABASE_BUCKET
Optional:
  SUPABASE_PREFIX (default: public/)
  SOURCE_DIRS (comma-separated list; default: uploads,packages,frontend/public)
*/

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');

function getEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  const bucket = process.env.SUPABASE_BUCKET;
  const prefix = (process.env.SUPABASE_PREFIX || 'public/').replace(/^\/*/, '').replace(/\/*$/, '/') ;
  if (!url || !key || !bucket) {
    throw new Error('Missing Supabase env vars (need SUPABASE_URL, SUPABASE_ANON_KEY or SUPABASE_KEY, SUPABASE_BUCKET)');
  }
  return { url, key, bucket, prefix };
}

function listImageFiles(dir) {
  const results = [];
  function walk(d) {
    let entries = [];
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const ent of entries) {
      const p = path.join(d, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (/\.(png|jpe?g|webp|gif)$/i.test(ent.name)) results.push(p);
    }
  }
  walk(dir);
  return results;
}

function slugifyBase(name) {
  // remove extension
  const base = name.replace(/\.[a-z0-9]+$/i, '');
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function main() {
  const { url, key, bucket, prefix } = getEnv();
  const supabase = createClient(url, key);

  const defaultDirs = [
    path.join(__dirname, '..', 'uploads'),
    path.join(__dirname, '..', 'frontend', 'public'),
    path.join(__dirname, '..', 'packages'),
  ];
  const fromEnv = (process.env.SOURCE_DIRS || '').split(',').map(s => s.trim()).filter(Boolean);
  const dirs = (fromEnv.length ? fromEnv : defaultDirs).filter(d => fs.existsSync(d));
  if (dirs.length === 0) {
    console.log('No source directories found. Set SOURCE_DIRS or create ./uploads.');
    process.exit(0);
  }

  // Collect files
  const files = Array.from(new Set(dirs.flatMap(listImageFiles)));
  if (files.length === 0) {
    console.log('No images found to upload.');
    process.exit(0);
  }

  const bySlug = {};
  for (const file of files) {
    const base = path.basename(file);
    const slug = slugifyBase(base);
    const ext = path.extname(base).toLowerCase() || '.png';
    const objectKey = `${prefix}${slug}${ext}`; // deterministic key
    const data = fs.readFileSync(file);
    const contentType = ext === '.png' ? 'image/png' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : ext === '.webp' ? 'image/webp' : ext === '.gif' ? 'image/gif' : 'application/octet-stream';

    const { error } = await supabase.storage.from(bucket).upload(objectKey, data, {
      contentType,
      upsert: true,
    });
    if (error) {
      console.error(`Upload failed for ${file}:`, error.message);
      continue;
    }
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(objectKey);
    if (pub && pub.publicUrl) bySlug[slug] = pub.publicUrl;
  }

  // Create combined manifest with old structure and bySlug
  const manifestPath = path.join(__dirname, '..', 'uploads-manifest.json');
  const manifest = {
    images: Object.values(bySlug),
    bySlug,
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Wrote manifest to', manifestPath);
  console.log('Uploaded', Object.keys(bySlug).length, 'images.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
