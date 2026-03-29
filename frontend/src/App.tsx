import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

// Render Server Wake Overlay — hidden for 15 minutes after activation
const WAKE_KEY = 'render_awake_until';
const FIFTEEN_MIN = 15 * 60 * 1000;

const RenderWakeOverlay: React.FC = () => {
  const [visible, setVisible] = React.useState(() => {
    const expiresAt = localStorage.getItem(WAKE_KEY);
    if (expiresAt && Date.now() < Number(expiresAt)) return false;
    localStorage.removeItem(WAKE_KEY);
    return true;
  });
  const [status, setStatus] = React.useState<'idle' | 'activating' | 'success'>('idle');

  const handleActivate = async () => {
    setStatus('activating');
    try {
      const BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api` : '/api';
      await axios.get(`${BASE}/products`);
      setStatus('success');
    } catch (e) {
      setStatus('success');
    }
    // Store expiry timestamp — overlay stays hidden for 15 minutes
    localStorage.setItem(WAKE_KEY, String(Date.now() + FIFTEEN_MIN));
    setTimeout(() => setVisible(false), 1500);
  };

  if (!visible) return null;

  return (
    <div className="render-overlay">
      <div className="render-box">
        <h3>Activate Server</h3>
        <p>
          This project's backend is hosted on Render's free tier, which goes to sleep after 15 minutes of inactivity.
        </p>
        <p>Please click below to wake the server up for the optimal Amazon Clone experience!</p>
        <a
          className="render-btn"
          href="https://amazon-clone-backend-kpl5.onrender.com"
          target="_blank"
          rel="noreferrer"
          onClick={handleActivate}
          style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
        >
          {status === 'idle' ? 'Activate Full Experience' : status === 'activating' ? 'Waking up server (~40s)...' : 'Server Active'}
        </a>
      </div>
    </div>
  );
};

// Wrapper to handle header search
const AppRoutes: React.FC = () => {
  const [, setSearchParams] = useSearchParams();

  const handleSearch = (query: string, category: string) => {
    const params: any = {};
    if (query) params.search = query;
    if (category && category !== 'All') params.category = category;
    setSearchParams(params);
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <RenderWakeOverlay />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>

      </main>
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );

};

export default App;
