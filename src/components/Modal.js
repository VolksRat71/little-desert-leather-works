import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';

// Function to calculate scrollbar width
const getScrollbarWidth = () => {
  // Create a temporary div to measure scrollbar width
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  // Create inner div
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculate the width difference
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  // Clean up
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
};

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Focus trap management
  useEffect(() => {
    if (isOpen && isVisible && isAnimating) {
      // Store the element that had focus before opening the modal
      previousFocusRef.current = document.activeElement;

      // Focus the modal container
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Focus trap function
      const handleTabKey = (e) => {
        if (e.key !== 'Tab' || !modalRef.current) return;

        // Get all focusable elements
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If shift+tab and on first element, move to last element
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
        // If tab and on last element, move to first element
        else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      };

      // Add event listener for tab key
      window.addEventListener('keydown', handleTabKey);

      return () => {
        window.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen, isVisible, isAnimating]);

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && previousFocusRef.current) {
      setTimeout(() => {
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      }, 300);
    }
  }, [isOpen]);

  // The rest of your existing effects (scrollbar, body class, etc)
  useEffect(() => {
    if (isOpen) {
      // First, apply the class to prevent layout shift
      const scrollbarWidth = getScrollbarWidth();
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

      // Apply classes immediately to prevent flicker
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');

      // Then make the modal visible
      setIsVisible(true);

      // Small delay to ensure the animation triggers after the component is rendered
      setTimeout(() => setIsAnimating(true), 10);

      // Add ESC key handler
      const handleEscKey = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscKey);

      return () => {
        window.removeEventListener('keydown', handleEscKey);
      };
    } else {
      setIsAnimating(false);

      // Wait for animation to finish before removing from DOM
      const timer = setTimeout(() => {
        setIsVisible(false);

        // Remove class from body and html when modal is closed
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        document.documentElement.style.removeProperty('--scrollbar-width');
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  // Ensure body class is removed when component unmounts
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      document.documentElement.style.removeProperty('--scrollbar-width');
    };
  }, []);

  if (!isVisible && !isOpen) return null;

  // Create the modal content
  const modalContent = (
    <div
      className="modal-overlay"
      style={{
        opacity: isAnimating ? 1 : 0,
        backgroundColor: `rgba(0,0,0,${isAnimating ? 0.5 : 0})`,
        transition: 'opacity 300ms, background-color 300ms'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="modal-content bg-white shadow-xl w-full max-w-2xl"
        style={{
          transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
          opacity: isAnimating ? 1 : 0,
          transition: 'transform 300ms, opacity 300ms'
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex="-1" // Make div focusable but not in tab order
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 id="modal-title" className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded hover:bg-gray-100"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="p-6 modal-content-scrollable">
          {children}
        </div>
      </div>
    </div>
  );

  // Use ReactDOM.createPortal to render the modal at the root of the document
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default Modal;
