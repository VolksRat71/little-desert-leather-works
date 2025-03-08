import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebsite } from '../../context/WebsiteContext';
import { users } from '../../api/users/placeholder';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, currentUser, error } = useAuth();
  const { colorPalette } = useWebsite();
  const navigate = useNavigate();

  // Get button styling from colorPalette or use defaults
  const bgClass = colorPalette?.primary?.base ? `bg-${colorPalette.primary.base}` : 'bg-amber-600';
  const bgHoverClass = colorPalette?.primary?.dark ? `hover:bg-${colorPalette.primary.dark}` : 'hover:bg-amber-700';

  // Redirect if already signed in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email) {
      setFormError('Email is required');
      return;
    }

    // For demo, we don't care about password
    setIsSubmitting(true);
    try {
      await signIn(email, password || 'password-doesnt-matter');
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Sign In</h2>

        {formError && <div className="auth-error">{formError}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter any password (not validated)"
            />
            <small className="form-hint">
              For demo purposes, any password will work for existing users.
            </small>
          </div>

          <button
            type="submit"
            className={`${bgClass} text-white px-6 py-3 rounded-md ${bgHoverClass} transition-all duration-300 transform hover:-translate-y-1 w-full font-serif ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-placeholder-users">
          <h3>Demo Users</h3>
          <p>Click on an email to autofill:</p>
          <div className="placeholder-users-list">
            {users.map(user => (
              <button
                key={user.id}
                className="placeholder-user-btn"
                onClick={() => setEmail(user.email)}
              >
                {user.email} ({user.role})
              </button>
            ))}
          </div>
        </div>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
