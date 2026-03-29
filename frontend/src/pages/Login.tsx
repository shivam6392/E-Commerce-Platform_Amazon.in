import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login({ email, password });
            loginUser(res.data);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <Link to="/" className="auth-logo">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" />
            </Link>

            <div className="auth-card">
                <h1>Sign in</h1>
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-form-group">
                        <label>Email or mobile phone number</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-primary-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Continue'}
                    </button>
                </form>

                <p className="auth-disclaimer">
                    By continuing, you agree to Amazon's Conditions of Use and Privacy Notice.
                </p>

                <div className="auth-help">
                    <Link to="#">Need help?</Link>
                </div>
            </div>

            <div className="auth-divider">
                <h5>New to Amazon?</h5>
            </div>

            <Link to="/register" className="auth-secondary-btn">
                Create your Amazon account
            </Link>

            <div className="auth-footer">
                <div className="auth-footer-links">
                    <Link to="#">Conditions of Use</Link>
                    <Link to="#">Privacy Notice</Link>
                    <Link to="#">Help</Link>
                </div>
                <p>© 1996-2024, Amazon.com, Inc. or its affiliates</p>
            </div>
        </div>
    );
};

export default Login;
