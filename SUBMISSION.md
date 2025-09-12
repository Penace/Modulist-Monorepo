# Modulist – Course Submission

This document provides the exact steps and context needed for marking the Modulist full‑stack project.

## Repository
- Monorepo: https://github.com/Penace/Modulist-Monorepo
- Stack: React (Vite) + Express + MongoDB
- Package manager: pnpm

## Requirements
- Node.js 18+
- pnpm 8+
- MongoDB running locally (or MongoDB Atlas)

## Quick Start
1) Clone and install
```bash
git clone https://github.com/Penace/Modulist-Monorepo.git
cd Modulist-Monorepo
cp .env.example .env
pnpm setup   # installs deps and creates sample images locally
```

2) Start dev servers
```bash
pnpm dev
```

3) URLs
- Frontend: http://localhost:5173
- Backend health: http://localhost:4000/health

## MongoDB Seeding (recommended for marking)
Provide a minimal dataset for easy evaluation.

Option A) One-command remote image seed (no setup)
```bash
pnpm seed:mongo
```

Option B) Use your local images but host them via an open-source storage
- MinIO (S3-compatible) or Supabase Storage

1) Configure .env with your provider values (see placeholders)
2) Upload local images and generate a manifest of public URLs
```bash
# For MinIO
PROVIDER=minio pnpm upload:images
# Or for Supabase
PROVIDER=supabase pnpm upload:images
```
3) Seed DB using the uploaded image URLs
```bash
pnpm seed:mongo:manifest
```

Note: If using Atlas, set MONGO_URI in .env accordingly.

## Image Handling (no images in the repo)
The app supports two approaches:

1) Local uploads (default for dev)
- Images are stored under ./uploads (git-ignored)
- Seeding creates 1x1 placeholder images
- Frontend proxies /uploads to the backend, which serves them statically

2) External/web URLs
- You can provide an array of public image URLs when creating an item
- The frontend will POST them to /api/uploads/urls to validate, and then save as-is

This avoids committing images to the repository while still enabling a complete demo flow.

## Demo Flow (suggested)
1) Register a normal user and log in
2) Create/publish an item with either:
   - Upload images via the form (stored locally in ./uploads)
   - Or paste external image URLs
3) View the item cards and details, see thumbnail rendering
4) Log in as admin (admin@example.com / password) to view moderation endpoints if needed

## Scripts
- pnpm dev: run both servers
- pnpm backend:dev: backend only
- pnpm frontend:dev: frontend only
- pnpm seed:images: create sample images (local only)

## Notes
- Authentication: JWT (simple dev secret in .env)
- CORS: configured for localhost
- Database: MongoDB, models in packages/backend/models
- This monorepo was assembled from the original separate repos and is intended solely for academic submission.

