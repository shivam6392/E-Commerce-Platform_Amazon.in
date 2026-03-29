import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { StarRating } from '../components/ProductCard';
import {
  ShoppingCart, Zap, ChevronLeft, ChevronRight,
  Package2, RotateCcw, Shield, Truck, Tag,
  Heart, Share2, CheckCircle, AlertTriangle,
  ChevronDown, ChevronUp, MapPin
} from 'lucide-react';
import './ProductDetail.css';

const SPECS_MAP: Record<string, string[][]> = {
  Electronics: [
    ['Brand', 'TechPro'],
    ['Model Year', '2024'],
    ['Form Factor', 'Standard'],
    ['Connectivity', 'Bluetooth, Wi-Fi, USB-C'],
    ['Battery Life', 'Up to 18 hours'],
    ['Warranty', '1 Year Manufacturer'],
  ],
  Clothing: [
    ['Brand', 'StyleCo'],
    ['Material', '100% Cotton'],
    ['Fit Type', 'Regular Fit'],
    ['Care Instructions', 'Machine Washable'],
    ['Country of Origin', 'India'],
    ['Warranty', '30-Day Returns'],
  ],
  Books: [
    ['Publisher', 'Penguin Random House'],
    ['Language', 'English'],
    ['Format', 'Paperback'],
    ['Pages', '320'],
    ['ISBN-10', '0-000-00000-0'],
    ['Country of Origin', 'India'],
  ],
  default: [
    ['Brand', 'Premium Brand'],
    ['Model', '2024 Edition'],
    ['Country of Origin', 'India'],
    ['Warranty', '1 Year'],
    ['Return Policy', '30 Days Easy Returns'],
    ['In the Box', '1 Unit, User Manual, Warranty Card'],
  ],
};

