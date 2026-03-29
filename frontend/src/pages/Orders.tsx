import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api';
import type { Order } from '../types';
import './Orders.css';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (loading) return <div className="orders-loading">Loading your orders...</div>;

  return (
    <div className="orders-page">
      <h1 className="orders-title">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="orders-empty">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="orders-shop-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-header-info">
                  <div>
                    <div className="oh-label">ORDER PLACED</div>
                    <div className="oh-val">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div>
                    <div className="oh-label">TOTAL</div>
                    <div className="oh-val">{formatPrice(order.totalAmount)}</div>
                  </div>
                  <div>
                    <div className="oh-label">SHIP TO</div>
                    <div className="oh-val view-order-link" style={{ cursor: 'pointer' }}>{order.userId === 1 ? 'Guest User' : 'You'} ▼</div>
                  </div>
                  <div className="order-status-badge">{order.status}</div>
                </div>
                <div className="order-id-section">
                  <span className="oh-label">ORDER # {String(order.id).padStart(10, '0')}</span>
                  <Link to={`/order-confirmation/${order.id}`} className="view-order-link">View order details</Link>
                </div>
              </div>
              <div className="order-body">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img
                      src={item.product.imageUrls[0]}
                      alt={item.product.name}
                      className="oi-img"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Product'; }}
                    />
                    <div className="oi-info">
                      <Link to={`/product/${item.product.id}`} className="oi-name">{item.product.name}</Link>
                      <div className="oi-meta">Qty: {item.quantity} × {formatPrice(item.price)}</div>
                      <div className="oi-delivery">
                        <strong>Expected Delivery:</strong> {new Date(new Date(order.createdAt).getTime() + 3 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#555' }}>Your package is on the way.</p>
                      </div>
                    </div>
                    <div className="oi-actions">
                      <button className="track-package-btn">Track package</button>
                      <Link to={`/product/${item.product.id}`} className="buy-again-btn">Buy it again</Link>
                      <button className="write-review-btn">Write a product review</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
