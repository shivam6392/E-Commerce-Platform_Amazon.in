import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, StarHalf, ShoppingCart, Heart, Eye, CheckCircle } from 'lucide-react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

interface ProductCardProps {
    product: Product;
}

export const StarRating: React.FC<{ rating: number; count: number; compact?: boolean }> = ({
    rating,
    count,
    compact = false,
}) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
        <div className={`star-rating ${compact ? 'compact' : ''}`}>
            {Array.from({ length: fullStars }).map((_, i) => (
                <Star key={`f${i}`} size={compact ? 12 : 14} className="star-full" />
            ))}
            {hasHalf && <StarHalf size={compact ? 12 : 14} className="star-full" />}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <Star key={`e${i}`} size={compact ? 12 : 14} className="star-empty" />
            ))}
            {!compact && <span className="rating-count">({count.toLocaleString('en-IN')})</span>}
        </div>
    );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addItem, loading } = useCart();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [added, setAdded] = useState(false);

    const wishlisted = isWishlisted(product.id);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (added || loading) return;
        await addItem(product.id);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        await toggleWishlist(product.id);
    };

    const price = product.price;
    const originalPrice = Math.round(price * 1.2);
    const discount = 20;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const isOutOfStock = product.stock === 0;

    const formatINR = (n: number) =>
        new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

    return (
        <Link to={`/product/${product.id}`} className="pcard" tabIndex={0}>
            {/* Image Section */}
            <div className="pcard-img-wrap">
                <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="pcard-img"
                    loading="lazy"
                    onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://placehold.co/300x300/f5f5f5/aaa?text=${encodeURIComponent(product.category)}`;
                    }}
                />

                {/* Badges */}
                <div className="pcard-badges">
                    {discount > 0 && !isOutOfStock && (
                        <span className="badge badge-discount">-{discount}%</span>
                    )}
                    {isLowStock && !isOutOfStock && (
                        <span className="badge badge-stock">Only {product.stock} left!</span>
                    )}
                    {isOutOfStock && <span className="badge badge-oos">Out of Stock</span>}
                    {product.rating >= 4.7 && !isOutOfStock && (
                        <span className="badge badge-top"><Star size={12} fill="#ff9900" color="#ff9900" /> Top Rated</span>
                    )}
                </div>

                {/* Quick Actions Overlay */}
                <div className="pcard-overlay">
                    <button
                        className={`overlay-btn wishlist ${wishlisted ? 'active' : ''}`}
                        onClick={handleWishlist}
                        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                        <Heart size={16} fill={wishlisted ? '#e53935' : 'none'} />
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="overlay-btn"
                        onClick={(e) => e.stopPropagation()}
                        title="Quick View"
                    >
                        <Eye size={16} />
                    </Link>
                </div>
            </div>

            {/* Card Body */}
            <div className="pcard-body">
                <p className="pcard-category">{product.category}</p>
                <p className="pcard-name">{product.name}</p>

                <StarRating rating={product.rating} count={product.reviewCount} />

                {/* Price Block */}
                <div className="pcard-price-block">
                    <div className="pcard-price-row">
                        <span className="pcard-currency">₹</span>
                        <span className="pcard-price">{formatINR(price)}</span>
                    </div>
                    <div className="pcard-price-meta">
                        <span className="pcard-original">M.R.P. ₹{formatINR(originalPrice)}</span>
                        <span className="pcard-discount">{discount}% off</span>
                    </div>
                </div>

                {/* Delivery */}
                <p className="pcard-delivery">
                    <span className="del-free">FREE</span> delivery Tomorrow
                </p>

                {/* Add to Cart Button */}
                <button
                    className={`pcard-atc ${added ? 'added' : ''} ${isOutOfStock ? 'disabled' : ''}`}
                    onClick={handleAddToCart}
                    disabled={loading || isOutOfStock}
                >
                    {isOutOfStock ? (
                        'Out of Stock'
                    ) : added ? (
                        <><CheckCircle size={14} /> Added to Cart</>
                    ) : (
                        <><ShoppingCart size={14} /> Add to Cart</>
                    )}
                </button>
            </div>
        </Link>
    );
};

export default ProductCard;