const getSpecs = (category: string) => SPECS_MAP[category] || SPECS_MAP['default'];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, loading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartState, setCartState] = useState<'idle' | 'adding' | 'added'>('idle');
  const [wishlisted, setWishlisted] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);
  const deliveryDate = new Date(Date.now() + 86400000).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  useEffect(() => {
    setActiveImg(0);
    setCartState('idle');
    if (id) {
      getProduct(Number(id))
        .then((res) => setProduct(res.data))
        .catch(() => navigate('/'));
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (cartState !== 'idle') return;
    setCartState('adding');
    await addItem(product!.id, quantity);
    setCartState('added');
    setTimeout(() => setCartState('idle'), 2000);
  };

  const handleBuyNow = async () => {
    await addItem(product!.id, quantity);
    navigate('/cart');
  };

  const nextImg = () => setActiveImg((i) => (i + 1) % product!.imageUrls.length);
  const prevImg = () => setActiveImg((i) => (i - 1 + product!.imageUrls.length) % product!.imageUrls.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

  if (!product) return <ProductDetailSkeleton />;

  const price = product.price;
  const originalPrice = Math.round(price * 1.2);
  const savings = originalPrice - price;
  const discount = 20;
  const specs = getSpecs(product.category);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="pd-page">
      {/* ── Breadcrumb ── */}
      <nav className="pd-breadcrumb">
        <Link to="/">Home</Link>
        <span className="bc-sep">›</span>
        <Link to={`/?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
        <span className="bc-sep">›</span>
        <span className="bc-current">{product.name.length > 50 ? product.name.slice(0, 50) + '…' : product.name}</span>
      </nav>

      {/* ── Main Card ── */}
      <div className="pd-card">
        {/* ═══ LEFT: Image Gallery ═══ */}
        <aside className="pd-gallery">
          {/* Thumbnails */}
          <div className="pd-thumbs">
            {product.imageUrls.map((url, i) => (
              <button
                key={i}
                className={`pd-thumb ${i === activeImg ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
                aria-label={`Image ${i + 1}`}
              >
                <img
                  src={url}
                  alt=""
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/f5f5f5/aaa?text=img'; }}
                />
              </button>
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div className="pd-main-img-wrap">
            {product.imageUrls.length > 1 && (
              <button className="pd-nav prev" onClick={prevImg} aria-label="Previous image">
                <ChevronLeft size={20} />
              </button>
            )}

            <div
              className={`pd-main-img-box ${zoom ? 'zoomed' : ''}`}
              ref={imgRef}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.imageUrls[activeImg]}
                alt={product.name}
                className="pd-main-img"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/500x500/f5f5f5/aaa?text=Product'; }}
                style={zoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: 'scale(2)' } : {}}
                draggable={false}
              />
              {!zoom && (
                <div className="zoom-hint">🔍 Hover to zoom</div>
              )}
            </div>

            {product.imageUrls.length > 1 && (
              <button className="pd-nav next" onClick={nextImg} aria-label="Next image">
                <ChevronRight size={20} />
              </button>
            )}

            {/* Dot indicators */}
            {product.imageUrls.length > 1 && (
              <div className="pd-dots">
                {product.imageUrls.map((_, i) => (
                  <button
                    key={i}
                    className={`pd-dot ${i === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Share + Wishlist under gallery */}
          <div className="pd-gallery-actions">
            <button
              className={`pd-ga-btn ${wishlisted ? 'wishlisted' : ''}`}
              onClick={() => setWishlisted((w) => !w)}
            >
              <Heart size={16} fill={wishlisted ? '#e53935' : 'none'} />
              {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button className="pd-ga-btn" onClick={() => navigator.share?.({ title: product.name, url: window.location.href }).catch(() => { })}>
              <Share2 size={16} />
              Share
            </button>
          </div>
        </aside>

        {/* ═══ CENTER: Product Info ═══ */}
        <div className="pd-info">
          {/* Brand + Title */}
          <p className="pd-brand">
            Brand: <Link to={`/?search=${product.category}`} className="brand-link">Premium Brand</Link>
          </p>
          <h1 className="pd-title">{product.name}</h1>

          {/* Rating Row */}
          <div className="pd-rating-row">
            <StarRating rating={product.rating} count={product.reviewCount} />
            <span className="pd-rating-num">{product.rating.toFixed(1)} out of 5</span>
            <span className="pd-sep">|</span>
            <span className="pd-review-link">{product.reviewCount.toLocaleString('en-IN')} ratings</span>
          </div>

          {/* Deal badge */}
          <div className="pd-deal-badge">
            <Tag size={14} /> Deal of the Day
          </div>

          <hr className="pd-hr" />

          {/* Price */}
          <div className="pd-price-section">
            <div className="pd-mrp">
              M.R.P.: <span className="pd-mrp-val">₹{formatINR(originalPrice)}</span>
            </div>
            <div className="pd-price-row">
              <span className="pd-price-curr">₹</span>
              <span className="pd-price-main">{formatINR(price)}</span>
              <span className="pd-price-badge">Save {discount}%</span>
            </div>
            <div className="pd-savings">
              You Save: <strong>₹{formatINR(savings)}</strong> ({discount}% off)
            </div>
            <div className="pd-tax-note">Inclusive of all taxes. FREE Delivery on eligible orders.</div>

            {/* EMI offer */}
            {price > 5000 && (
              <div className="pd-emi-offer">
                <span className="emi-icon">💳</span>
                No Cost EMI available from ₹{formatINR(Math.round(price / 12))}/month
              </div>
            )}
          </div>

          <hr className="pd-hr" />

          {/* Stock Status */}
          <div className={`pd-stock-badge ${isOutOfStock ? 'oos' : isLowStock ? 'low' : 'in'}`}>
            {isOutOfStock ? (
              <><AlertTriangle size={16} /> Out of Stock</>
            ) : isLowStock ? (
              <><AlertTriangle size={16} /> Only {product.stock} left in stock – order soon</>
            ) : (
              <><CheckCircle size={16} /> In Stock</>
            )}
          </div>

          {/* Delivery Info */}
          {!isOutOfStock && (
            <div className="pd-delivery">
              <div className="pd-del-row">
                <Truck size={16} className="del-icon" />
                <span><strong className="free-del">FREE Delivery</strong> {deliveryDate}</span>
              </div>
              <div className="pd-del-row">
                <MapPin size={16} className="del-icon" />
                <span>Delivering to <strong>India</strong> · <span className="del-change">Change</span></span>
              </div>
              <div className="pd-del-row">
                <RotateCcw size={16} className="del-icon" />
                <span>Free 30-day returns & exchanges</span>
              </div>
            </div>
          )}

          <hr className="pd-hr" />

          {/* About This Item (collapsible) */}
          <div className="pd-about">
            <h3 className="pd-section-title">About this item</h3>
            <div className={`pd-desc ${descExpanded ? 'expanded' : ''}`}>
              <p>{product.description}</p>
              {/* Feature bullets derived from description */}
              <ul className="pd-bullets">
                {product.description.split('.').filter(s => s.trim().length > 10).slice(0, 4).map((sentence, i) => (
                  <li key={i}>{sentence.trim()}.</li>
                ))}
              </ul>
            </div>
            <button
              className="pd-expand-btn"
              onClick={() => setDescExpanded((e) => !e)}
            >
              {descExpanded ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> Read more</>}
            </button>
          </div>

          <hr className="pd-hr" />

          {/* Tech Specs Table */}
          <div className="pd-specs">
            <h3 className="pd-section-title">Technical Details</h3>
            <table className="specs-table">
              <tbody>
                <tr><td className="spec-key">Category</td><td>{product.category}</td></tr>
                <tr><td className="spec-key">Customer Rating</td><td>{product.rating} out of 5 ({product.reviewCount.toLocaleString('en-IN')} ratings)</td></tr>
                <tr><td className="spec-key">Stock Available</td><td className={isOutOfStock ? 'oos-text' : 'in-text'}>{isOutOfStock ? 'Out of Stock' : `${product.stock} units`}</td></tr>
                {getSpecs(product.category).map(([k, v]) => (
                  <tr key={k}><td className="spec-key">{k}</td><td>{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rating Breakdown */}
          <hr className="pd-hr" />
          <div className="pd-rating-breakdown">
            <h3 className="pd-section-title">Customer Reviews</h3>
            <div className="rb-summary">
              <div className="rb-big">{product.rating.toFixed(1)}</div>
              <div>
                <StarRating rating={product.rating} count={product.reviewCount} />
                <div className="rb-label">{product.reviewCount.toLocaleString('en-IN')} global ratings</div>
              </div>
            </div>
            {[5, 4, 3, 2, 1].map((star) => {
              const fakePercent = star === Math.round(product.rating)
                ? 48 : star === Math.round(product.rating) - 1
                  ? 26 : star === 5
                    ? Math.round(product.rating * 8)
                    : Math.max(2, Math.round((product.rating - star + 1) * 4));
              return (
                <div key={star} className="rb-row">
                  <span className="rb-star">{star} star</span>
                  <div className="rb-bar-bg">
                    <div className="rb-bar-fill" style={{ width: `${Math.min(fakePercent, 95)}%` }} />
                  </div>
                  <span className="rb-pct">{Math.min(fakePercent, 95)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══ RIGHT: Buy Box ═══ */}
        <aside className="pd-buy-box">
          <div className="bb-inner">
            {/* Price */}
            <div className="bb-price-curr">₹</div>
            <div className="bb-price">{formatINR(price)}</div>
            <div className="bb-save">Save ₹{formatINR(savings)} ({discount}%)</div>

            {/* Delivery */}
            <div className="bb-delivery">
              <span className="bb-free">FREE Delivery</span> {deliveryDate}
            </div>

            {/* Stock */}
            <div className={`bb-stock ${isOutOfStock ? 'oos' : 'in'}`}>
              {isOutOfStock ? 'Currently unavailable' : 'In Stock'}
            </div>

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="bb-qty">
                <label className="bb-qty-label">Quantity:</label>
                <div className="bb-qty-controls">
                  <button
                    className="bb-qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >−</button>
                  <span className="bb-qty-val">{quantity}</span>
                  <button
                    className="bb-qty-btn"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                  >+</button>
                </div>
              </div>
            )}

            {/* Cart success message */}
            {cartState === 'added' && (
              <div className="bb-added">✅ Added to Cart!</div>
            )}

            {/* Action Buttons */}
            <button
              className={`bb-atc ${cartState === 'added' ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={loading || isOutOfStock || cartState === 'adding'}
            >
              <ShoppingCart size={16} />
              {cartState === 'adding' ? 'Adding…' : cartState === 'added' ? '✔ Added to Cart' : 'Add to Cart'}
            </button>

            <button
              className="bb-buy-now"
              onClick={handleBuyNow}
              disabled={loading || isOutOfStock}
            >
              <Zap size={16} />
              Buy Now
            </button>

            {/* Trust badges */}
            <div className="bb-trust">
              <div className="bb-trust-item"><Shield size={14} /> <span>Secure transaction</span></div>
              <div className="bb-trust-item"><Package2 size={14} /> <span>Ships from Amazon</span></div>
              <div className="bb-trust-item"><RotateCcw size={14} /> <span>30-day returns eligible</span></div>
            </div>

            <hr className="bb-hr" />

            {/* Share + Wishlist */}
            <div className="bb-links">
              <button
                className={`bb-link ${wishlisted ? 'active' : ''}`}
                onClick={() => setWishlisted((w) => !w)}
              >
                <Heart size={14} fill={wishlisted ? '#e53935' : 'none'} />
                {wishlisted ? 'Wishlisted' : 'Add to Wish List'}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* ── Skeleton Loading ── */
const ProductDetailSkeleton: React.FC = () => (
  <div className="pd-page">
    <div className="pd-breadcrumb skeleton-text" style={{ width: 300, height: 14 }} />
    <div className="pd-card skeleton-layout">
      <div className="sk-gallery">
        <div className="sk-thumbs">
          {[1, 2, 3].map((i) => <div key={i} className="sk-thumb shimmer" />)}
        </div>
        <div className="sk-main-img shimmer" />
      </div>
      <div className="sk-info">
        {[95, 70, 40, 60, 30, 80, 50].map((w, i) => (
          <div key={i} className="sk-line shimmer" style={{ width: `${w}%`, height: i === 0 ? 28 : i === 2 ? 36 : 14 }} />
        ))}
      </div>
      <div className="sk-buybox shimmer" />
    </div>
  </div>
);

export default ProductDetail;
