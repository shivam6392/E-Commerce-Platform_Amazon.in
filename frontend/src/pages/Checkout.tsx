import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api';
import './Checkout.css';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: 'Default User',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) errs.phone = 'Valid 10-digit phone required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state.trim()) errs.state = 'State is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) errs.pincode = 'Valid 6-digit pincode required';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const address = `${form.fullName}, ${form.address}, ${form.city}, ${form.state} - ${form.pincode}, ${form.country}. Ph: ${form.phone}`;
      const res = await placeOrder(address);
      await refreshCart();
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      console.error('Order failed', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-heading">Checkout</h1>
      <div className="checkout-body">
        {/* Shipping Form */}
        <div className="checkout-form-section">
          <div className="checkout-section-card">
            <h2 className="section-num">1</h2>
            <div className="section-content">
              <h3>Delivery Address</h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" />
                    {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit phone" maxLength={10} />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </div>
                <div className="form-group full">
                  <label>Street Address</label>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="House No., Building, Street, Area" />
                  {errors.address && <span className="form-error">{errors.address}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
                    {errors.city && <span className="form-error">{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input name="state" value={form.state} onChange={handleChange} placeholder="State" />
                    {errors.state && <span className="form-error">{errors.state}</span>}
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" maxLength={6} />
                    {errors.pincode && <span className="form-error">{errors.pincode}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input name="country" value={form.country} readOnly />
                </div>

                {/* Payment (display only) */}
                <div className="checkout-section-card" style={{ marginTop: 20 }}>
                  <h2 className="section-num">2</h2>
                  <div className="section-content">
                    <h3>Payment Method</h3>
                    <div className="payment-option selected">
                      <input type="radio" checked readOnly /> Cash on Delivery (Pay on delivery)
                    </div>
                    <p className="payment-note">No payment needed now. Pay when your order arrives.</p>
                  </div>
                </div>

                <div className="checkout-section-card" style={{ marginTop: 20 }}>
                  <h2 className="section-num">3</h2>
                  <div className="section-content">
                    <h3>Review Items</h3>
                    {cart.items.map((item) => (
                      <div key={item.id} className="review-item">
                        <img src={item.product.imageUrls[0]} alt={item.product.name} className="review-img" />
                        <div className="review-info">
                          <p className="review-name">{item.product.name}</p>
                          <p className="review-qty">Qty: {item.quantity}</p>
                          <p className="review-price">{formatPrice(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="place-order-btn" disabled={submitting}>
                  {submitting ? '⏳ Placing Order...' : `Place your order  (${formatPrice(cart.totalAmount)})`}
                </button>
                <p className="order-notice">
                  By placing your order, you agree to Amazon's privacy notice and conditions of use.
                  Your order total is <strong>{formatPrice(cart.totalAmount)}</strong> (inclusive of GST).
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <div className="summary-card">
            <button className="place-order-btn" onClick={handleSubmit as any} disabled={submitting}>
              {submitting ? '⏳ Placing...' : 'Place your order'}
            </button>
            <p className="summary-agree">By placing your order, you agree to <span>Amazon's conditions of use</span>.</p>
            <hr />
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-line">
              <span>Items ({cart.items.reduce((s, i) => s + i.quantity, 0)}):</span>
              <span>{formatPrice(cart.totalAmount)}</span>
            </div>
            <div className="summary-line">
              <span>Delivery:</span>
              <span className="free-text">FREE</span>
            </div>
            <hr />
            <div className="summary-line total">
              <span>Order Total:</span>
              <span>{formatPrice(cart.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
