#!/usr/bin/env node

/*
Uploads local images in ./uploads (or a specified directory) to an open-source storage
provider and generates a manifest JSON with public URLs for use in DB seeding.

Supported providers:
- MinIO (S3-compatible)
- Supabase Storage
- 0x0.st (anonymous, no account; may rate-limit)
- Catbox (anonymous, no account; may rate-limit)
- Telegra.ph (anonymous, no account; reliable for small images)

Usage:
  PROVIDER=minio node scripts/upload-images.js
  PROVIDER=supabase node scripts/upload-images.js
  PROVIDER=0x0 node scripts/upload-images.js
  PROVIDER=catbox node scripts/upload-images.js
  PROVIDER=telegra node scripts/upload-images.js

Env required for MinIO:
  MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET, MINIO_PUBLIC_BASE_URL

Env required for Supabase:
  SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_BUCKET
*/

const fs = require('fs');
const path = require('path');
const fetch = ((...args) => import('node-fetch').then(({default: f}) => f(...args)));
const FormData = require('form-data');

const PROVIDER = process.env.PROVIDER || 'telegra';
const SOURCE_DIR = process.env.SOURCE_DIR || path.join(__dirname, '..', 'uploads');
const OUTPUT = process.env.OUTPUT || path.join(__dirname, '..', 'uploads-manifest.json');

async function uploadMinio(files) {
  const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
  const endpoint = process.env.MINIO_ENDPOINT;
  const accessKeyId = process.env.MINIO_ACCESS_KEY;
  const secretAccessKey = process.env.MINIO_SECRET_KEY;
  const bucket = process.env.MINIO_BUCKET;
  const publicBase = process.env.MINIO_PUBLIC_BASE_URL;

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    throw new Error('Missing MinIO env vars');
  }

  const s3 = new S3Client({
    forcePathStyle: true,
    region: 'us-east-1',
    endpoint: endpoint,
    credentials: { accessKeyId, secretAccessKey },
  });

  const urls = [];
  for (const file of files) {
    const key = `modulist/${Date.now()}-${path.basename(file)}`;
    const Body = fs.readFileSync(file);
    const ContentType = getMime(file);
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body, ContentType, ACL: 'public-read' }));
    urls.push(`${publicBase}/${bucket}/${key}`);
  }
  return urls;
}

async function uploadSupabase(files) {
  const { createClient } = require('@supabase/supabase-js');
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  const bucket = process.env.SUPABASE_BUCKET;
  const prefix = process.env.SUPABASE_PREFIX || 'modulist/';
  if (!url || !key || !bucket) throw new Error('Missing Supabase env vars');
  const supabase = createClient(url, key);
  const urls = [];
  for (const file of files) {
    const filename = `${prefix}${Date.now()}-${path.basename(file)}`;
    const data = fs.readFileSync(file);
    const { error } = await supabase.storage.from(bucket).upload(filename, data, {
      contentType: getMime(file),
      upsert: true,
    });
    if (error) throw error;
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(filename);
    urls.push(pub.publicUrl);
  }
  return urls;
}

async function upload0x0(files) {
  const urls = [];
  for (const file of files) {
    const form = new FormData();
    form.append('file', fs.createReadStream(file), {
      filename: path.basename(file),
      contentType: getMime(file),
    });
    const res = await fetch('https://0x0.st', { method: 'POST', body: form, headers: { ...(form.getHeaders?.() || {}), 'User-Agent': 'curl/8.0' } });
    if (!res.ok) throw new Error(`0x0 upload failed: ${res.status}`);
    const text = (await res.text()).trim();
    urls.push(text);
  }
  return urls;
}

async function uploadCatbox(files) {
  const urls = [];
  for (const file of files) {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', fs.createReadStream(file), {
      filename: path.basename(file),
      contentType: getMime(file),
    });
    const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form, headers: { ...(form.getHeaders?.() || {}), 'User-Agent': 'curl/8.0' } });
    if (!res.ok) throw new Error(`Catbox upload failed: ${res.status}`);
    const text = (await res.text()).trim();
    urls.push(text);
  }
  return urls;
}

async function uploadTelegra(files) {
  const urls = [];
  for (const file of files) {
    const form = new FormData();
    form.append('file', fs.createReadStream(file), {
      filename: path.basename(file),
      contentType: getMime(file),
    });
    const res = await fetch('https://telegra.ph/upload', { method: 'POST', body: form, headers: { ...(form.getHeaders?.() || {}), 'User-Agent': 'curl/8.0' } });
    if (!res.ok) throw new Error(`Telegra upload failed: ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json) || !json[0]?.src) throw new Error('Telegra unexpected response');
    const src = json[0].src.startsWith('/') ? `https://telegra.ph${json[0].src}` : json[0].src;
    urls.push(src);
  }
  return urls;
}

function getMime(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.gif') return 'image/gif';
  return 'application/octet-stream';
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f))
    .map((f) => path.join(dir, f));
}

(async () => {
  const files = listImages(SOURCE_DIR);
  if (files.length === 0) {
    console.log('No images found to upload in', SOURCE_DIR);
    fs.writeFileSync(OUTPUT, JSON.stringify({ images: [] }, null, 2));
    process.exit(0);
  }

  let urls = [];
  if (PROVIDER === 'minio') urls = await uploadMinio(files);
  else if (PROVIDER === 'supabase') urls = await uploadSupabase(files);
  else if (PROVIDER === '0x0') urls = await upload0x0(files);
  else if (PROVIDER === 'catbox') urls = await uploadCatbox(files);
  else if (PROVIDER === 'telegra') urls = await uploadTelegra(files);
  else throw new Error('Unsupported PROVIDER: ' + PROVIDER);

  fs.writeFileSync(OUTPUT, JSON.stringify({ images: urls }, null, 2));
  console.log('Wrote manifest to', OUTPUT);
})();

