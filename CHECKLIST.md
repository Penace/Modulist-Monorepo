# RealEstateSaaS Backend – Deployment & Development Checklist

---

## 🧱 Setup & Environment

- [x] PNPM project initialized
- [x] Core dependencies installed (`express`, `mongoose`, `cors`, `dotenv`, `morgan`)
- [x] Dev tools installed (`nodemon`)
- [x] `.env` file created with MongoDB URI
- [x] MongoDB connection tested
- [x] Backend runs on `http://localhost:4000`

---

## 📦 API Architecture (Express + MongoDB)

### Listings
- [x] Listing model created
- [x] Routes: GET /api/listings, GET /api/listings/:id
- [x] Pending routes: POST /api/pending, POST /api/pending/:id/approve
- [x] Controller modularized

### Users
- [x] User model created (name, email, role, approved, etc.)
- [x] Routes: GET /api/users, GET /api/users/:id, POST /api/users
- [x] PATCH /api/users/:id/approve (admin moderation)
- [x] Controller modularized
- [x] Validations: required, enum, unique, etc.

---

## 🧪 Testing & Integration

- [x] API manually tested (curl/Postman)
- [x] MongoDB data verified via `mongosh`
- [x] Frontend connected via REST

---

## 🖥️ VM Deployment

- [x] SSH into API VM
- [x] Clone backend repo
- [x] Install Node.js + PNPM
- [x] Install dependencies
- [ ] (Optional) Add PM2 or systemd for persistent deployment
- [x] Test server availability via static IP

---

> “This is not just a backend. It’s a living API layer built for trace evolution.”