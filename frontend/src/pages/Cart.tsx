import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import './Cart.css';

const Cart: React.FC = () => {
  const { cart, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={80} color="#ff9900" />
        <h2>Your Amazon Cart is empty</h2>
        <p>Shop today's deals. Sign in to see items you added previously.</p>
        <button className="continue-shopping-btn" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-main">
        <h1 className="cart-title">Shopping Cart</h1>
        <p className="cart-deselect">Deselect all items</p>
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.product.imageUrls[0]}
                alt={item.product.name}
                className="cart-item-img"
                onClick={() => navigate(`/product/${item.product.id}`)}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120?text=Product'; }}
              />
              <div className="cart-item-details">
                <p className="cart-item-name" onClick={() => navigate(`/product/${item.product.id}`)}>
                  {item.product.name}
                </p>
                <div className={`cart-item-stock ${item.product.stock > 0 ? 'in' : 'out'}`}>
                  {item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
                <div className="cart-item-delivery">FREE Delivery by Tomorrow</div>
                <div className="cart-item-actions">
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateItem(item.id, item.quantity - 1)}
                      disabled={loading}
                    >
                      <Minus size={12} />
                    </button>
                    <span className="qty-display">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      disabled={loading || item.quantity >= item.product.stock}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="action-sep">|</span>
                  <button className="delete-btn" onClick={() => removeItem(item.id)} disabled={loading}>
                    <Trash2 size={14} /> Delete
                  </button>
                  <span className="action-sep">|</span>
                  <button className="wishlist-btn">Save for later</button>
                </div>
              </div>
              <div className="cart-item-price">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        <div className="cart-subtotal-row">
          Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items):{' '}
          <strong>{formatPrice(cart.totalAmount)}</strong>
        </div>
      </div>

      {/* Summary Box */}
      <div className="cart-summary">
        <div className="summary-box">
          <div className="summary-free-delivery">
            ✅ Your order is eligible for <strong>FREE Delivery</strong>
          </div>
          <div className="summary-total">
            Subtotal ({cart.items.reduce((s, i) => s + i.quantity, 0)} items):{' '}
            <strong>{formatPrice(cart.totalAmount)}</strong>
          </div>
          <button className="checkout-btn" onClick={() => navigate('/checkout')}>
            Proceed to Buy
          </button>
          <div className="summary-secure">
            <span>🔒</span> Secure transaction
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
