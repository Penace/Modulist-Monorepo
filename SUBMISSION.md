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

1) Create DB and user (local default)
```bash
mongosh <<'EOF'
use modulist
// Create an admin/publisher user for testing (password is bcrypt-hashed by the app on creation routes; for seed we keep plain fields)
db.users.insertOne({
  email: "admin@example.com",
  name: "Admin",
  passwordHash: "$2a$10$Xk5FQjYiA1x1LxFZtBk8quyH.2z6d2J95o0A1xTt6M4A1rpx9k4y6", // 'password' (bcrypt)
  role: "admin",
  approved: true,
  createdAt: new Date()
})

// Seed a couple of sample items (image URLs can be external or the local /uploads seed)
db.items.insertMany([
  {
    title: "Cozy Apartment",
    price: 250000,
    location: "City Center",
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 80,
    address: "123 Main St",
    images: ["http://localhost:4000/uploads/house-1.png"],
    description: "Great apartment",
    propertyType: "apartment",
    yearBuilt: 2015,
    parkingAvailable: "Yes",
    type: "sale",
    status: "published",
    createdAt: new Date()
  },
  {
    title: "Suburban House",
    price: 450000,
    location: "Green Suburbs",
    bedrooms: 4,
    bathrooms: 3,
    squareFootage: 180,
    address: "456 Oak Ave",
    images: ["http://localhost:4000/uploads/house-2.png"],
    description: "Spacious family home",
    propertyType: "house",
    yearBuilt: 2008,
    parkingAvailable: "Garage",
    type: "sale",
    status: "published",
    createdAt: new Date()
  }
])
EOF
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

