#  Amazon Clone - Full Stack E-Commerce Solution

A high-performance, production-ready Amazon clone designed to replicate the primary experience of Amazon.in. This application delivers a complete end-to-end shopping journey, featuring advanced global state management, real-time synchronization, and a premium UI/UX.

---

##  CRITICAL: Backend Activation Required

This project uses **Render** for backend hosting on a free tier. To ensure the application functions correctly:

1.  **Always Wake the Backend**: Before first use, the Render service must be initialized. 
2.  **Activation Pop-up**: A dedicated **"Activate Server"** overlay is located at the **bottom right** of the interface. 
    - Click it to redirect to the backend health-check page.
    - Once the "Thank you for waking me up!" message appears, return to the shop.
    - The overlay will automatically hide for 15 minutes after a successful activation to ensure a seamless shopping experience.

---

##  Technical Architecture

###  Backend (`/backend`)
- **Runtime**: Node.js & Express.js (TypeScript)
- **Database**: PostgreSQL with **Prisma ORM**
- **Email Service**: **[Resend](https://resend.com)** – Integrated for professional, high-deliverability order confirmation emails.
- **Auto-Healing**: Scripts that automatically repair broken product images and seed the database on startup.
- **Security**: JWT-based simulated authentication and secure CORS configurations.

###  Frontend (`/frontend`)
- **Framework**: React 19 (Vite)
- **Global State**: Advanced Context API (`AuthContext`, `CartContext`, `WishlistContext`) ensuring real-time UI updates across all components.
- **Design**: Premium Vanilla CSS with **Amazon Design Language (ADL)** principles.
- **UX Features**: 
  - Optimistic UI updates for Wishlist actions.
  - Robust image fallback system with infinite-loop prevention.
  - Fully responsive mobile & desktop navigation.

---

##  Primary Features

- **Real-Time Wishlist Sync**: Add/Remove items with zero latency feedback and global synchronization.
- **Dynamic Product Catalog**: 40+ high-quality products across Electronics, Clothing, Books, and Home & Kitchen.
- **Smart Filtering**: Category-based navigation and real-time search functionality.
- **Persistent Cart**: Local storage and backend-backed cart persistence for uninterrupted shopping.
- **Email Confirmations**: Automated HTML order receipts sent via the **Resend API**.
- **Checkout Flow**: Seamless transition from Cart to Order Placement with address validation.

---

##  Local Development

### 1. Environment Variables
Create a `.env` file in the `/backend` directory:
```env
DATABASE_URL="your_postgresql_url"
PORT=5000
RESEND_API_KEY="re_your_api_key_from_resend"
FRONTEND_URL="http://localhost:3000"
```

Create a `.env` file in the `/frontend` directory:
```env
VITE_API_URL="http://localhost:5000"
```

### 2. Quick Start Commands

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma db push --accept-data-loss # Idempotent sync
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

##  Resend Email Integration

The project uses the **Resend Node.js SDK** for reliable email delivery. 
- **Configuration**: Use `RESEND_API_KEY` in your environment variables.
- **Template**: Professionally styled HTML templates in `mailer.ts`.
- **Note**: On the Resend free tier, ensure the `from` address matches your verified domain or the default `onboarding@resend.dev`.

---

##  Production Deployment

### **Render (Backend)**
- **Build Command**: `npm install && npx prisma generate && npx prisma db push --accept-data-loss && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/`

### **Vercel/Netlify (Frontend)**
- **Framework Preset**: Vite
- **Environment Variable**: `VITE_API_URL` (Link to your live Render backend)

---

##  License
This project is for educational purposes as a part of a full-stack development portfolio.
