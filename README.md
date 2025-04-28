# RealEstateSaaS – Backend

## Overview

This is the backend for the RealEstateSaaS project.

Built initially with:
- json-server (mock API server)
- Modular GitOps deployment standards
- PNPM package manager for faster installs

Planned future upgrades:
- Node.js + Express full backend

---

## Development Setup

1. Install Node.js on your machine or VM:
```bash
sudo apt update
sudo apt install nodejs npm -y
```

2. Install pnpm globally:
```bash
sudo npm install -g pnpm
```

3. Clone the repository:
```bash
git clone git@github.com:Penace/realestatesaas-backend.git
```

4. Install project dependencies:DONT RUN! no package.json yet.
```bash
cd realestatesaas-backend
pnpm install
```

5. Start API server (json-server example):
```bash
npx json-server --host 0.0.0.0 --watch db.json --port 3000
```
>Note: Add `--host 0.0.0.0` flag if hosting on VM to access from other devices on network.
---

## Project Architecture

| Area | Stack |
|:---|:---|
| Mock API | json-server |
| Deployment | GitOps (clone + run service) |
| Future | Expand to real Node.js backend |

---

## Roadmap

See [ROADMAP.md](./ROADMAP.md)

---

## Additional Resources

- [RealEstateSaaS Frontend Repo](https://github.com/Penace/realestatesaas-frontend)

---