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
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  // Calculate position for the dropdown menu
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      setMenuPosition({
        top: rect.bottom + scrollTop,
        left: position === 'right'
          ? rect.right - 170 + scrollLeft // width of dropdown minus some offset
          : rect.left + scrollLeft
      });
    }
  }, [isOpen, position]);

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
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
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  // Create dropdown portal component
  const DropdownMenu = () => {
    return ReactDOM.createPortal(
      <div
        ref={menuRef}
        className="fixed z-50 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
        style={{
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`
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
                setIsOpen(false);
              }}
              className={`group flex items-center w-full px-4 py-2 text-sm text-gray-700
                hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 ${action.className || ''}`}
              role="menuitem"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
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

      {isOpen && <DropdownMenu />}
    </div>
  );
};

export default EllipsisMenu;
