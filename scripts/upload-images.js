#!/usr/bin/env node

/*
Uploads local images in ./uploads (or a specified directory) to an open-source storage
provider and generates a manifest JSON with public URLs for use in DB seeding.

Supported providers:
- MinIO (S3-compatible)
- Supabase Storage

Usage:
  PROVIDER=minio node scripts/upload-images.js
  PROVIDER=supabase node scripts/upload-images.js

Env required for MinIO:
  MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET, MINIO_PUBLIC_BASE_URL

Env required for Supabase:
  SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_BUCKET
*/

const fs = require('fs');
const path = require('path');

const PROVIDER = process.env.PROVIDER || 'minio';
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
  const key = process.env.SUPABASE_ANON_KEY;
  const bucket = process.env.SUPABASE_BUCKET;
  if (!url || !key || !bucket) throw new Error('Missing Supabase env vars');
  const supabase = createClient(url, key);
  const urls = [];
  for (const file of files) {
    const filename = `modulist/${Date.now()}-${path.basename(file)}`;
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
  else throw new Error('Unsupported PROVIDER: ' + PROVIDER);

  fs.writeFileSync(OUTPUT, JSON.stringify({ images: urls }, null, 2));
  console.log('Wrote manifest to', OUTPUT);
})();

