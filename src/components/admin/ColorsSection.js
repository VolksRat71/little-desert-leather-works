import React, { useState, useEffect } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import TailwindColorPicker from '../TailwindColorPicker';

const ColorsSection = () => {
  const {
    colorPalette,
    colors,
    updateColorPalette,
    temporaryColorPalette,
    setTemporaryColorPalette,
    themePresets,
    applyThemePreset,
    isLoading
  } = useWebsite();

  // Initialize editedColors from temporaryColorPalette if it exists (returning to component)
  // or from the main colorPalette if starting fresh
  const [editedColors, setEditedColors] = useState(temporaryColorPalette || { ...colorPalette });

  // Keep track of original colors for reset functionality
  const [originalColors, setOriginalColors] = useState({ ...colorPalette });

  // Track if a save is in progress
  const [saving, setSaving] = useState(false);

  // Track any error during save
  const [saveError, setSaveError] = useState(null);

  // Track current theme preset
  const [currentPreset, setCurrentPreset] = useState(null);

  // When either colorPalette or temporaryColorPalette changes, update our state
  useEffect(() => {
    // Skip unnecessary updates if we're currently saving or handling a preset
    if (saving) return;

    // We only want to update our local state from context when:
    // 1. There's a temporary palette (editing in progress)
    // 2. Or there's NO temporaryColorPalette and we need to sync with main colorPalette
    if (temporaryColorPalette) {
      // If we have a temporary palette, use it for state
      setEditedColors({...temporaryColorPalette});
    } else if (colorPalette &&
               !currentPreset && // Don't update if we just set a preset
               JSON.stringify(editedColors) !== JSON.stringify(colorPalette)) {
      // Only update if colorPalette has actually changed from our current state
      // Create a new reference to ensure React detects the change
      const newColors = JSON.parse(JSON.stringify(colorPalette));
      setEditedColors(newColors);
      setOriginalColors(newColors);
    }
  }, [colorPalette, temporaryColorPalette, saving, editedColors, currentPreset]);

  // Check if we have unsaved changes by comparing against the actual saved colors (colors)
  // not the temporaryColorPalette or colorPalette which might include temporary changes
  const hasUnsavedChanges = colors && JSON.stringify(editedColors) !== JSON.stringify(colors);

  // Apply color changes to context without clearing on unmount
  useEffect(() => {
    // Skip if we're currently saving to avoid loops
    if (saving) return;

    // Only update if editedColors has actually changed from temporary palette
    if (JSON.stringify(editedColors) !== JSON.stringify(temporaryColorPalette)) {
      // Debounce the state update to avoid rapid changes
      const timer = setTimeout(() => {
        // Only update temporary palette if we're actually editing
        // This prevents overriding a theme preset that was just applied
        if (!currentPreset ||
            (colors && JSON.stringify(editedColors) !== JSON.stringify(colors))) {
          setTemporaryColorPalette({...editedColors});
        }
      }, 100); // Slightly longer debounce to ensure stability

      return () => clearTimeout(timer);
    }
  }, [editedColors, setTemporaryColorPalette, temporaryColorPalette, saving, currentPreset, colors]);

  // Save the edited colors to the persistent storage/context
  const handleSaveColors = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await updateColorPalette(editedColors);
      setOriginalColors({ ...editedColors }); // Update original colors after save
    } catch (error) {
      console.error('Error saving colors:', error);
      setSaveError('Failed to save color changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Reset all colors to their original values (before editing)
  const handleResetAll = () => {
    // Update both states with the same reference to avoid double-render
    const resetColors = {...originalColors};
    setEditedColors(resetColors);

    // Clear any set preset
    setCurrentPreset(null);

    // In reset case, we want to clear the temporary palette completely
    // This ensures we're working with the main color palette
    setTemporaryColorPalette(null);
  };

  // Reset a specific color section (primary, secondary, text, ui)
  const handleResetSection = (section) => {
    // Create one new object reference for the section
    const resetSectionData = {...originalColors[section]};

    // Update editedColors with the reset section
    setEditedColors({
      ...editedColors,
      [section]: resetSectionData
    });
  };

  // Reset a specific color property
  const handleResetColor = (section, property) => {
    // Get the original value
    const originalValue = originalColors[section][property];

    // Update just the single property
    setEditedColors({
      ...editedColors,
      [section]: {
        ...editedColors[section],
        [property]: originalValue
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

  // Apply a theme preset
  const handleApplyPreset = async (presetId) => {
    setSaving(true);
    setSaveError(null);
    try {
      // Apply the theme preset through the context
      const updatedColors = await applyThemePreset(presetId);

      // After the preset is applied, manually update local state to match
      // Set current preset first
      setCurrentPreset(presetId);

      // Important: Update local state only AFTER the preset has been applied
      // Create new object references to ensure React detects the change
      const colorsCopy = JSON.parse(JSON.stringify(updatedColors));

      // Update both states in sequence
      setOriginalColors(colorsCopy);
      setEditedColors(colorsCopy);
    } catch (error) {
      console.error('Error applying theme preset:', error);
      setSaveError('Failed to apply theme preset. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Theme Colors</h2>
      <p className="mb-6 text-gray-600">
        Customize the color scheme of your website. Changes will be applied immediately for preview.
        {hasUnsavedChanges && <span className="text-amber-600 ml-1 font-medium">You have unsaved changes!</span>}
        {" "}Click "Save Changes" to make them permanent.
      </p>

      {/* Theme Presets Section */}
      <div className="mb-8 bg-white p-6 rounded shadow-sm">
        <h3 className="text-lg font-medium mb-4">Theme Presets</h3>
        <p className="text-gray-600 mb-4">
          Select a predefined theme to instantly change your website's look and feel.
          You can further customize it after applying.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themePresets.map(preset => (
            <div
              key={preset.id}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all
                ${currentPreset === preset.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200 hover:border-gray-300'}
              `}
              onClick={() => handleApplyPreset(preset.id)}
            >
              <h4 className="font-medium text-gray-900">{preset.name}</h4>
              <p className="text-gray-500 text-sm mb-3">{preset.description}</p>

              {/* Color swatches preview */}
              <div className="flex space-x-2 mb-2">
                {preset.palette.primary && (
                  <div
                    className={`w-8 h-8 rounded-full bg-${preset.palette.primary.base} border border-gray-200`}
                    title="Primary color"
                  ></div>
                )}
                {preset.palette.secondary && (
                  <div
                    className={`w-8 h-8 rounded-full bg-${preset.palette.secondary.base} border border-gray-200`}
                    title="Secondary color"
                  ></div>
                )}
                {preset.palette.text && (
                  <div
                    className={`w-8 h-8 rounded-full bg-${preset.palette.text.primary} border border-gray-200`}
                    title="Text color"
                  ></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {saveError}
        </div>
      )}

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleResetAll}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mr-2"
          disabled={saving}
        >
          Reset All Colors
        </button>
        <button
          onClick={handleSaveColors}
          className={`${
            hasUnsavedChanges
              ? 'bg-blue-600 animate-pulse'
              : 'bg-blue-600'
          } text-white px-6 py-2 rounded hover:bg-blue-700 relative`}
          disabled={saving || isLoading.colorPalette}
        >
          {saving || isLoading.colorPalette ? (
            <>
              <span className="invisible">Save Color Changes</span>
              <svg className="absolute inset-0 m-auto w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </>
          ) : (
            "Save Color Changes"
          )}
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
          disabled={saving}
        >
          Reset All Colors
        </button>
        <button
          onClick={handleSaveColors}
          className={`${
            hasUnsavedChanges
              ? 'bg-blue-600 animate-pulse'
              : 'bg-blue-600'
          } text-white px-6 py-2 rounded hover:bg-blue-700`}
          disabled={saving || isLoading.colorPalette}
        >
          {saving || isLoading.colorPalette ? "Saving..." : "Save Color Changes"}
        </button>
      </div>
    </div>
  );
};

export default ColorsSection;
