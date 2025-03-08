# Theme System Guide

The Little Desert Leather Works theme system provides a consistent way to apply styling across the application, ensuring that components share a cohesive look and feel that can be easily updated.

## Theme Structure

The color palette is structured as follows:

```javascript
{
  primary: {
    background: "stone-50",
    base: "amber-600",
    light: "amber-500",
    dark: "amber-700",
    lightest: "amber-100",
    hover: "amber-700"
  },
  secondary: {
    base: "amber-700",
    light: "amber-600",
    dark: "amber-800",
    lightest: "amber-200",
    hover: "amber-800"
  },
  text: {
    primary: "gray-900",
    secondary: "gray-600",
    tertiary: "gray-500",
    light: "white",
    lightest: "gray-100",
    accent: "amber-600"
  },
  ui: {
    background: "white",
    lightBackground: "gray-50",
    darkBackground: "gray-900",
    border: "gray-200",
    darkBorder: "gray-800",
    hover: "gray-100",
    overlay: "gray-800/75"
  }
}
```

## Using the Theme System

### The useTheme Hook

The `useTheme` hook is the primary way to access the theme system. It provides a set of utility functions that help you apply theme colors consistently:

```javascript
import { useTheme } from '../hooks/useTheme';

function MyComponent() {
  const theme = useTheme();

  // Examples:
  const backgroundClass = theme.bg('primary.base', 'amber-600');
  const textClass = theme.text('text.primary', 'gray-900');
  const buttonClass = theme.button('primary');

  return (
    <div className={backgroundClass}>
      <p className={textClass}>Themed text</p>
      <button className={buttonClass}>Themed Button</button>
    </div>
  );
}
```

### Available Utility Functions

1. `bg(path, fallback, additionalClasses)` - Get a background color
2. `text(path, fallback, additionalClasses)` - Get a text color
3. `border(path, fallback, additionalClasses)` - Get a border color
4. `hoverBg(path, fallback, additionalClasses)` - Get a hover background color
5. `hoverText(path, fallback, additionalClasses)` - Get a hover text color
6. `button(variant, additionalClasses)` - Get complete button styling
7. `getPalette()` - Get the raw color palette object
8. `getThemeClass(type, path, fallback, additionalClasses)` - Low-level function to get any Tailwind class

### Common UI Components

We also provide the `useCommonStyles` hook which gives you pre-configured styles for common UI components:

```javascript
import { useCommonStyles } from '../components/common';

function MyComponent() {
  const styles = useCommonStyles();

  return (
    <div className={styles.card.container}>
      <div className={styles.card.header}>
        <h2 className={styles.typography.h2}>Card Title</h2>
      </div>
      <div className={styles.card.body}>
        <p className={styles.typography.body}>Card content</p>
      </div>
    </div>
  );
}
```

### The Button Component

For buttons, we recommend using the dedicated Button component which uses the theme system:

```javascript
import Button from '../components/Button';

function MyComponent() {
  return (
    <div>
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary" size="sm">Small Secondary Button</Button>
      <Button variant="outline" fullWidth>Full Width Outline Button</Button>
      <Button variant="text">Text Button</Button>
    </div>
  );
}
```

## Best Practices

1. **Use the hooks**: Always use `useTheme` or `useCommonStyles` instead of hardcoded Tailwind classes.
2. **Provide fallbacks**: Always provide fallback values for theme properties.
3. **Component consistency**: Use the same theme properties for similar UI elements.
4. **Accessibility**: Ensure adequate color contrast for text elements.
5. **Extend, don't overwrite**: When creating custom components, extend the existing theme system.

## Theme Presets

The theme system is designed to work with presets, which can be configured in the admin interface or by directly updating the `colorPalette` in the WebsiteContext.

## Creating Custom Theme Components

When creating new UI components that need theming:

1. Import the `useTheme` or `useCommonStyles` hook
2. Use the theme utility functions for colors and styling
3. Provide fallback values for all theme properties
4. Document which theme properties your component uses

## Theme Updates

The theme can be updated through:

1. Admin interface color settings
2. Directly modifying the `colorPalette` in the WebsiteContext
3. Creating and applying theme presets

All changes should propagate automatically to components using the theme system.
