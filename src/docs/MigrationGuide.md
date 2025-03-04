# Theme System Migration Guide

This guide helps you migrate existing components to the new theme system for Little Desert Leather Works.

## Before & After Example

### Before:

```jsx
import React from 'react';
import { useWebsite } from '../context/WebsiteContext';

const MyComponent = () => {
  const { colorPalette } = useWebsite();

  // Inconsistent fallbacks and access patterns
  const bgClass = colorPalette ? `bg-${colorPalette.primary.base}` : 'bg-amber-600';
  const textClass = colorPalette?.text?.primary ? `text-${colorPalette.text.primary}` : 'text-gray-900';

  return (
    <div className={`${bgClass} p-4 rounded-lg`}>
      <h2 className={`${textClass} text-xl font-bold`}>Hello World</h2>
      <button className={`px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700`}>
        Click Me
      </button>
    </div>
  );
};
```

### After:

```jsx
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import Button from '../components/Button';
import { useCommonStyles } from '../components/common';

const MyComponent = () => {
  const theme = useTheme();
  const styles = useCommonStyles();

  return (
    <div className={`${theme.bg('primary.base', 'amber-600')} p-4 rounded-lg`}>
      <h2 className={`${styles.typography.h2} mb-4`}>Hello World</h2>
      <Button variant="primary">Click Me</Button>
    </div>
  );
};
```

## Migration Steps

1. **Add new imports**:
   ```jsx
   import { useTheme } from '../hooks/useTheme';
   import { useCommonStyles } from '../components/common';
   ```

2. **Replace useWebsite for theme access**:
   ```jsx
   // Before
   const { colorPalette } = useWebsite();

   // After
   const theme = useTheme();
   const styles = useCommonStyles(); // If using common UI components
   ```

3. **Replace color classes**:
   | Before | After |
   |--------|-------|
   | `bg-${colorPalette?.primary?.base || 'amber-600'}` | `${theme.bg('primary.base', 'amber-600')}` |
   | `text-${colorPalette?.text?.primary || 'gray-900'}` | `${theme.text('text.primary', 'gray-900')}` |
   | `border-${colorPalette?.ui?.border || 'gray-200'}` | `${theme.border('ui.border', 'gray-200')}` |
   | `hover:bg-${colorPalette?.primary?.hover || 'amber-700'}` | `${theme.hoverBg('primary.hover', 'amber-700')}` |

4. **Replace buttons with the Button component**:
   ```jsx
   // Before
   <button className={`px-4 py-2 bg-${colorPalette?.primary?.base || 'amber-600'} text-white rounded hover:bg-${colorPalette?.primary?.hover || 'amber-700'}`}>
     Click Me
   </button>

   // After
   <Button variant="primary">Click Me</Button>
   ```

5. **Use common UI component styles**:
   ```jsx
   // Before
   <div className="bg-white shadow rounded-lg overflow-hidden">
     <div className="p-4 border-b border-gray-200">
       <h2 className="text-xl font-bold text-gray-900">Card Title</h2>
     </div>
     <div className="p-4">
       <p className="text-gray-600">Card content</p>
     </div>
   </div>

   // After
   <div className={styles.card.container}>
     <div className={styles.card.header}>
       <h2 className={styles.typography.h2}>Card Title</h2>
     </div>
     <div className={styles.card.body}>
       <p className={styles.typography.body}>Card content</p>
     </div>
   </div>
   ```

## Checklist

- [ ] Replace direct `colorPalette` references with `useTheme` hook
- [ ] Replace hardcoded Tailwind classes with theme functions
- [ ] Replace custom button styles with the Button component
- [ ] Use common UI styles for cards, forms, typography, etc.
- [ ] Add fallbacks for all theme properties
- [ ] Test the component with different theme settings

## Common Gotchas

- Make sure to keep any additional classes that aren't theme-related
- The order of classes matters in Tailwind, so place theme classes before custom ones
- Don't forget to import both theme and component styles when needed
- Keep using your existing layout styles (flex, grid, padding, margin)

## Testing Your Migration

The easiest way to test if your migration worked is to switch themes in the admin interface. Your component should react to theme changes consistently with the rest of the application.
