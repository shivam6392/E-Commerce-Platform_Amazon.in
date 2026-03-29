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

import { useSearchParams } from 'react-router-dom';

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
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );

};

export default App;
