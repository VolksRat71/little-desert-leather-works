import React, { useState, useEffect, useRef, memo } from 'react';

// Tailwind color palette
const tailwindColors = {
  slate: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  gray: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  zinc: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  neutral: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  stone: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  red: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  orange: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  amber: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  yellow: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  lime: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  green: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  emerald: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  teal: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  cyan: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  sky: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  blue: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  indigo: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  violet: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  purple: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  fuchsia: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  pink: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  rose: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  // Add our custom desert color palette
  desert: ['tan', 'orange', 'terracotta', 'rust', 'olive', 'green', 'black'],
};

// Helper to safely render the color preview
const renderColorPreview = (colorValue) => {
  if (!colorValue) return null;
  const [family, shade] = colorValue.split('-');
  if (!family || !shade) return null;
  return <div className={`w-6 h-6 rounded mr-2 bg-${family}-${shade}`} aria-hidden="true"></div>;
};

// Helper to get display name for shades (handling both numeric and named shades)
const getShadeLabel = (shade) => {
  return shade;
};

const TailwindColorPicker = ({ value, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(value || 'amber-600');
  const [selectedFamily, setSelectedFamily] = useState(
    value ? value.split('-')[0] : 'amber'
  );
  const [selectedShade, setSelectedShade] = useState(
    value ? value.split('-')[1] : '600'
  );
  const dropdownRef = useRef(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    // Update component if value is changed externally
    // Compare with the previous value instead of selectedColor to avoid circular dependency
    if (value && value !== prevValueRef.current) {
      const [family, shade] = value.split('-');
      setSelectedColor(value);
      setSelectedFamily(family);
      setSelectedShade(shade);
      // Update the ref to track the current value
      prevValueRef.current = value;
    }
  }, [value]); // Remove selectedColor from dependency array

  useEffect(() => {
    // Close the dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const handleColorSelect = (family, shade) => {
    const newColor = `${family}-${shade}`;
    setSelectedFamily(family);
    setSelectedShade(shade);
    setSelectedColor(newColor);
    onChange(newColor);
    setIsOpen(false);
  };

  return (
    <div className="relative mb-4">
      {label && <label className="block text-gray-700 mb-1">{label}</label>}

      <div
        ref={dropdownRef}
        className="relative"
      >
        <button
          type="button"
          className="flex items-center w-full justify-between border border-gray-300 rounded px-3 py-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            {renderColorPreview(selectedColor)}
            <span>{selectedColor}</span>
          </div>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg p-2 border border-gray-200 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 gap-2">
              {/* Color families */}
              <div className="flex flex-wrap gap-1 border-b border-gray-200 pb-2 mb-2">
                {Object.keys(tailwindColors).map((family) => (
                  <button
                    key={family}
                    type="button"
                    className={`px-2 py-1 rounded text-xs capitalize ${
                      selectedFamily === family
                        ? 'bg-gray-200 font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedFamily(family)}
                  >
                    {family}
                  </button>
                ))}
              </div>

              {/* Shades for selected family */}
              <div className="grid grid-cols-5 gap-1">
                {tailwindColors[selectedFamily].map((shade) => {
                  const colorClass = `${selectedFamily}-${shade}`;
                  return (
                    <button
                      key={shade}
                      type="button"
                      className={`p-1 rounded flex flex-col items-center transition-all duration-150 ${
                        selectedColor === colorClass
                          ? 'ring-2 ring-blue-500 ring-offset-2'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleColorSelect(selectedFamily, shade)}
                    >
                      <div className={`w-full h-8 rounded bg-${selectedFamily}-${shade} mb-1`}></div>
                      <span className="text-xs capitalize">{getShadeLabel(shade)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Export the memoized component to prevent unnecessary re-renders
export default memo(TailwindColorPicker, (prevProps, nextProps) => {
  // Only re-render if these props change
  return prevProps.value === nextProps.value && prevProps.label === nextProps.label;
});
