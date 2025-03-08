import React from 'react';
import { useCommonStyles } from './common';

/**
 * Button component that uses the theme system for consistent styling
 *
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant ('primary', 'secondary', 'outline', 'text')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ButtonHTMLAttributes} props.rest - Other button attributes
 * @returns {React.Component} - Themed button component
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}) => {
  const { button } = useCommonStyles();

  let buttonClass = '';

  // Get base button style by variant
  switch (variant) {
    case 'primary':
      buttonClass = button.primary;
      break;
    case 'secondary':
      buttonClass = button.secondary;
      break;
    case 'outline':
      buttonClass = button.outline;
      break;
    case 'text':
      buttonClass = button.text;
      break;
    default:
      buttonClass = button.primary;
  }

  // Apply size-specific styles
  switch (size) {
    case 'sm':
      buttonClass = button.sm(variant);
      break;
    case 'lg':
      buttonClass = button.lg(variant);
      break;
    default:
      // 'md' size is the default from the button classes
      break;
  }

  // Apply full width if needed
  if (fullWidth) {
    buttonClass += ' w-full';
  }

  // Merge with additional classes
  buttonClass = `${buttonClass} ${className}`;

  return (
    <button className={buttonClass} {...rest}>
      {children}
    </button>
  );
};

export default Button;
