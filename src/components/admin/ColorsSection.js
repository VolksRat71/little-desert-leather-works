import React, { useState, useEffect } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import TailwindColorPicker from '../TailwindColorPicker';

const ColorsSection = () => {
  const { colorPalette, updateColorPalette, temporaryColorPalette, setTemporaryColorPalette } = useWebsite();

  // Initialize editedColors from temporaryColorPalette if it exists (returning to component)
  // or from the main colorPalette if starting fresh
  const [editedColors, setEditedColors] = useState(temporaryColorPalette || { ...colorPalette });

  // Keep track of original colors for reset functionality
  const [originalColors, setOriginalColors] = useState({ ...colorPalette });

  // When either colorPalette or temporaryColorPalette changes, update our state
  useEffect(() => {
    if (temporaryColorPalette) {
      setEditedColors(temporaryColorPalette);
    } else {
      setEditedColors({ ...colorPalette });
      setOriginalColors({ ...colorPalette });
    }
  }, [colorPalette, temporaryColorPalette]);

  // Apply color changes to context without clearing on unmount
  useEffect(() => {
    // Only update if editedColors has actually changed from initial state
    if (JSON.stringify(editedColors) !== JSON.stringify(temporaryColorPalette)) {
      setTemporaryColorPalette(editedColors);
    }
  }, [editedColors, setTemporaryColorPalette, temporaryColorPalette]);

  // Check if we have unsaved changes
  const hasUnsavedChanges = JSON.stringify(temporaryColorPalette) !== JSON.stringify(colorPalette);

  // Save the edited colors to the persistent storage/context
  const handleSaveColors = () => {
    updateColorPalette(editedColors);
    setOriginalColors({ ...editedColors }); // Update original colors after save
  };

  // Reset all colors to their original values (before editing)
  const handleResetAll = () => {
    setEditedColors({ ...originalColors });
    setTemporaryColorPalette(null);
  };

  // Reset a specific color section (primary, secondary, text, ui)
  const handleResetSection = (section) => {
    setEditedColors({
      ...editedColors,
      [section]: { ...originalColors[section] }
    });
  };

  // Reset a specific color property
  const handleResetColor = (section, property) => {
    setEditedColors({
      ...editedColors,
      [section]: {
        ...editedColors[section],
        [property]: originalColors[section][property]
      }
    });
  };

  const handleColorChange = (section, property, value) => {
    setEditedColors({
      ...editedColors,
      [section]: {
        ...editedColors[section],
        [property]: value
      }
    });
  };

  // Helper function to render a color preview div
  const renderColorPreview = (colorValue) => {
    // Split the color value (e.g., "amber-600" or "desert-tan")
    const [family, shade] = colorValue.split('-');
    return (
      <div className={`mt-2 h-8 w-full rounded bg-${family}-${shade}`}></div>
    );
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Theme Colors</h2>
      <p className="mb-6 text-gray-600">
        Customize the color scheme of your website. Changes will be applied immediately for preview.
        {hasUnsavedChanges && <span className="text-amber-600 ml-1 font-medium">You have unsaved changes!</span>}
        {" "}Click "Save Changes" to make them permanent.
      </p>

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleResetAll}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mr-2"
        >
          Reset All Colors
        </button>
        <button
          onClick={handleSaveColors}
          className={`${hasUnsavedChanges ? 'bg-blue-600 animate-pulse' : 'bg-blue-600'} text-white px-6 py-2 rounded hover:bg-blue-700`}
        >
          Save Color Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* Primary Colors */}
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Primary Colors</h3>
            <button
              onClick={() => handleResetSection('primary')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset Primary Colors
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(editedColors.primary).map(([key, value]) => (
              <div key={`primary-${key}`} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <button
                    onClick={() => handleResetColor('primary', key)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Reset
                  </button>
                </div>
                <TailwindColorPicker
                  value={value}
                  onChange={(newColor) => handleColorChange('primary', key, newColor)}
                />
                {renderColorPreview(value)}
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Secondary Colors</h3>
            <button
              onClick={() => handleResetSection('secondary')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset Secondary Colors
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(editedColors.secondary).map(([key, value]) => (
              <div key={`secondary-${key}`} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <button
                    onClick={() => handleResetColor('secondary', key)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Reset
                  </button>
                </div>
                <TailwindColorPicker
                  value={value}
                  onChange={(newColor) => handleColorChange('secondary', key, newColor)}
                />
                {renderColorPreview(value)}
              </div>
            ))}
          </div>
        </div>

        {/* Text Colors */}
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Text Colors</h3>
            <button
              onClick={() => handleResetSection('text')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset Text Colors
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(editedColors.text).map(([key, value]) => (
              <div key={`text-${key}`} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <button
                    onClick={() => handleResetColor('text', key)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Reset
                  </button>
                </div>
                <TailwindColorPicker
                  value={value}
                  onChange={(newColor) => handleColorChange('text', key, newColor)}
                />
                {renderColorPreview(value)}
              </div>
            ))}
          </div>
        </div>

        {/* UI Colors */}
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">UI Elements</h3>
            <button
              onClick={() => handleResetSection('ui')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reset UI Colors
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(editedColors.ui).map(([key, value]) => (
              <div key={`ui-${key}`} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                  <button
                    onClick={() => handleResetColor('ui', key)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Reset
                  </button>
                </div>
                <TailwindColorPicker
                  value={value}
                  onChange={(newColor) => handleColorChange('ui', key, newColor)}
                />
                {renderColorPreview(value)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6 pt-6 flex justify-end">
        <button
          onClick={handleResetAll}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mr-2"
        >
          Reset All Colors
        </button>
        <button
          onClick={handleSaveColors}
          className={`${hasUnsavedChanges ? 'bg-blue-600 animate-pulse' : 'bg-blue-600'} text-white px-6 py-2 rounded hover:bg-blue-700`}
        >
          Save Color Changes
        </button>
      </div>
    </div>
  );
};

export default ColorsSection;
