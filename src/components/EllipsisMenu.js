import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

/**
 * EllipsisMenu - A reusable dropdown menu component triggered by an ellipsis icon
 *
 * @param {Object[]} actions - Array of action objects with label and onClick
 * @param {string} actions[].label - The text to display for the action
 * @param {function} actions[].onClick - Function to call when the action is clicked
 * @param {string} actions[].className - Optional CSS class for styling the action
 * @param {string} className - Optional CSS class for the container
 * @param {string} position - Position of the dropdown ('right' or 'left'), defaults to 'right'
 * @returns {JSX.Element} The ellipsis menu component
 */
const EllipsisMenu = ({ actions, className = '', position = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationState, setAnimationState] = useState('closed'); // 'closed', 'opening', 'open', 'closing'
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Update menu position based on button position
  const updateMenuPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      // Viewport-relative coordinates
      const viewportTop = rect.bottom;
      const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

      // Determine horizontal position based on available space
      let leftPosition;
      if (position === 'right') {
        leftPosition = Math.min(rect.right - 170, viewportWidth - 190); // Prevent overflow
      } else {
        leftPosition = Math.max(rect.left, 10); // Ensure some minimal distance from left edge
      }

      setMenuPosition({
        top: viewportTop,
        left: leftPosition
      });
    }
  };

  // Calculate initial position for the dropdown menu
  useEffect(() => {
    if (isOpen || isAnimating) {
      updateMenuPosition();
    }
  }, [isOpen, isAnimating, position]);

  // Add scroll event listener to update position on scroll
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', updateMenuPosition, { passive: true });
      window.addEventListener('resize', updateMenuPosition, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', updateMenuPosition);
      window.removeEventListener('resize', updateMenuPosition);
    };
  }, [isOpen]);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key to close the menu
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  // Handle opening and closing with animation
  const openMenu = () => {
    setIsAnimating(true);
    setAnimationState('opening');
    setIsOpen(true);

    // After the opening animation completes, update the state
    setTimeout(() => {
      setAnimationState('open');
    }, 200); // Animation duration of 200ms
  };

  const closeMenu = () => {
    setIsAnimating(true);
    setAnimationState('closing');

    // Allow the closing animation to play out
    setTimeout(() => {
      setIsOpen(false);
      setAnimationState('closed');

      // Keep animation state for a bit longer to ensure the animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 200); // Animation duration of 200ms
  };

  const toggleMenu = () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Get animation styles based on current animation state
  const getAnimationStyles = () => {
    switch (animationState) {
      case 'opening':
        return {
          opacity: 0,
          transform: 'scale(0.8) translateY(-20px)',
          animation: 'ellipsis-menu-in 200ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards'
        };
      case 'open':
        return {
          opacity: 1,
          transform: 'scale(1) translateY(0)'
        };
      case 'closing':
        return {
          opacity: 1,
          transform: 'scale(1) translateY(0)',
          animation: 'ellipsis-menu-out 200ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards'
        };
      case 'closed':
      default:
        return {
          opacity: 0,
          transform: 'scale(0.8) translateY(-20px)'
        };
    }
  };

  // Create dropdown portal component
  const DropdownMenu = () => {
    return ReactDOM.createPortal(
      <>
        {/* Animation keyframes */}
        <style>
          {`
            @keyframes ellipsis-menu-in {
              0% {
                opacity: 0;
                transform: scale(0.8) translateY(-20px);
              }
              100% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }

            @keyframes ellipsis-menu-out {
              0% {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
              100% {
                opacity: 0;
                transform: scale(0.8) translateY(-20px);
              }
            }
          `}
        </style>
        <div
          ref={menuRef}
          className="fixed z-50 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            ...getAnimationStyles()
          }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  closeMenu();
                }}
                className={`group flex items-center w-full px-4 py-2 text-sm text-gray-700
                  hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ${action.className || ''}`}
                role="menuitem"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </>,
      document.body
    );
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
        aria-label="More options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {(isOpen || isAnimating) && <DropdownMenu />}
    </div>
  );
};

export default EllipsisMenu;
