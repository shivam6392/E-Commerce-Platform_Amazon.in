# Amazon Clone — Fullstack E-Commerce Platform

A fully functional Amazon-like e-commerce web application built as an SDE Intern Fullstack Assignment.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript (Vite) |
| Backend | Node.js + Express.js + TypeScript |
| Database | PostgreSQL + Prisma ORM (v7) |
| Styling | Vanilla CSS (Amazon-inspired design system) |
| HTTP Client | Axios |
| Icons | Lucide React |

## 🗂️ Project Structure

```
amazon-clone/
├── backend/         # Express + Prisma API server
│   ├── src/
│   │   ├── index.ts          # Server entry point
│   │   └── routes/
│   │       ├── products.ts   # Product APIs
│   │       ├── cart.ts       # Cart APIs
│   │       └── orders.ts     # Order APIs
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   └── seed.ts           # Sample data seeder
│   ├── prisma.config.ts      # Prisma v7 datasource config
│   └── .env                  # Environment variables
└── frontend/        # React + Vite SPA
    └── src/
        ├── api/              # Axios API service
        ├── components/       # Header, Footer, ProductCard
        ├── context/          # Cart context (global state)
        ├── pages/            # All page components
        └── types/            # TypeScript interfaces
```

## 🗄️ Database Schema

```
User ────── Cart ───── CartItem ──── Product
  └──────── Order ──── OrderItem ─── Product
```

- **User**: Default user for the app (no login required)
- **Product**: id, name, description, price, category, imageUrls, stock, rating, reviewCount
- **Cart / CartItem**: Persistent cart per user, with auto-recalculated total
- **Order / OrderItem**: Order with shipping address, status, and snapshot of item prices

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- PostgreSQL running locally
- npm v9+

### 1. Clone the repo
```bash
git clone <repo-url>
cd amazon-clone
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env and set your DATABASE_URL
# Example: DATABASE_URL="postgresql://postgres:password@localhost:5432/amazon_clone"

npm install

# Create the database first in PostgreSQL, then run:
npx prisma migrate dev --name init

# Seed sample products
npm run seed

# Start the dev server (port 5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start dev server (port 3000, proxies /api to :5000)
npm run dev
```

Open **http://localhost:3000** in your browser.

## ✨ Core Features

| Feature | Description |
|---------|-------------|
| 🏠 Product Listing | Grid layout with search, category filters, shimmer loading |
| 📦 Product Detail | Image carousel, buy box, stock status, specs |
| 🛒 Shopping Cart | Add/update/remove items, real-time totals |
| 💳 Checkout | Validated shipping form, order review, COD payment |
| ✅ Order Confirmation | Order ID display, item summary, delivery estimate |
| 📋 Order History | View all past orders with status and items |
| 📱 Responsive Design | Mobile, tablet, and desktop support |

## 🎨 Design Decisions

- **Amazon-identical colors**: `#131921` (header), `#232f3e` (nav), `#ff9900` (accent), `#f0c14b` (buttons)
- **Default User**: User with ID=1 is always the logged-in user (no auth required by assignment)
- **Price Display**: Prices are in INR (₹) with a fake 20% discount for realism
- **Prisma v7**: Uses `prisma.config.ts` for datasource URL (breaking change from Prisma v6)
- **Cart Persistence**: Cart is stored in PostgreSQL, not localStorage, so it survives page refreshes

## 📋 Assumptions

1. A default user (`default@amazon.com`) is pre-seeded and always "logged in"
2. Payment is Cash on Delivery only (no payment gateway integration)
3. Product images are sourced from Unsplash (free CDN)
4. Stock levels are static and not decremented on order placement in this demo
