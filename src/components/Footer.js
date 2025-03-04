import React from 'react';
import { Link } from 'react-router-dom';
import { useWebsite, colorPalette } from '../context/WebsiteContext';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Logo } from '../App';

const Footer = () => {
  const { navigate, contactInfo } = useWebsite();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-${colorPalette.ui.darkBackground} text-${colorPalette.text.lightest} py-12 text-sm`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand and description */}
          <div>
            <div className="mb-4">
              <Logo size="md" className={`text-${colorPalette.primary.base}`} />
            </div>
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
            <h3 className={`font-bold text-lg mb-4 text-${colorPalette.primary.base}`}>Quick Links</h3>
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
            <h3 className={`font-bold text-lg mb-4 text-${colorPalette.primary.base}`}>Contact Us</h3>
            <address className="not-italic">
              {contactInfo.showAddress && contactInfo.address.split('\n').map((line, index) => (
                <p className="mb-2" key={index}>{line}</p>
              ))}
              <p className="mb-2">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
                >
                  {contactInfo.email}
                </a>
              </p>
              {contactInfo.showPhone && (
                <p>
                  <a
                    href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`}
                    className={`text-${colorPalette.text.light} hover:text-${colorPalette.primary.lightest} transition-colors duration-300`}
                  >
                    {contactInfo.phone}
                  </a>
                </p>
              )}
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
