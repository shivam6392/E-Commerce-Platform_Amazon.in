import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await register({ name, email, password });
            loginUser(res.data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed.');
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
                <h1>Create Account</h1>
                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-form-group">
                        <label>Your name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="First and last name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-form-group">
                        <label>Mobile number or email</label>
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
                            placeholder="At least 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <div className="auth-info">
                            <i>i</i> Passwords must be at least 6 characters.
                        </div>
                    </div>

                    <button type="submit" className="auth-primary-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Create your Amazon account'}
                    </button>
                </form>

                <p className="auth-disclaimer">
                    By creating an account, you agree to Amazon's Conditions of Use and Privacy Notice.
                </p>

                <hr className="auth-hr" />

                <div className="auth-signin-link">
                    Already have an account? <Link to="/login">Sign-In ›</Link>
                </div>
            </div>

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

export default Register;
