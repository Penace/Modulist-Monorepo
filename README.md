# Modulist - Academic Submission Monorepo

[![CI](https://img.shields.io/badge/CI-passing-green)](https://github.com/Penace/Modulist-Monorepo/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-18+-brightgreen)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8+-brightgreen)](https://pnpm.io/)

A complete fullstack property listing application built with React, Express, and MongoDB. This monorepo version is specifically prepared for academic submission and evaluation.

## 🚀 Quick Start

**Prerequisites:**
- Node.js 18+
- pnpm 8+
- MongoDB (local or cloud)

**Setup (3 commands):**
```bash
git clone <repository-url>
cd modulist-monorepo
pnpm setup  # Installs dependencies and seeds sample images
```

**Start development servers:**
```bash
pnpm dev
```

✅ Frontend: http://localhost:5173  
✅ Backend API: http://localhost:4000  
✅ API Test: http://localhost:4000/test  

## 📁 Project Structure

```
modulist-monorepo/
├── packages/
│   ├── backend/          # Express.js API server
│   │   ├── controllers/  # Route handlers
│   │   ├── models/       # MongoDB schemas
│   │   ├── middleware/   # Auth & validation
│   │   ├── routes/       # API endpoints
│   │   └── uploads/      # File handling
│   └── frontend/         # React.js application
│       ├── src/
│       │   ├── components/  # Reusable UI components
│       │   ├── pages/       # Route components
│       │   ├── hooks/       # Custom React hooks
│       │   ├── services/    # API communication
│       │   └── utils/       # Helper functions
│       └── public/       # Static assets
├── uploads/              # Image storage (git-ignored)
├── scripts/              # Development utilities
└── docs/                 # Documentation
```

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both frontend and backend in parallel |
| `pnpm backend:dev` | Start only the backend server |
| `pnpm frontend:dev` | Start only the frontend dev server |
| `pnpm build` | Build both packages for production |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm seed:images` | Create sample images for testing |

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js 18+ with ES modules
- **Framework:** Express.js 5
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer with local storage
- **Image Processing:** Sharp
- **Development:** Nodemon for hot reloading

### Frontend
- **Framework:** React 19 with Hooks
- **Build Tool:** Vite 6 for fast development
- **Routing:** React Router DOM 7
- **Styling:** TailwindCSS with modern utilities
- **HTTP Client:** Fetch API with custom service layer
- **PDF Generation:** jsPDF for reports

### Infrastructure
- **Package Manager:** pnpm with workspaces
- **Development:** Concurrent servers with proxy
- **File Storage:** Local uploads directory
- **Environment:** dotenv configuration

## 🔒 Authentication & Authorization

- **User Registration/Login:** JWT-based authentication
- **Role System:** Admin, Publisher, and regular User roles
- **Protected Routes:** Frontend route guards
- **API Security:** Middleware-based token validation

## 📊 Features Implemented

### Core Functionality
- ✅ User registration and authentication
- ✅ Item/property CRUD operations
- ✅ Image upload with thumbnail generation
- ✅ Role-based access control
- ✅ Responsive UI design
- ✅ Search and filtering
- ✅ User dashboard
- ✅ Admin panel

### Technical Features
- ✅ RESTful API design
- ✅ MongoDB integration
- ✅ File upload handling
- ✅ Error handling and validation
- ✅ Modern ES6+ JavaScript
- ✅ Component-based architecture

## 🌐 Environment Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure MongoDB:**
   - **Local:** `MONGO_URI=mongodb://localhost:27017/modulist`
   - **Cloud:** Use your MongoDB Atlas connection string

3. **Set JWT Secret:**
   ```bash
   JWT_SECRET=your-super-secret-key-change-in-production
   ```

## 🧪 Testing the Application

1. **Start the application:** `pnpm dev`
2. **Register a new user:** Navigate to signup page
3. **Upload a property:** Use the "Publish" feature
4. **Test image upload:** Upload an image with property details
5. **Admin functions:** Create admin user and test moderation

## 🚨 Troubleshooting

### Common Issues

**Port conflicts:**
- Backend default: 4000
- Frontend default: 5173
- Change in `.env` file if needed

**MongoDB connection:**
```bash
# Verify MongoDB is running
mongosh --eval 'db.runCommand("ismaster")'
```

**Image uploads not working:**
- Run `pnpm seed:images` to create uploads directory
- Check file permissions on uploads folder
- Verify Sharp is installed correctly

**Dependencies issues:**
```bash
# Clear cache and reinstall
pnpm clean
rm -rf node_modules
pnpm install
```

## 🎓 Academic Evaluation Checklist

### Backend Development (Node.js/Express)
- [x] RESTful API endpoints
- [x] MongoDB database integration
- [x] Middleware implementation
- [x] Error handling
- [x] File upload functionality
- [x] Authentication system
- [x] Data validation

### Frontend Development (React)
- [x] Component-based architecture
- [x] State management with hooks
- [x] Routing implementation
- [x] Form handling and validation
- [x] API integration
- [x] Responsive design
- [x] User interface design

### Full-Stack Integration
- [x] Frontend-backend communication
- [x] Authentication flow
- [x] File upload system
- [x] CRUD operations
- [x] Error handling across stack
- [x] Environment configuration

### Code Quality
- [x] Modern JavaScript (ES6+)
- [x] Clean code structure
- [x] Comments and documentation
- [x] Git version control
- [x] Package management
- [x] Development workflow

## 📝 Submission Notes

**Project Type:** Fullstack Web Application  
**Repository:** Monorepo with complete git history  
**Deployment:** Ready for local development and testing  
**Documentation:** Comprehensive setup and usage guide  
**Testing:** Includes sample data and manual testing procedures  

**Key Learning Outcomes Demonstrated:**
- Modern JavaScript development
- React.js frontend architecture
- Express.js backend development
- MongoDB database operations
- Authentication and security
- File handling and storage
- API design and integration
- Full-stack application deployment

---

**Author:** Penace  
**Course:** [Course Name]  
**Submission Date:** [Date]  
**License:** MIT
