import { useTheme } from '../hooks/useTheme';

/**
 * A collection of commonly used UI component styles based on the theme
 *
 * @returns {Object} - Object with common UI component class strings
 */
export const useCommonStyles = () => {
  const theme = useTheme();

  return {
    // Card styles
    card: {
      container: `${theme.bg('ui.background', 'white')} shadow rounded-lg overflow-hidden`,
      header: `p-4 border-b ${theme.border('ui.border', 'gray-200')}`,
      body: `p-4`,
      footer: `p-4 border-t ${theme.border('ui.border', 'gray-200')}`
    },

    // Typography styles
    typography: {
      h1: `text-3xl font-bold ${theme.text('text.primary', 'gray-900')}`,
      h2: `text-2xl font-bold ${theme.text('text.primary', 'gray-900')}`,
      h3: `text-xl font-bold ${theme.text('text.primary', 'gray-900')}`,
      h4: `text-lg font-bold ${theme.text('text.primary', 'gray-900')}`,
      body: `${theme.text('text.secondary', 'gray-600')}`,
      caption: `text-sm ${theme.text('text.tertiary', 'gray-500')}`
    },

    // Form elements
    form: {
      label: `block mb-2 ${theme.text('text.secondary', 'gray-600')}`,
      input: `w-full p-2 border ${theme.border('ui.border', 'gray-300')} rounded focus:ring-2 ${theme.bg('ui.background', 'white')} focus:ring-${theme.getPalette()?.primary?.base || 'amber-500'} focus:outline-none`,
      select: `w-full p-2 border ${theme.border('ui.border', 'gray-300')} rounded focus:ring-2 ${theme.bg('ui.background', 'white')} focus:ring-${theme.getPalette()?.primary?.base || 'amber-500'} focus:outline-none`,
      textarea: `w-full p-2 border ${theme.border('ui.border', 'gray-300')} rounded focus:ring-2 ${theme.bg('ui.background', 'white')} focus:ring-${theme.getPalette()?.primary?.base || 'amber-500'} focus:outline-none`,
      error: `mt-1 text-sm text-red-600`
    },

    // Button variants (using the theme.button function)
    button: {
      primary: theme.button('primary'),
      secondary: theme.button('secondary'),
      outline: theme.button('outline'),
      text: theme.button('text'),
      // Sized variants
      sm: (variant = 'primary') => theme.button(variant, 'px-3 py-1 text-sm'),
      lg: (variant = 'primary') => theme.button(variant, 'px-6 py-3 text-lg')
    },

    // Modal styles
    modal: {
      overlay: `fixed inset-0 ${theme.bg('ui.overlay', 'gray-800/75')} flex items-center justify-center z-50`,
      container: `${theme.bg('ui.background', 'white')} shadow-xl rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden`,
      header: `flex items-center justify-between border-b ${theme.border('ui.border', 'gray-200')} p-4`,
      title: `text-xl font-semibold ${theme.text('text.primary', 'gray-900')}`,
      closeButton: `${theme.text('text.secondary', 'gray-500')} ${theme.hoverText('text.primary', 'gray-700')} transition-colors duration-200 p-1 rounded ${theme.hoverBg('ui.hover', 'gray-100')}`,
      body: `p-6 overflow-auto`,
      footer: `border-t ${theme.border('ui.border', 'gray-200')} p-4 flex justify-end space-x-2`
    },

    // Table styles
    table: {
      container: `w-full ${theme.border('ui.border', 'gray-200')} border-collapse ${theme.bg('ui.background', 'white')} shadow rounded-lg overflow-hidden`,
      header: `${theme.bg('ui.lightBackground', 'gray-50')} ${theme.border('ui.border', 'gray-200')} border-b`,
      headerCell: `px-4 py-3 text-left font-medium ${theme.text('text.primary', 'gray-900')}`,
      row: `border-b ${theme.border('ui.border', 'gray-200')} ${theme.hoverBg('ui.hover', 'gray-50')}`,
      cell: `px-4 py-3 ${theme.text('text.secondary', 'gray-600')}`
    },

    // Navigation
    nav: {
      link: `${theme.text('text.secondary', 'gray-600')} ${theme.hoverText('primary.base', 'amber-600')} transition-colors duration-200`,
      activeLink: `${theme.text('primary.base', 'amber-600')} font-medium`
    }
  };
};
