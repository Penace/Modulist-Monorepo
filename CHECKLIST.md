# RealEstateSaaS Backend – Deployment Checklist

---

## Pre-Deployment

- [x] Git repository initialized
- [x] Minimal db.json created
- [x] json-server installed as dev dependency

---

## Deployment on VM

- [x] SSH into API Server
- [x] Clone repository
- [x] Install Node.js (if not installed)
- [x] Install dependencies (`pnpm install`)
- [x] Start json-server (`npx json-server --watch db.json --port 3000`)
- [ ] (Optional) Setup systemd or PM2 service

---

## Final Checks

- [x] API reachable via API Server Static IP
- [x] JSON data served on `http://<api-server-ip>:3000`

✅ Backend operational on API Server VM.

---
# RealEstateSaaS Backend – Expansion Checklist (Node + MongoDB)

## Phase 1: Environment Setup
- [ ] Initialize PNPM project (`pnpm init`)
- [ ] Install core dependencies (`express`, `mongoose`, `cors`, `dotenv`, `morgan`)
- [ ] Install dev tools (`nodemon`)
- [ ] Create `.env` file with MongoDB URI
- [ ] Create `server.js` entry point
- [ ] Test connection to MongoDB

## Phase 2: API Architecture
- [ ] Create `models/Listing.js`
- [ ] Create `routes/listingRoutes.js`
- [ ] Create `controllers/listingController.js`
- [ ] Setup `GET /api/listings`
- [ ] Setup `GET /api/listings/:id`
- [ ] Setup `POST /api/listings`

## Phase 3: Frontend Integration
- [ ] Update `api.js` to point to Express endpoints
- [ ] Test full CRUD flow from frontend
- [ ] Replace json-server dependency

## Phase 4: Deployment
- [ ] Install Node.js on API VM (if needed)
- [ ] Clone backend repo to VM
- [ ] Setup `.env` and install dependencies
- [ ] Run with `pm2` or systemd
- [ ] Confirm availability via static IP

> “This is not just a backend. It’s a living API layer built for trace evolution.”