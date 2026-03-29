import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrder } from '../api';
import { CheckCircle } from 'lucide-react';
import type { Order } from '../types';
import './OrderConfirmation.css';

const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getOrder(Number(id))
        .then((res) => setOrder(res.data))
        .catch(() => navigate('/'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const formatOrderId = (id: number) => {
    const hash = id * 314159;
    const p1 = 400 + (id % 100);
    const p2 = String(hash % 9999999).padStart(7, '0');
    const p3 = String((hash * 7) % 9999999).padStart(7, '0');
    return `${p1}-${p2}-${p3}`;
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (loading) return <div className="conf-loading">Loading...</div>;
  if (!order) return null;

  return (
    <div className="conf-page">
      <div className="conf-card">
        <div className="conf-check"><CheckCircle size={64} color="#007600" /></div>
        <h1 className="conf-title">Order Placed, Thanks!</h1>
        <p className="conf-sub">
          Confirmation will be sent to your account. Your estimated delivery date is shown below.
        </p>

        <div className="conf-order-id">
          <span className="oid-label">Order # </span>
          <span className="oid-value">{formatOrderId(order.id)}</span>
        </div>

        <div className="conf-details">
          <div className="conf-detail-row">
            <span className="cd-label">Order Status</span>
            <span className="cd-value status">{order.status}</span>
          </div>
          <div className="conf-detail-row">
            <span className="cd-label">Delivery Address</span>
            <span className="cd-value">{order.shippingAddress}</span>
          </div>
          <div className="conf-detail-row">
            <span className="cd-label">Payment Method</span>
            <span className="cd-value">Cash on Delivery</span>
          </div>
          <div className="conf-detail-row">
            <span className="cd-label">Estimated Delivery</span>
            <span className="cd-value delivery">
              {new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        <div className="conf-items">
          <h3>Ordered Items</h3>
          {order.items.map((item) => (
            <div key={item.id} className="conf-item">
              <img
                src={item.product.imageUrls[0]}
                alt={item.product.name}
                className="conf-item-img"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Product'; }}
              />
              <div className="conf-item-info">
                <p className="conf-item-name">{item.product.name}</p>
                <p className="conf-item-meta">Qty: {item.quantity} × {formatPrice(item.price)}</p>
              </div>
              <div className="conf-item-price">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
          <div className="conf-total">
            <span>Order Total:</span>
            <strong>{formatPrice(order.totalAmount)}</strong>
          </div>
        </div>

        <div className="conf-actions">
          <Link to="/orders" className="conf-btn-orders">View All Orders</Link>
          <Link to="/" className="conf-btn-home">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
