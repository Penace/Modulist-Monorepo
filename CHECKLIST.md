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
- [ ] Install Node.js (if not installed)
- [ ] Install dependencies (`pnpm install`)
- [ ] Start json-server (`npx json-server --watch db.json --port 3000`)
- [ ] (Optional) Setup systemd or PM2 service

---

## Final Checks

- [ ] API reachable via API Server Static IP
- [ ] JSON data served on `http://<api-server-ip>:3000`

✅ Backend operational on API Server VM.

---
