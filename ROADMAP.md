# RealEstateSaaS Backend – Roadmap

---

## ✅ Phase 1: Legacy Mock API
- [x] Setup json-server
- [x] Create `db.json` and mock routes
- [x] Basic frontend integration

---

## ✅ Phase 2: Express Backend Foundation
- [x] Create `server.js` with modular structure
- [x] Setup MongoDB connection
- [x] Add `/models`, `/controllers`, `/routes` structure
- [x] Implement Listing and Pending routes
- [x] Seed real listings into MongoDB

---

## ✅ Phase 3: User System + Validation
- [x] Define full `User.js` schema (email, name, role, approved, etc.)
- [x] Add validation (required, enum, unique, etc.)
- [x] Create user routes and controller
- [x] Add approval endpoint for admin actions

---

## ⏳ Phase 4: Production Prep & Auth System
- [ ] PM2 or systemd deployment (persistent daemon)
- [ ] Add login endpoint (JWT or session-based)
- [ ] Protect admin routes with middleware
- [ ] Encrypt passwords (bcrypt or similar)

---

> ⚡ "Backends are not built to be seen.  
They are built to be felt — fast, solid, unbreakable."