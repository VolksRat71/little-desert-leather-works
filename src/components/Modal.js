import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import ReactDOM from 'react-dom';
import { useCommonStyles } from './common';

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
  const styles = useCommonStyles();

  return (
    <div
      ref={modalRef}
      className={`modal-content ${styles.modal.container} ${isAnimating ? 'modal-active' : 'modal-inactive'}`}
      onClick={(e) => e.stopPropagation()}
      tabIndex="-1" // Make div focusable but not in tab order
    >
      <div className={styles.modal.header}>
        <h3 id="modal-title" className={styles.modal.title}>{title}</h3>
        <button
          onClick={onClose}
          className={styles.modal.closeButton}
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div className={`${styles.modal.body} modal-content-scrollable`}>
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
  const styles = useCommonStyles();

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

        // Compensate for the missing scrollbar to avoid layout shift
        if (hasScrollbarRef.current) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        // Trigger animation after a brief delay
        setTimeout(() => {
          setIsAnimating(true);
        }, 10);
      });
    } else if (!isOpen && isVisible) {
      // Start closing animation
      setIsAnimating(false);

      // After animation is complete, remove modal from DOM
      setTimeout(() => {
        setIsVisible(false);

        // Restore body scroll
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.paddingRight = '';

        // Restore scroll position
        window.scrollTo(0, scrollPositionRef.current);
      }, 300);
    }

    return () => {
      if (scrollLockTimer) {
        cancelAnimationFrame(scrollLockTimer);
      }
    };
  }, [isOpen, isVisible]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscapeKey);
      // Prevent scroll on wheel events to avoid scrolling content behind the modal
      window.addEventListener('wheel', preventWheelScroll, { passive: false });
    }

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('wheel', preventWheelScroll);
    };
  }, [isOpen, onClose, preventWheelScroll]);

  // Only render the modal if it should be visible
  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      className={styles.modal.overlay}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
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
    </div>,
    document.body
  );
};

export default Modal;
