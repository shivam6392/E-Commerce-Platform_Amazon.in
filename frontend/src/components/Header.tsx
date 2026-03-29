import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, MapPin, Globe, ChevronDown, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';


const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports', 'Toys'];
const NAV_ITEMS = [
    { label: 'All', path: '/' },
    { label: 'Fresh', path: '/?category=Fresh' },
    { label: 'Amazon Pay', path: '/' },
    { label: 'Gift Cards', path: '/' },
    { label: 'Buy Again', path: '/orders' },
    { label: 'Electronics', path: '/?category=Electronics' },
    { label: 'Home & Kitchen', path: '/?category=Home%20%26%20Kitchen' },
    { label: 'Sports', path: '/?category=Sports' },
    { label: 'Books', path: '/?category=Books' },
    { label: 'Clothing', path: '/?category=Clothing' },
    { label: 'Toys', path: '/?category=Toys' },
];

interface HeaderProps {
    onSearch?: (query: string, category: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    const { cartCount } = useCart();
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sticky, setSticky] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => setSticky(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery, selectedCategory);
        } else {
            const params = new URLSearchParams();
            if (searchQuery) params.set('search', searchQuery);
            if (selectedCategory !== 'All') params.set('category', selectedCategory);
            navigate(`/?${params.toString()}`);
        }
    };

    return (
        <header className="header">
            {/* ── Top Bar ── */}
            <div className="header-top">
                {/* Logo */}
                <Link to="/" className="header-logo" aria-label="Amazon Home">
                    <div className="logo-text-wrapper">
                        <div className="logo-text">amazon</div>
                        <div className="logo-in">.in</div>
                    </div>
                    <div className="logo-smile">
                        <svg viewBox="0 0 100 18" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 5 Q50 20 95 5" stroke="#ff9900" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <polygon points="87,2 95,5 89,10" fill="#ff9900" />
                        </svg>
                    </div>
                </Link>

                {/* Deliver To */}
                <div className="header-deliver">
                    <MapPin size={14} className="deliver-pin" />
                    <div className="deliver-text">
                        <div className="deliver-label">Deliver to</div>
                        <div className="deliver-location">India <ChevronDown size={10} /></div>
                    </div>
                </div>

                {/* Search Bar */}
                <form className={`header-search ${mobileSearch ? 'mobile-open' : ''}`} onSubmit={handleSearch}>
                    <select
                        className="search-category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        aria-label="Category"
                    >
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <div className="search-divider" />
                    <input
                        ref={searchRef}
                        type="text"
                        className="search-input"
                        placeholder="Search Amazon.in"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search"
                    />
                    {searchQuery && (
                        <button type="button" className="search-clear" onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}>
                            <X size={14} />
                        </button>
                    )}
                    <button type="submit" className="search-btn" aria-label="Search">
                        <Search size={20} />
                    </button>
                </form>

                {/* Right section */}
                <div className="header-right">
                    {/* Language */}
                    <div className="header-lang">
                        <Globe size={16} />
                        <span className="lang-text">EN</span>
                        <ChevronDown size={12} />
                    </div>

                    {/* Account */}
                    <div className="header-account" onClick={() => !user && navigate('/login')}>
                        <div className="header-label">Hello, {user ? user.name.split(' ')[0] : 'Sign in'}</div>
                        <div className="header-value">
                            Account &amp; Lists <ChevronDown size={12} />
                        </div>
                        {user && (
                            <div className="account-dropdown">
                                <Link to="/orders">Your Orders</Link>
                                <Link to="/wishlist">Your Wish List</Link>
                                <button onClick={logoutUser} className="logout-btn">Sign Out</button>
                            </div>
                        )}
                    </div>


                    {/* Orders */}
                    <Link to="/orders" className="header-orders">
                        <div className="header-label">Returns</div>
                        <div className="header-value">&amp; Orders</div>
                    </Link>

                    {/* Cart */}
                    <Link to="/cart" className="header-cart" aria-label={`Cart with ${cartCount} items`}>
                        <div className="cart-icon-wrap">
                            <ShoppingCart size={30} />
                            {cartCount > 0 && <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>}
                        </div>
                        <span className="cart-label">Cart</span>
                    </Link>
                </div>

                {/* Mobile search toggle */}
                <button className="mobile-search-btn" onClick={() => { setMobileSearch((v) => !v); setTimeout(() => searchRef.current?.focus(), 100); }}>
                    <Search size={22} />
                </button>
            </div>

            {/* ── Secondary Navigation ── */}
            <nav className={`header-nav ${sticky ? 'sticky-nav' : ''}`}>
                <div className="nav-inner">
                    {NAV_ITEMS.map((item) => (
                        <Link key={item.label} to={item.path} className="nav-item">
                            {item.label}
                        </Link>
                    ))}
                    <div className="nav-promo">
                        <span className="promo-badge">Prime</span>
                        <span className="promo-text">Try 30 days FREE</span>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
