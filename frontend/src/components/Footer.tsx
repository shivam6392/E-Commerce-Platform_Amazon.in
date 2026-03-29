import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            {/* Back to top */}
            <div className="footer-back-top" role="button" tabIndex={0} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} onKeyDown={(e) => e.key === 'Enter' && window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Back to top
            </div>

            {/* Main links */}
            <div className="footer-main">
                <div className="footer-col">
                    <h4>Get to Know Us</h4>
                    <ul>
                        <li><a href="#">About Amazon</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press Releases</a></li>
                        <li><a href="#">Amazon Science</a></li>
                        <li><a href="#">Amazon Cares</a></li>
                        <li><a href="#">Gift a Smile</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Connect with Us</h4>
                    <ul>
                        <li><a href="#" className="social-link"><span className="social-icon">📘</span> Facebook</a></li>
                        <li><a href="#" className="social-link"><span className="social-icon">🐦</span> Twitter</a></li>
                        <li><a href="#" className="social-link"><span className="social-icon">📸</span> Instagram</a></li>
                        <li><a href="#" className="social-link"><span className="social-icon">▶️</span> YouTube</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Make Money with Us</h4>
                    <ul>
                        <li><a href="#">Sell on Amazon</a></li>
                        <li><a href="#">Sell under Amazon Accelerator</a></li>
                        <li><a href="#">Protect and Build Your Brand</a></li>
                        <li><a href="#">Amazon Global Selling</a></li>
                        <li><a href="#">Become an Affiliate</a></li>
                        <li><a href="#">Fulfilment by Amazon</a></li>
                        <li><a href="#">Advertise Your Products</a></li>
                        <li><a href="#">Amazon Pay on Merchants</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Let Us Help You</h4>
                    <ul>
                        <li><Link to="/orders">Your Account</Link></li>
                        <li><Link to="/orders">Returns Centre</Link></li>
                        <li><a href="#">Recalls and Product Safety Alerts</a></li>
                        <li><a href="#">100% Purchase Protection</a></li>
                        <li><a href="#">Amazon App Download</a></li>
                        <li><a href="#">Help</a></li>
                    </ul>
                </div>
            </div>

            {/* Logo + Locale selectors */}
            <div className="footer-locale">
                <Link to="/" className="footer-logo" aria-label="Amazon Home">
                    <span className="fl-amazon">amazon</span>
                    <span className="fl-in">.in</span>
                </Link>
                <div className="locale-selectors">
                    <select className="locale-select" aria-label="Language">
                        <option>🌐 English</option>
                        <option>🌐 हिन्दी</option>
                    </select>
                    <select className="locale-select" aria-label="Country">
                        <option>🇮🇳 India</option>
                    </select>
                </div>
            </div>

            {/* Sub-brands */}
            <div className="footer-services">
                {[
                    { name: 'AbeBooks', desc: 'Books, art & collectibles' },
                    { name: 'Amazon Web Services', desc: 'Scalable Cloud Computing Services' },
                    { name: 'Audible', desc: 'Download Audio Books' },
                    { name: 'IMDb', desc: 'Movies, TV & Celebrities' },
                    { name: 'Amazon Prime Music', desc: '100 million songs, ad-free' },
                    { name: 'Amazon Business', desc: 'Everything For Your Business' },
                ].map((s) => (
                    <div key={s.name} className="footer-service">
                        <a href="#" className="fs-name">{s.name}</a>
                        <span className="fs-desc">{s.desc}</span>
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
                <div className="fb-links">
                    <a href="#">Conditions of Use &amp; Sale</a>
                    <a href="#">Privacy Notice</a>
                    <a href="#">Interest-Based Ads</a>
                    <a href="#">Cookie Notice</a>
                </div>
                <p className="fb-copy">© 1996-2026, Amazon.com, Inc. or its affiliates</p>
            </div>
        </footer>
    );
};

export default Footer;
