import React from 'react';
import { Link } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Logo } from '../App';
import { useTheme } from '../hooks/useTheme';

const Footer = () => {
  const { navigate, contactInfo } = useWebsite();
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${theme.bg('ui.darkBackground', 'gray-900')} ${theme.text('text.lightest', 'gray-100')} py-12 text-sm`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and description */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size="md" className={theme.text('primary.base', 'amber-600')} />
            </div>
            <p className="mb-4">
              Handcrafted leather goods made with care and attention to detail. Every piece tells a story of craftsmanship and dedication.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://instagram.com" theme={theme}>
                <FaInstagram size={24} />
              </SocialLink>
              <SocialLink href="https://twitter.com" theme={theme}>
                <FaTwitter size={24} />
              </SocialLink>
              <SocialLink href="https://facebook.com" theme={theme}>
                <FaFacebook size={24} />
              </SocialLink>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-1">
            <h3 className={`font-bold text-lg mb-4 ${theme.text('primary.base', 'amber-600')}`}>Quick Links</h3>
            <ul className="space-y-2">
              <NavLink to="/" navigate={navigate} theme={theme}>Home</NavLink>
              <NavLink to="/products" navigate={navigate} theme={theme}>Products</NavLink>
              <NavLink to="/about" navigate={navigate} theme={theme}>About</NavLink>
              <NavLink to="/contact" navigate={navigate} theme={theme}>Contact</NavLink>
            </ul>
          </div>

          {/* Contact info */}
          <div className="md:col-span-1">
            <h3 className={`font-bold text-lg mb-4 ${theme.text('primary.base', 'amber-600')}`}>Contact Us</h3>
            <address className="not-italic">
              {contactInfo?.showAddress && contactInfo?.address?.split('\n').map((line, index) => (
                <p className="mb-2" key={index}>{line}</p>
              ))}
              {contactInfo?.email && (
                <p className="mb-2">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className={`${theme.text('text.light', 'white')} ${theme.hoverText('primary.lightest', 'amber-200')} transition-colors duration-300`}
                  >
                    {contactInfo.email}
                  </a>
                </p>
              )}
              {contactInfo?.showPhone && contactInfo?.phone && (
                <p>
                  <a
                    href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`}
                    className={`${theme.text('text.light', 'white')} ${theme.hoverText('primary.lightest', 'amber-200')} transition-colors duration-300`}
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

// Helper components to reduce repetition
const SocialLink = ({ href, theme, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`${theme.text('text.light', 'white')} ${theme.hoverText('primary.lightest', 'amber-200')} transition-colors duration-300`}
  >
    {children}
  </a>
);

const NavLink = ({ to, navigate, theme, children }) => (
  <li>
    <Link
      to={to}
      className={`${theme.text('text.light', 'white')} ${theme.hoverText('primary.lightest', 'amber-200')} transition-colors duration-300`}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </Link>
  </li>
);

export default Footer;
