import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import './Wishlist.css';

const Wishlist: React.FC = () => {
    const { user } = useAuth();
    const { addItem } = useCart();
    const { wishlistItems, loading, removeItem } = useWishlist();
    const navigate = useNavigate();

    // Redirect if not logged in
    if (!user) {
        navigate('/login', { state: { from: { pathname: '/wishlist' } } });
        return null;
    }

    const handleMoveToCart = async (productId: number, wishlistItemId: number) => {
        try {
            await addItem(productId);
            await removeItem(wishlistItemId);
        } catch (err) {
            console.error('Failed to move to cart', err);
        }
    };

    if (loading) return <div className="wishlist-loading">Loading your wishlist...</div>;

    return (
        <div className="wishlist-page">
            <div className="wishlist-header">
                <h1>Your Wish List</h1>
                <p>{wishlistItems.length} items</p>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="wishlist-empty">
                    <Heart size={80} color="#ff9900" style={{ opacity: 0.3 }} />
                    <h2>Your wishlist is empty</h2>
                    <p>Save items that you want to buy later.</p>
                    <Link to="/" className="continue-btn">Continue Shopping</Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="wishlist-card">
                            <img
                                src={item.product.imageUrls[0]}
                                alt={item.product.name}
                                onClick={() => navigate(`/product/${item.product.id}`)}
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = 'https://placehold.co/200x200/f5f5f5/aaa?text=Product';
                                }}
                            />
                            <div className="wishlist-details">
                                <h3 onClick={() => navigate(`/product/${item.product.id}`)}>
                                    {item.product.name}
                                </h3>
                                <div className="wishlist-price">₹{item.product.price.toLocaleString('en-IN')}</div>
                                <div className="wishlist-stock">
                                    {item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </div>
                                <div className="wishlist-actions">
                                    <button
                                        className="move-to-cart-btn"
                                        onClick={() => handleMoveToCart(item.product.id, item.id)}
                                        disabled={item.product.stock === 0}
                                    >
                                        <ShoppingCart size={16} /> Add to Cart
                                    </button>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
