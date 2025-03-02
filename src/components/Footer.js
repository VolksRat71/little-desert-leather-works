import React from 'react';
import { Link } from 'react-router-dom';
import { useWebsite, colorPalette } from '../context/WebsiteContext';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  const { navigate } = useWebsite();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-${colorPalette.ui.darkBackground} text-${colorPalette.text.lightest} py-12`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and description */}
          <div>
            <h3 className={`font-bold text-xl mb-4 text-${colorPalette.primary.base}`}>Little Desert Leather Works</h3>
            <p className="mb-4">
              Handcrafted leather goods made with care and attention to detail. Every piece tells a story of craftsmanship and dedication.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
              >
                <FaFacebook size={24} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className={`font-bold text-xl mb-4 text-${colorPalette.primary.base}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                  }}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/about');
                  }}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/contact');
                  }}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className={`font-bold text-xl mb-4 text-${colorPalette.primary.base}`}>Contact Us</h3>
            <address className="not-italic">
              <p className="mb-2">123 Desert Lane</p>
              <p className="mb-2">Sedona, AZ 12345</p>
              <p className="mb-2">
                <a
                  href="mailto:info@littledesertleather.com"
                  className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
                >
                  info@littledesertleather.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+15551234567"
                  className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
                >
                  (555) 123-4567
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; {currentYear} Little Desert Leather Works. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
