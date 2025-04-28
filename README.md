# RealEstateSaaS – Backend

## Overview

This is the backend for the RealEstateSaaS project.

Built initially with:
- json-server (mock API)
- Modular GitOps deployment standards

Planned future upgrades:
- Node.js + Express full backend

---

## Development Setup

1. Clone the repository:
```bash
git clone git@github.com:yourusername/realestatesaas-backend.git
```

2. Install dependencies:
```bash
npm install
```
3. Start API server (json-server example):
```bash
npx json-server --watch db.json --port 3000
```
---

## Project Architecture

| Area | Stack |
|:---|:---|
| Mock API | json-server |
| Deployment | GitOps (clone + start service) |
| Future | Expand to real Node.js backend |

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md)

---

✅ This backend is designed for modular VM deployment under GitOps control.
