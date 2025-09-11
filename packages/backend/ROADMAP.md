# Modulist Backend – Roadmap

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

## ✅ Phase 4: Authentication + Middleware
- [x] Add login and signup endpoints (JWT)
- [x] Create `requireAuth`, `requireAgent`, `requireAdmin` middleware
- [x] Encrypt passwords using bcrypt
- [x] Protect sensitive routes (admin, agent, draft saving, etc.)

---

## ⏳ Phase 5: Admin & Settings System
- [x] Create `Settings.js` model and schema
- [x] Add `/settings` routes and controller
- [x] Create `checkMaintenanceMode` middleware
- [ ] Implement currency system (use setting in price display)
- [ ] Add live toggles for maintenance mode and approvals
- [ ] Build logging/analytics endpoints

---

> ⚡ "Backends are not built to be seen.  
They are built to be felt — fast, solid, unbreakable."