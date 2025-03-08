import { useWebsite } from '../context/WebsiteContext';

/**
 * A hook to easily access theme-based Tailwind CSS classes with consistent fallbacks
 *
 * @returns {Object} - Object with theme utility functions
 */
export const useTheme = () => {
  const { colorPalette } = useWebsite();

  /**
   * Gets a Tailwind CSS class with the appropriate color from the theme system
   *
   * @param {string} type - The Tailwind prefix (bg, text, border, etc.)
   * @param {string} path - The dot-notation path to the color in the colorPalette (e.g., 'primary.base')
   * @param {string} fallback - The fallback color to use if the path doesn't exist
   * @param {string} additionalClasses - Optional additional classes to include
   * @returns {string} - The complete class string
   */
  const getThemeClass = (type, path, fallback, additionalClasses = '') => {
    // Parse the path to get the value from the colorPalette
    const getValue = (obj, path) => {
      const keys = path.split('.');
      let result = obj;

      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key];
        } else {
          return undefined;
        }
      }

      return result;
    };

    const value = colorPalette ? getValue(colorPalette, path) : undefined;
    const baseClass = value ? `${type}-${value}` : `${type}-${fallback}`;

    return additionalClasses ? `${baseClass} ${additionalClasses}` : baseClass;
  };

  /**
   * Gets a background color class from the theme
   *
   * @param {string} path - The dot-notation path to the color (e.g., 'primary.base')
   * @param {string} fallback - The fallback color
   * @param {string} additionalClasses - Optional additional classes
   * @returns {string} - The complete class string
   */
  const bg = (path, fallback, additionalClasses) =>
    getThemeClass('bg', path, fallback, additionalClasses);

  /**
   * Gets a text color class from the theme
   *
   * @param {string} path - The dot-notation path to the color (e.g., 'text.primary')
   * @param {string} fallback - The fallback color
   * @param {string} additionalClasses - Optional additional classes
   * @returns {string} - The complete class string
   */
  const text = (path, fallback, additionalClasses) =>
    getThemeClass('text', path, fallback, additionalClasses);

  /**
   * Gets a border color class from the theme
   *
   * @param {string} path - The dot-notation path to the color (e.g., 'ui.border')
   * @param {string} fallback - The fallback color
   * @param {string} additionalClasses - Optional additional classes
   * @returns {string} - The complete class string
   */
  const border = (path, fallback, additionalClasses) =>
    getThemeClass('border', path, fallback, additionalClasses);

  /**
   * Gets a hover background color class from the theme
   *
   * @param {string} path - The dot-notation path to the color (e.g., 'primary.dark')
   * @param {string} fallback - The fallback color
   * @param {string} additionalClasses - Optional additional classes
   * @returns {string} - The complete class string
   */
  const hoverBg = (path, fallback, additionalClasses) =>
    getThemeClass('hover:bg', path, fallback, additionalClasses);

  /**
   * Gets a hover text color class from the theme
   *
   * @param {string} path - The dot-notation path to the color (e.g., 'primary.base')
   * @param {string} fallback - The fallback color
   * @param {string} additionalClasses - Optional additional classes
   * @returns {string} - The complete class string
   */
  const hoverText = (path, fallback, additionalClasses) =>
    getThemeClass('hover:text', path, fallback, additionalClasses);

  /**
   * Creates a complete set of classes for a button based on the theme
   *
   * @param {string} variant - The button variant ('primary', 'secondary', 'outline', 'text')
   * @param {string} additionalClasses - Optional additional classes
   * @returns {string} - The complete class string for the button
   */
  const button = (variant = 'primary', additionalClasses = '') => {
    const baseClasses = 'px-4 py-2 rounded transition-colors duration-200 font-medium';

    switch (variant) {
      case 'primary':
        return `${baseClasses} ${bg('primary.base', 'amber-600')} ${text('text.light', 'white')} ${hoverBg('primary.dark', 'amber-700')} ${additionalClasses}`;
      case 'secondary':
        return `${baseClasses} ${bg('secondary.base', 'amber-700')} ${text('text.light', 'white')} ${hoverBg('secondary.dark', 'amber-800')} ${additionalClasses}`;
      case 'outline':
        return `${baseClasses} bg-transparent ${border('primary.base', 'amber-600')} ${text('primary.base', 'amber-600')} ${hoverBg('primary.lightest', 'amber-50')} ${additionalClasses}`;
      case 'text':
        return `font-medium ${text('primary.base', 'amber-600')} ${hoverText('primary.dark', 'amber-700')} transition-colors duration-200 ${additionalClasses}`;
      default:
        return `${baseClasses} ${bg('primary.base', 'amber-600')} ${text('text.light', 'white')} ${hoverBg('primary.dark', 'amber-700')} ${additionalClasses}`;
    }
  };

  /**
   * Gets the raw colorPalette object
   *
   * @returns {Object|null} - The color palette object or null
   */
  const getPalette = () => colorPalette;

  return {
    bg,
    text,
    border,
    hoverBg,
    hoverText,
    button,
    getPalette,
    getThemeClass
  };
};
