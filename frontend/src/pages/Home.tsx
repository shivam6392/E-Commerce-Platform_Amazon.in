import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X, TrendingUp, Zap } from 'lucide-react';
import { getProducts } from '../api';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import './Home.css';

/* ── Constants ── */
const CATEGORIES = [
  { id: 'All', label: 'All Departments', icon: '🏪' },
  { id: 'Electronics', label: 'Electronics', icon: '💻' },
  { id: 'Clothing', label: 'Clothing & Fashion', icon: '👗' },
  { id: 'Books', label: 'Books', icon: '📚' },
  { id: 'Home & Kitchen', label: 'Home & Kitchen', icon: '🏠' },
  { id: 'Sports', label: 'Sports & Outdoors', icon: '⚽' },
  { id: 'Toys', label: 'Toys & Games', icon: '🎮' },
];

const HERO_SLIDES = [
  {
    bg: 'linear-gradient(120deg,#0f2027,#203a43,#2c5364)',
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 40% off on Laptops, Phones, TVs & More',
    badge: '🔥 Today\'s Deal',
    accent: '#ff9900',
    cat: 'Electronics',
    img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  },
  {
    bg: 'linear-gradient(120deg,#1a3a1a,#1e5128,#145a32)',
    title: 'Fashion Week Specials',
    subtitle: 'Discover latest trends · Min. 35% off',
    badge: '✨ New Arrivals',
    accent: '#a8ff78',
    cat: 'Clothing',
    img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  },
  {
    bg: 'linear-gradient(120deg,#3a0000,#7b1a1a,#a83232)',
    title: 'Home Makeover Sale',
    subtitle: 'Top quality Kitchen & Home essentials',
    badge: '🏠 Home Picks',
    accent: '#ffcc80',
    cat: 'Home & Kitchen',
    img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  },
  {
    bg: 'linear-gradient(120deg,#1a0050,#360099,#5900cc)',
    title: 'Best Sellers in Books',
    subtitle: 'Bestselling titles · Starting ₹99',
    badge: '📖 Reading List',
    accent: '#c084fc',
    cat: 'Books',
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80',
  },
];

