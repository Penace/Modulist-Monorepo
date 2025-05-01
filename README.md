# RealEstateSaaS – Backend

## Overview

This is the official backend for the RealEstateSaaS platform.  
It now uses a modular Express + MongoDB architecture with full support for:

- Listings and pending approvals
- User registration and moderation
- RESTful API integration
- Admin tools and seed scripts

Previously started with `json-server` for prototyping.  
Now fully transitioned to production-ready Node.js backend.

---

## Project Architecture

/backend
├── models/             # Mongoose schemas (Listing, User)
├── routes/             # Express route modules
├── controllers/        # Modular route logic
├── config/             # MongoDB connection setup
├── seed.js             # Listing data seeder
├── server.js           # Express entry point
├── .env                # Environment variables

---

## API Endpoints

| Method | Route                           | Description                   |
|--------|----------------------------------|-------------------------------|
| GET    | /api/listings                   | List all published properties |
| GET    | /api/listings/:id               | View one property             |
| POST   | /api/pending                    | Submit listing for approval   |
| POST   | /api/pending/:id/approve        | Admin approves a listing      |
| GET    | /api/users                      | List all users (admin only)   |
| POST   | /api/users                      | Register new user             |
| PATCH  | /api/users/:id/approve          | Admin approves a user         |

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
git clone https://github.com/Penace/realestatesaas-backend.git
cd realestatesaas-backend
```

3. Setup environment:
```bash
cp .env.example .env
# Edit with your MongoDB URI
```

4. Install and run:
```bash
pnpm install
node server.js
```
---
## **Status**  
✅ Fully functional REST API
⚙️ Ready for frontend integration and future auth layer

---
## **Roadmap**
See [ROADMAP.md](./ROADMAP.md)

---
## **Additional Resources**
- [Frontend Repo](https://github.com/Penace/realestatesaas-frontend)