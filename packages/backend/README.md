# Modulist – Backend

## Overview

This is the official backend for the Modulist platform.  
It now uses a modular Express + MongoDB architecture with full support for:

- Listings and pending approvals
- User registration and moderation
- Settings management and middleware auth checks
- RESTful API integration
- Admin tools and seed scripts
- Production-grade modularity and scalability

Previously started with `json-server` for prototyping.  
Now fully transitioned to production-ready Node.js backend.

---

## Project Architecture

/backend
├── models/             # Mongoose schemas (Listing, User)
├── routes/             # Express route modules
├── controllers/        # Modular route logic
├── config/             # MongoDB connection setup
├── middleware/         # Authentication and other middleware
├── uploads/            # Uploaded files storage
├── archive/            # Archived logic and scripts
│   └── scripts/        # Seed scripts and legacy utilities
├── server.js           # Express entry point
├── .env                # Environment variables

---

## API Endpoints

| Method | Route                                   | Description                                |
|--------|-----------------------------------------|--------------------------------------------|
| GET    | /api/listings                           | Get all listings (filter status in client) |
| GET    | /api/listings/:id                       | Get a listing by ID                        |
| POST   | /api/listings                           | Create a new listing                       |
| PATCH  | /api/listings/:id                       | Update a listing by ID                     |
| DELETE | /api/listings/:id                       | Delete a listing by ID                     |
| GET    | /api/users                              | Get all users (admin only)                 |
| GET    | /api/users/:id                          | Get a user by ID                           |
| POST   | /api/users                              | Register a new user                        |
| PATCH  | /api/users/:id                          | Update a user                              |
| PATCH  | /api/users/:id/approve                  | Approve a user                             |
| DELETE | /api/users/:id                          | Delete a user                              |
| GET    | /api/settings                           | Fetch global settings                      |
| PATCH  | /api/settings                           | Update global settings (admin only)        |
| GET    | /uploads/optimized/:filename            | Serve optimized uploads                    |

---
## Development Setup

1. Install Node.js and PNPM:
```bash
sudo apt update
sudo apt install nodejs npm -y
sudo npm install -g pnpm
```

2. Clone the repository:
```bash
git clone https://github.com/Penace/Modulist-Backend.git
cd Modulist-Backend
```

3. Setup environment:
```bash
cp .env.example .env
# Edit with your MongoDB URI
```

4. Install dependencies:
```bash
pnpm install
```

5. Run the server:
- For development (if available):
```bash
pnpm dev
```
- For production:
```bash
node server.js
```

6. (Optional) Seed mock data if needed:
```bash
node archive/scripts/seed.js
```

---
## **Status**  
✅ Fully functional REST API  
🔒 Integrated with frontend and role-based middleware

---
## **Roadmap**
- Implement role-based restrictions on all routes  
- Add request logging middleware  
- Connect with platform-wide VITE_IMAGE_BASE_URL config  
See [ROADMAP.md](./ROADMAP.md)

---
## **Additional Resources**
- [Frontend Repo](https://github.com/Penace/Modulist-Frontend)