const CATEGORY_CARDS = [
  {
    title: 'Revamp your home in style',
    items: [
      { label: 'Cushion covers', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&q=80' },
      { label: 'Figurines & vases', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=160&q=80' },
      { label: 'Home storage', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=160&q=80' },
      { label: 'Lighting', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=160&q=80' },
    ],
    link: '/?category=Home%20%26%20Kitchen',
    linkText: 'Explore all',
  },
  {
    title: 'Up to 55% off | Appliances',
    items: [
      { label: 'Air conditioners', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=160&q=80' },
      { label: 'Refrigerators', img: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=160&q=80' },
      { label: 'Microwaves', img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=160&q=80' },
      { label: 'Washing machines', img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=160&q=80' },
    ],
    link: '/?category=Electronics',
    linkText: 'See more',
  },
  {
    title: 'Best Sellers in Sports',
    items: [
      { label: 'Dumbbells', img: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=160&q=80' },
      { label: 'Yoga mats', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=160&q=80' },
      { label: 'Running shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&q=80' },
      { label: 'Cycles', img: 'https://images.unsplash.com/photo-1558981852-426c349d1bb7?w=160&q=80' },
    ],
    link: '/?category=Sports',
    linkText: 'See all',
  },
  {
    title: 'Books & Stationery',
    items: [
      { label: 'Bestsellers', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=160&q=80' },
      { label: 'Children\'s books', img: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=160&q=80' },
      { label: 'Notebooks', img: 'https://images.unsplash.com/photo-1531346680769-a1d79b57de5?w=160&q=80' },
      { label: 'Pens & markers', img: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=160&q=80' },
    ],
    link: '/?category=Books',
    linkText: 'Explore all',
  },
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
];

/* ── Hero Slider ── */
const HeroSlider: React.FC<{ onShop: (cat: string) => void }> = ({ onShop }) => {
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setSlide(idx);
    setTimeout(() => setAnimating(false), 500);
  };
  const next = () => goTo((slide + 1) % HERO_SLIDES.length);
  const prev = () => goTo((slide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [slide]);

  const s = HERO_SLIDES[slide];

  return (
    <section className="hero-slider" style={{ background: s.bg }}>
      <button className="hero-arrow left" onClick={prev} aria-label="Previous"><ChevronLeft size={32} /></button>

      <div className={`hero-slide-content ${animating ? 'fade' : 'visible'}`}>
        <div className="hero-slide-text">
          <span className="hs-badge">{s.badge}</span>
          <h1 className="hs-title">{s.title}</h1>
          <p className="hs-sub">{s.subtitle}</p>
          <div className="hs-ctas">
            <button className="hs-btn-primary" style={{ background: s.accent }} onClick={() => onShop(s.cat)}>
              Shop Now
            </button>
            <button className="hs-btn-secondary" onClick={() => onShop('All')}>View All Deals</button>
          </div>
        </div>
        <div className="hero-slide-img">
          <img src={s.img} alt={s.title}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      </div>

      <button className="hero-arrow right" onClick={next} aria-label="Next"><ChevronRight size={32} /></button>

      <div className="hero-bullets">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} className={`hero-bullet ${i === slide ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
};

/* ── Category Cards ── */
const CategoryCards: React.FC = () => (
  <section className="cat-cards-section">
    <div className="cat-cards-grid">
      {CATEGORY_CARDS.map((card) => (
        <div key={card.title} className="cat-card">
          <h3 className="cat-card-title">{card.title}</h3>
          <div className="cat-card-grid">
            {card.items.map((item) => (
              <Link key={item.label} to={card.link} className="cat-card-item">
                <img src={item.img} alt={item.label}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/160x160/f5f5f5/aaa?text=' + encodeURIComponent(item.label); }} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <Link to={card.link} className="cat-card-link">{card.linkText}</Link>
        </div>
      ))}
    </div>
  </section>
);

/* ── Product Carousel ── */
const ProductCarousel: React.FC<{
  title: string;
  seeAllLink: string;
  products: Product[];
}> = ({ title, seeAllLink, products }) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const scrollAmount = Math.min(el.clientWidth * 0.8, 800);
    el.scrollBy({ left: dir === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        <Link to={seeAllLink} className="carousel-see-all">See all offers</Link>
      </div>
      <div className="carousel-wrap">
        <button className="carousel-nav left" onClick={() => scroll('left')} aria-label="Scroll left"><ChevronLeft size={22} /></button>
        <div className="carousel-track" ref={trackRef}>
          {products.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="carousel-item">
              <div className="ci-img-wrap">
                <img
                  src={p.imageUrls[0]}
                  alt={p.name}
                  className="ci-img"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/f5f5f5/aaa?text=Product'; }}
                />
              </div>
              <p className="ci-name">{p.name}</p>
              <p className="ci-price">₹{p.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              <p className="ci-discount"><span className="ci-disc-badge">-20%</span> M.R.P. <s>₹{(p.price * 1.2).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</s></p>
            </Link>
          ))}
        </div>
        <button className="carousel-nav right" onClick={() => scroll('right')} aria-label="Scroll right"><ChevronRight size={22} /></button>
      </div>
    </section>
  );
};

/* ── Main Home ── */
const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'All';
    setActiveCategory(category);
    setLocalSearch(search);
    fetchProducts(search, category);
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];
    if (localSearch) result = result.filter(p => p.name.toLowerCase().includes(localSearch.toLowerCase()) || p.description.toLowerCase().includes(localSearch.toLowerCase()));
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1] && p.rating >= minRating);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'newest') result.sort((a, b) => b.id - a.id);
    setFiltered(result);
  }, [products, localSearch, sortBy, priceRange, minRating]);

  const fetchProducts = async (search: string, category: string) => {
    setLoading(true);
    try {
      const res = await getProducts({ search: search || undefined, category: category === 'All' ? undefined : category });
      setProducts(res.data);
    } catch { /* show empty */ } finally { setLoading(false); }
  };

  const handleCategoryClick = (cat: string) => {
    const params: any = {};
    if (cat !== 'All') params.category = cat;
    if (localSearch) params.search = localSearch;
    setSearchParams(params);
    setSidebarOpen(false);
  };

  const clearSearch = () => {
    setLocalSearch('');
    const params: any = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    setSearchParams(params);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: any = {};
    if (localSearch) params.search = localSearch;
    if (activeCategory !== 'All') params.category = activeCategory;
    setSearchParams(params);
  };

  const isHomepage = !searchParams.get('search') && !searchParams.get('category');
  const electronics = products.filter(p => p.category === 'Electronics');
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 10);
  const clothing = products.filter(p => p.category === 'Clothing');
  const homeK = products.filter(p => p.category === 'Home & Kitchen');

  return (
    <div className="home-page">
      {/* Homepage-only sections */}
      {isHomepage && (
        <>
          <HeroSlider onShop={(cat) => handleCategoryClick(cat)} />
          <CategoryCards />

          {/* Carousels */}
          {!loading && (
            <>
              {electronics.length > 0 && (
                <ProductCarousel title="Up to 40% Off Electronics" seeAllLink="/?category=Electronics" products={electronics} />
              )}
              {topRated.length > 0 && (
                <ProductCarousel title="🔥 Trending & Must-Haves" seeAllLink="/" products={topRated} />
              )}
              {clothing.length > 0 && (
                <ProductCarousel title="Best Sellers in Clothing" seeAllLink="/?category=Clothing" products={clothing} />
              )}
              {homeK.length > 0 && (
                <ProductCarousel title="Home & Kitchen Products" seeAllLink="/?category=Home%20%26%20Kitchen" products={homeK} />
              )}
            </>
          )}

          {/* Divider before grid */}
          <div className="section-divider">
            <span>All Products</span>
          </div>
        </>
      )}

      {/* ── Controls bar ── */}
      <div className="listing-controls">
        <form className="listing-search" onSubmit={handleSearchSubmit}>
          <Search size={16} className="ls-icon" />
          <input type="text" className="ls-input" placeholder="Search products..." value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} />
          {localSearch && <button type="button" className="ls-clear" onClick={clearSearch}><X size={14} /></button>}
          <button type="submit" className="ls-btn">Search</button>
        </form>
        <div className="listing-right-controls">
          <button className="filter-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <SlidersHorizontal size={14} /> Filters
          </button>
          <div className="sort-wrapper">
            <span className="sort-label">Sort:</span>
            <div className="sort-select-wrapper">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <span className="result-count">{loading ? '…' : <><strong>{filtered.length}</strong> results</>}</span>
        </div>
      </div>

      {/* ── Listing body ── */}
      <div className="listing-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <span>Refine Results</span>
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}><X size={14} /></button>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Department</h3>
            <ul className="cat-list">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button className={`cat-item ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => handleCategoryClick(cat.id)}>
                    <span className="cat-icon">{cat.icon}</span>
                    <span className="cat-label">{cat.label}</span>
                    {activeCategory === cat.id && <span className="cat-check">✓</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Avg. Customer Review</h3>
            <div className="rating-filters">
              {[4, 3, 2, 1].map((r) => (
                <button key={r} className={`rating-filter-btn ${minRating === r ? 'active' : ''}`} onClick={() => setMinRating(minRating === r ? 0 : r)}>
                  {'★'.repeat(r)}{'☆'.repeat(5 - r)} & Up
                </button>
              ))}
            </div>
          </div>
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Price Range</h3>
            <div className="price-quick-filters">
              {([[0, 1000, 'Under ₹1,000'], [1000, 5000, '₹1K – ₹5K'], [5000, 25000, '₹5K – ₹25K'], [25000, 200000, 'Over ₹25,000']] as [number, number, string][]).map(([min, max, label]) => (
                <button key={label} className={`price-filter-btn ${priceRange[0] === min && priceRange[1] === max ? 'active' : ''}`}
                  onClick={() => priceRange[0] === min && priceRange[1] === max ? setPriceRange([0, 200000]) : setPriceRange([min, max])}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button className="reset-filters-btn" onClick={() => { setPriceRange([0, 200000]); setMinRating(0); handleCategoryClick('All'); }}>
            Clear All Filters
          </button>
        </aside>
        {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

        <main className="products-main">
          {/* Active chips */}
          <div className="active-filters">
            {activeCategory !== 'All' && <span className="filter-chip">{activeCategory}<button onClick={() => handleCategoryClick('All')}><X size={11} /></button></span>}
            {localSearch && <span className="filter-chip">"{localSearch}"<button onClick={clearSearch}><X size={11} /></button></span>}
            {minRating > 0 && <span className="filter-chip">{minRating}★ & Up<button onClick={() => setMinRating(0)}><X size={11} /></button></span>}
            {(priceRange[0] !== 0 || priceRange[1] !== 200000) && <span className="filter-chip">₹{priceRange[0].toLocaleString('en-IN')}–₹{priceRange[1].toLocaleString('en-IN')}<button onClick={() => setPriceRange([0, 200000])}><X size={11} /></button></span>}
          </div>

          {!loading && (
            <div className="section-title-row">
              {localSearch ? <><TrendingUp size={16} /><h2>Results for "<em>{localSearch}</em>"</h2></> :
                activeCategory !== 'All' ? <><Zap size={16} /><h2>{CATEGORIES.find(c => c.id === activeCategory)?.label}</h2></> :
                  <><TrendingUp size={16} /><h2>All Products</h2></>}
            </div>
          )}

          {loading ? (
            <div className="products-grid">{Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h2>No results found</h2>
              <p>Try adjusting your search or remove filters</p>
              <button className="no-results-btn" onClick={() => { clearSearch(); handleCategoryClick('All'); setMinRating(0); setPriceRange([0, 200000]); }}>Browse All Products</button>
            </div>
          ) : (
            <div className="products-grid">{filtered.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </main>
      </div>
    </div>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="skeleton-card">
    <div className="sk-img" />
    <div className="sk-body">
      <div className="sk-line" style={{ width: '90%' }} />
      <div className="sk-line" style={{ width: '60%' }} />
      <div className="sk-line" style={{ width: '40%', height: '20px', marginTop: '8px' }} />
      <div className="sk-line" style={{ width: '100%', height: '32px', marginTop: '12px', borderRadius: '16px' }} />
    </div>
  </div>
);

export default Home;
