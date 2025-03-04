import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWebsite } from '../../context/WebsiteContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    marketingPreferences: {
      emailOffers: false,
      textOffers: false,
      orderUpdates: true
    }
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp, currentUser, error } = useAuth();
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('marketing.')) {
      const prefName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        marketingPreferences: {
          ...prev.marketingPreferences,
          [prefName]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setFormError('Name, email, and password are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Remove confirmPassword from the data we send to the API
      const { confirmPassword, ...userData } = formData;

      // In a real app, signUp would communicate with the backend
      // For now, it's just using mockup data and simulating a response
      await signUp(userData);
      navigate('/dashboard');
    } catch (err) {
      setFormError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Create Account</h2>

        {formError && <div className="auth-error">{formError}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Confirm your password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone (optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (optional)</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Enter your address"
            />
          </div>

          <div className="form-group">
            <label>Marketing Preferences</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="marketing.emailOffers"
                  checked={formData.marketingPreferences.emailOffers}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                Receive email offers and promotions
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="marketing.textOffers"
                  checked={formData.marketingPreferences.textOffers}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                Receive text message offers
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="marketing.orderUpdates"
                  checked={formData.marketingPreferences.orderUpdates}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                Receive order status updates
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`${bgClass} text-white px-6 py-3 rounded-md ${bgHoverClass} transition-all duration-300 transform hover:-translate-y-1 w-full font-serif ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>

        <div className="auth-note">
          <p>
            <strong>Note:</strong> This is a demo site. Registration is simulated
            and no real account will be created.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
