# Amazon Clone - Full Stack E-Commerce Application

A fully functional, full-stack Amazon clone designed to mimic the core experience of Amazon.in. It features a complete shopping flow, including product browsing, search filtering, user authentication, cart management, and order placement.

##  Live Demo Structure

This project is structured as a monorepo containing both the purely isolated frontend and backend environments, optimized for quick deployment on cloud platforms like Vercel and Render.

- **Frontend:** Deployed on Vercel
- **Backend/API:** Deployed on Render (PostgreSQL managed database)

---

## 🛠️ Tech Stack & Architecture

### Frontend (`/frontend`)
- **Framework:** React 19 (Vite)
- **Language:** TypeScript
- **Routing:** React Router v7
- **Network Requests:** Axios
- **Icons:** Lucide-React
- **Styling:** Vanilla CSS (Custom flexbox & responsive grids matching Amazon's design system)
- **State Management:** React Context API (`AuthContext`, `CartContext`)

### Backend (`/backend`)
- **Runtime:** Node.js
- **Server:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma (v7.6+)
- **Security:** Standard CORS policies

---

##  Features

- **User Authentication:** Sign up and login functionalities with isolated user sessions.
- **Product Catalog:** A rich auto-seeded catalog of electronics, clothing, books, and home appliances.
- **Dynamic Search:** Filter products exactly like the real site by category and title.
- **Shopping Cart:** Add, remove, and adjust quantities of goods directly from a globally state-managed cart.
- **Wishlist:** Add products to a customized saved wishlist.
- **Orders:** Place orders processing the current state of the global cart.
- **Responsive Navigation:** Intricate Amazon-style mobile navigation bar and sidebar.

---

##  Local Development Workflow

Follow these steps to safely run the application locally.

### 1. Database Setup
This project uses PostgreSQL. Have a local or remote PostgreSQL instance running.

Ensure you configure the `.env` file in the `/backend` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/amazon_clone"
PORT=5000
```

### 2. Backend Setup
```bash
cd backend
npm install

# Force syncs the Prisma schema with your database (No migration files needed!)
# This is specifically optimized for Render deployment and local setups
npx prisma db push --accept-data-loss

# Generate the Prisma client
npx prisma generate 

# Start the development server (runs nodemon)
npm run dev
```

*Note: The backend is programmed to automatically seed the product catalog into your database on startup (`autoSeedIfEmpty()`).*

### 3. Frontend Setup
In a new terminal window, configure the frontend.

```bash
cd frontend
npm install
```

Ensure your `/frontend/.env` file points to the local backend:
```env
VITE_API_URL="http://localhost:5000"
```

```bash
# Start Vite development server
npm run dev
```

The frontend will run on `http://localhost:3000` (or `http://localhost:5173`).

---

##  Production Deployment Guide

### Deploying the Backend (Render)
1. Provide a managed PostgreSQL database via Render or Supabase.
2. Add your `DATABASE_URL` environment variable.
3. Configure your Build Command:
   `npm install && npx prisma generate && npx prisma db push --accept-data-loss && npm run build`
4. Configure your Start Command:
   `npm start`

### Deploying the Frontend (Vercel)
1. Add the environment variable `VITE_API_URL` matching your Render live backend link (e.g., `https://amazon-backend.onrender.com`).
2. Make sure there are NO trailing slashes securely handled by the `api/index.ts` interceptors!
3. Deploy!
