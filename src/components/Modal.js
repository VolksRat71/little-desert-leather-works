import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
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

// Memoized modal content to prevent rerenders
const ModalContent = memo(({ title, children, onClose, modalRef, isAnimating }) => {
  return (
    <div
      ref={modalRef}
      className={`modal-content bg-white shadow-xl ${isAnimating ? 'modal-active' : 'modal-inactive'}`}
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
  );
});

ModalContent.displayName = 'ModalContent';

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const scrollPositionRef = useRef(0);
  const hasScrollbarRef = useRef(false);

  // Stable event handler reference
  const preventWheelScroll = useCallback((e) => {
    // Only if we're not over the modal content (which may have its own scrollable areas)
    if (!e.target.closest('.modal-content')) {
      e.preventDefault();
      return false;
    }
  }, []);

  // Focus trap management
  useEffect(() => {
    if (isOpen && isVisible && modalRef.current) {
      // Store the element that had focus before opening the modal
      previousFocusRef.current = document.activeElement;

      // Focus the modal container
      modalRef.current.focus();

      // Focus trap function
      const handleTabKey = (e) => {
        if (e.key !== 'Tab' || !modalRef.current) return;

        // Get all focusable elements
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

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
  }, [isOpen, isVisible]);

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

  // Handle scrollbar and body class when modal opens/closes
  useEffect(() => {
    let scrollLockTimer;

    if (isOpen && !isVisible) {
      // Store current scroll position and scrollbar presence before any DOM changes
      scrollPositionRef.current = window.pageYOffset;
      hasScrollbarRef.current = document.body.scrollHeight > window.innerHeight;

      // Determine the scrollbar width
      const scrollbarWidth = hasScrollbarRef.current ? getScrollbarWidth() : 0;

      // Set a CSS variable for the scrollbar width
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

      // First make the modal visible
      setIsVisible(true);

      // Then in the next frame, apply scroll locking to avoid flashing
      scrollLockTimer = requestAnimationFrame(() => {
        // Prevent body from scrolling but maintain its position
        document.body.style.top = `-${scrollPositionRef.current}px`;
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        document.body.style.overflowY = 'scroll'; // Always show scrollbar to prevent layout shift

        // Add modal-open class for additional styling
        document.body.classList.add('modal-open');
        document.documentElement.classList.add('modal-open');

        // And after a slight delay, start the animation
        setTimeout(() => setIsAnimating(true), 10);
      });

      // Add wheel event listeners to prevent background scrolling
      window.addEventListener('wheel', preventWheelScroll, { passive: false });
      window.addEventListener('touchmove', preventWheelScroll, { passive: false });

      // Add ESC key handler
      const handleEscKey = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscKey);

      return () => {
        cancelAnimationFrame(scrollLockTimer);
        window.removeEventListener('keydown', handleEscKey);
        window.removeEventListener('wheel', preventWheelScroll);
        window.removeEventListener('touchmove', preventWheelScroll);
      };
    } else if (!isOpen && isVisible) {
      // When closing, first stop the animation
      setIsAnimating(false);

      // Wait for animation to finish before removing from DOM
      const timer = setTimeout(() => {
        // First clean up the scroll lock to avoid jank when modal is closing
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflowY = '';

        // Remove wheel event listeners
        window.removeEventListener('wheel', preventWheelScroll);
        window.removeEventListener('touchmove', preventWheelScroll);

        // Restore scroll position
        window.scrollTo(0, scrollPositionRef.current);

        // Remove modal-open classes
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
        document.documentElement.style.removeProperty('--scrollbar-width');

        // Finally, remove the modal from the DOM
        setIsVisible(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, preventWheelScroll, isVisible]);

  // Ensure body class is removed when component unmounts
  useEffect(() => {
    return () => {
      window.removeEventListener('wheel', preventWheelScroll);
      window.removeEventListener('touchmove', preventWheelScroll);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
      document.documentElement.style.removeProperty('--scrollbar-width');

      // Restore scroll position on unmount if needed
      if (document.body.style.position === 'fixed') {
        window.scrollTo(0, scrollPositionRef.current);
      }
    };
  }, [preventWheelScroll]);

  if (!isVisible) return null;

  // Create the modal content
  const modalContent = (
    <div
      className={`modal-overlay ${isAnimating ? 'modal-overlay-active' : 'modal-overlay-inactive'}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <ModalContent
        title={title}
        onClose={onClose}
        modalRef={modalRef}
        isAnimating={isAnimating}
      >
        {children}
      </ModalContent>
    </div>
  );

  // Use ReactDOM.createPortal to render the modal at the root of the document
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default Modal;
