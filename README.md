# Modulist - Academic Submission Monorepo

This is a monorepo version of the Modulist application, created specifically for academic submission.

## Quick Start

```bash
pnpm install
pnpm dev
```

The frontend will be available at http://localhost:5173 and the backend at http://localhost:4000.

## Project Structure

```
modulist-monorepo/
├── packages/
│   ├── backend/     # Express/Node.js API
│   └── frontend/    # React/Vite frontend
├── uploads/         # Local image storage (git-ignored)
├── e2e/            # End-to-end tests
└── docs/           # Documentation
```

## Development

- `pnpm dev` - Start both frontend and backend
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm build` - Build for production

## Academic Notes

This project demonstrates fullstack development with:
- Express/Node.js backend with MongoDB
- React frontend with modern tooling
- Image upload with local storage
- Authentication and authorization
- CRUD operations and RESTful API design
