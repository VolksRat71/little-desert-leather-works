import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Track theme being previewed
  const [previewTheme, setPreviewTheme] = useState(null);

  // Store the pre-preview colors to restore when canceling preview
  const [prePreviewColors, setPrePreviewColors] = useState(null);

  // Track active tab
  const [activeTab, setActiveTab] = useState('standard');

  // Track if user is customizing a theme
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Track custom themes
  const [customThemes, setCustomThemes] = useState([]);

  // Track custom theme name and description
  const [customThemeName, setCustomThemeName] = useState('');
  const [customThemeDescription, setCustomThemeDescription] = useState('');
  const [themeToCustomize, setThemeToCustomize] = useState(null);

  // Dropdown menu state
  const [openActionMenu, setOpenActionMenu] = useState(null);

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Add a ref to track the previous editedColors value
  const prevEditedColorsRef = useRef();

  // Add a flag to track when we're directly setting colors from handleCopyTheme
  const [directlySettingColors, setDirectlySettingColors] = useState(false);

  // Load custom themes from localStorage on component mount
  useEffect(() => {
    try {
      const savedThemes = localStorage.getItem('customThemes');
      if (savedThemes) {
        setCustomThemes(JSON.parse(savedThemes));
      }
    } catch (error) {
      console.error('Error loading custom themes from localStorage:', error);
    }
  }, []);

  // Save custom themes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('customThemes', JSON.stringify(customThemes));
    } catch (error) {
      console.error('Error saving custom themes to localStorage:', error);
    }
  }, [customThemes]);

  // Update hasUnsavedChanges when editedColors or colors change
  useEffect(() => {
    // Check if we have unsaved changes by comparing against the actual saved colors
    const unsavedChanges = colors && JSON.stringify(editedColors) !== JSON.stringify(colors);
    setHasUnsavedChanges(unsavedChanges);
  }, [editedColors, colors]);

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
  }, [colorPalette, temporaryColorPalette, saving, currentPreset]);

  // Apply preview or edited colors to the site-wide temporary palette for live preview
  useEffect(() => {
    // Do not update temporary palette when saving (could cause flicker)
    if (saving) return;

    // When we have a preview active, always update the site with preview colors
    if (previewTheme) {
      console.log('Applying preview colors to site');
      // Only update if the colors have actually changed
      if (JSON.stringify(editedColors) !== JSON.stringify(temporaryColorPalette)) {
        setTemporaryColorPalette({...editedColors});
      }
    }
    // Otherwise, only update if not in preview mode and colors have changed
    else if (!prePreviewColors && JSON.stringify(editedColors) !== JSON.stringify(colorPalette) &&
             JSON.stringify(editedColors) !== JSON.stringify(temporaryColorPalette)) {
      console.log('Applying edited colors to site');
      // Debounce to avoid rapid changes
      const timer = setTimeout(() => {
        setTemporaryColorPalette({...editedColors});
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [editedColors, previewTheme, prePreviewColors, saving]);

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

  // Memoize the color change handler to prevent unnecessary re-renders
  const handleColorChange = useCallback((section, property, value) => {
    setEditedColors(prevColors => ({
      ...prevColors,
      [section]: {
        ...prevColors[section],
        [property]: value
      }
    }));
  }, []);

  // Helper function to render a color preview div
  const renderColorPreview = useCallback((colorValue) => {
    // Split the color value (e.g., "amber-600" or "desert-tan")
    if (!colorValue) return null;
    const [family, shade] = colorValue.split('-');
    if (!family || !shade) return null;
    return (
      <div className={`mt-2 h-8 w-full rounded bg-${family}-${shade}`}></div>
    );
  }, []);

  // Apply a theme preset
  const handleApplyPreset = async (presetId) => {
    setSaving(true);
    setSaveError(null);
    try {
      // Check if it's a custom theme first
      const customTheme = customThemes.find(theme => theme.id === presetId);

      let updatedColors;

      if (customTheme) {
        // For custom themes, apply directly from local state
        updatedColors = {...customTheme.palette};

        // Update the site's colors in the API
        await updateColorPalette(updatedColors);
      } else {
        // For standard presets, use the existing API function
        updatedColors = await applyThemePreset(presetId);
      }

      // After the preset is applied, manually update local state to match
      // Set current preset
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

  // Preview a theme preset - temporarily show it without applying to API
  const handlePreviewTheme = (presetId) => {
    // Check if preview is being toggled off for current theme
    if (previewTheme === presetId) {
      // If already previewing this theme, cancel preview
      console.log('Canceling site-wide preview, restoring colors:', prePreviewColors);

      // First restore the pre-preview colors
      if (prePreviewColors) {
        setEditedColors({...prePreviewColors});
      } else {
        setEditedColors(temporaryColorPalette || {...colorPalette});
      }

      // Then clear preview states
      setPreviewTheme(null);
      setPrePreviewColors(null);
    } else {
      // Find the preset - first check standard presets
      let preset = themePresets.find(p => p.id === presetId);

      // If not found in standard presets, check custom themes
      if (!preset) {
        preset = customThemes.find(theme => theme.id === presetId);
      }

      if (!preset) return;

      // Start previewing this theme
      console.log('Starting site-wide preview of theme:', preset.id);

      // Save current colors before applying preview
      setPrePreviewColors({...editedColors});

      // Apply the preview colors to the edited colors (will be picked up by useEffect)
      setEditedColors({...preset.palette});

      // Set as current preview
      setPreviewTheme(preset.id);

      // Close any open action menu
      setOpenActionMenu(null);
    }
  };

  // Create a copy of a theme for customization or edit an existing custom theme
  const handleCopyTheme = (presetId) => {
    // Set flag to prevent additional effects from firing
    setDirectlySettingColors(true);

    // First check if it's a custom theme (for editing)
    const customTheme = customThemes.find(theme => theme.id === presetId);

    let themeColors;

    if (customTheme) {
      // Editing an existing custom theme
      themeColors = {...customTheme.palette};
      setEditedColors(themeColors);
      setCustomThemeName(customTheme.name);
      setCustomThemeDescription(customTheme.description);
      setThemeToCustomize(presetId); // Store the ID to update instead of create new
    } else {
      // Standard preset - create a copy
      const preset = themePresets.find(p => p.id === presetId);

      if (preset) {
        // Copy the preset colors to edited colors
        themeColors = {...preset.palette};
        setEditedColors(themeColors);

        // Set default name and description based on the original theme
        setCustomThemeName(`${preset.name} (Custom)`);
        setCustomThemeDescription(`My customized version of ${preset.name}`);

        // Store which theme we're customizing
        setThemeToCustomize(preset.id);
      } else {
        // If preset not found, exit
        console.error('Theme preset not found:', presetId);
        return;
      }
    }

    // Switch to custom tab and enable customizing mode
    setActiveTab('custom');
    setIsCustomizing(true);
    setPreviewTheme(null);

    // Important: Store the new palette in the context using the local copy
    // This ensures we're using the actual theme palette that was selected
    setTemporaryColorPalette(themeColors);

    // Store theme customization state in sessionStorage
    // Need to delay this to allow state updates to complete
    setTimeout(() => {
      storeCustomizationState();
      // Reset the flag after a delay to ensure all state updates have completed
      setTimeout(() => {
        setDirectlySettingColors(false);
      }, 100);
    }, 0);
  };

  // Store customization state in sessionStorage for persistence during navigation
  const storeCustomizationState = () => {
    try {
      // Also store the current edited colors - needed for proper restoration
      // But only store if we actually have colors to store
      const customizationState = {
        isCustomizing,
        customThemeName,
        customThemeDescription,
        themeToCustomize,
        activeTab: 'custom',
        // Store the current colors if available
        themeColors: editedColors ? JSON.stringify(editedColors) : null
      };
      sessionStorage.setItem('themeCustomizationState', JSON.stringify(customizationState));
    } catch (error) {
      console.error('Error saving customization state to sessionStorage:', error);
    }
  };

  // Effect to restore customization state from sessionStorage when component mounts
  useEffect(() => {
    try {
      const storedState = sessionStorage.getItem('themeCustomizationState');
      if (storedState) {
        // Set the flag to prevent other effects from interfering
        setDirectlySettingColors(true);

        const {
          isCustomizing: storedIsCustomizing,
          customThemeName: storedName,
          customThemeDescription: storedDesc,
          themeToCustomize: storedTheme,
          themeColors: storedColors
        } = JSON.parse(storedState);

        // Restore the customization state
        setIsCustomizing(storedIsCustomizing);
        setCustomThemeName(storedName || '');
        setCustomThemeDescription(storedDesc || '');
        setThemeToCustomize(storedTheme);
        setActiveTab('custom');

        // If we have stored colors, restore them
        if (storedColors) {
          try {
            const parsedColors = JSON.parse(storedColors);
            setEditedColors(parsedColors);
            setTemporaryColorPalette(parsedColors);
          } catch (e) {
            console.error('Error parsing stored colors:', e);
          }
        }

        // Reset the flag after a delay to allow all state updates to complete
        setTimeout(() => {
          setDirectlySettingColors(false);
        }, 100);
      }
    } catch (error) {
      console.error('Error loading customization state from sessionStorage:', error);
      setDirectlySettingColors(false);
    }
  }, []);

  // Effect to store customization state whenever relevant state changes
  useEffect(() => {
    if (isCustomizing) {
      storeCustomizationState();
    } else {
      // Clear the customization state when exiting customizing mode
      sessionStorage.removeItem('themeCustomizationState');
      setTemporaryColorPalette(null);
    }
  }, [isCustomizing, customThemeName, customThemeDescription, themeToCustomize]);

  // Separate effect to update temporary color palette only when necessary
  // This prevents the circular dependency with editedColors
  useEffect(() => {
    // Skip this effect if we're not in customizing mode or if we're directly setting colors from handleCopyTheme
    if (!isCustomizing || !editedColors || directlySettingColors) return;

    // Get deep clone of current edited colors for comparison
    const currentEditedColors = JSON.stringify(editedColors);

    // Get the previous edited colors from ref
    const prevEditedColors = prevEditedColorsRef.current;

    // Only update if the colors have actually changed and we're in customizing mode
    if (!prevEditedColors || currentEditedColors !== prevEditedColors) {
      // Schedule the update using setTimeout to break the potential rendering cycle
      // This helps avoid the "Maximum update depth exceeded" error by deferring the state update
      const timeoutId = setTimeout(() => {
        setTemporaryColorPalette({...editedColors});
      }, 0);

      // Update the ref with current value for future comparisons - as a string for deep comparison
      prevEditedColorsRef.current = currentEditedColors;

      // Clean up timeout if component unmounts or effect runs again
      return () => clearTimeout(timeoutId);
    }
  }, [isCustomizing, editedColors, directlySettingColors]);

  // Handle menu toggle
  const toggleActionMenu = (presetId) => {
    if (openActionMenu === presetId) {
      setOpenActionMenu(null);
    } else {
      setOpenActionMenu(presetId);
    }
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Theme Colors</h2>
      <p className="mb-6 text-gray-600">
        Customize the color scheme of your website. Changes will be applied immediately for preview.
        {hasUnsavedChanges && <span className="text-amber-600 ml-1 font-medium">You have unsaved changes!</span>}
      </p>

      {/* Theme Presets Section */}
      <div className="mb-8 bg-white p-6 rounded shadow-sm">
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('standard');
                setIsCustomizing(false);
              }}
              className={`${
                activeTab === 'standard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out`}
            >
              Standard Themes
            </button>
            <button
              onClick={() => {
                setActiveTab('holidays');
                setIsCustomizing(false);
              }}
              className={`${
                activeTab === 'holidays'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out`}
            >
              Holiday Themes
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`${
                activeTab === 'custom'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ease-in-out`}
            >
              Custom Themes
            </button>
          </nav>
        </div>

        {/* Standard Themes Tab */}
        {activeTab === 'standard' && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-medium mb-4">Standard Themes</h3>
            <p className="text-gray-600 mb-4">
              Select a predefined theme to instantly change your website's look and feel.
              You can preview, apply, or customize these themes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themePresets
                .filter(preset => !preset.category)
                .map(preset => (
                  <div
                    key={preset.id}
                    className={`
                      border rounded-lg p-4 transition-all relative
                      ${currentPreset === preset.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}
                      ${previewTheme === preset.id ? 'border-amber-500 ring-2 ring-amber-300 bg-amber-50' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{preset.name}</h4>
                        <p className="text-gray-500 text-sm mb-3">{preset.description}</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => toggleActionMenu(preset.id)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          aria-label="Theme actions"
                        >
                          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {openActionMenu === preset.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200 animate-fadeIn transform origin-top-right transition-transform duration-200 ease-out">
                            <button
                              onClick={() => {
                                handleApplyPreset(preset.id);
                                setOpenActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Apply Theme
                            </button>
                            <button
                              onClick={() => {
                                handleCopyTheme(preset.id);
                                setOpenActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Copy & Customize
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Color swatches preview */}
                    <div className="flex space-x-2 mb-4">
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

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreviewTheme(preset.id)}
                        className={`w-full px-3 py-1.5 text-sm rounded transition-colors duration-200
                          ${previewTheme === preset.id
                            ? 'bg-amber-500 text-white font-medium border border-amber-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                          }`}
                      >
                        {previewTheme === preset.id ? 'Exit Preview' : 'Preview'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Holiday Themes Tab */}
        {activeTab === 'holidays' && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-medium mb-4">Holiday Themes</h3>
            <p className="text-gray-600 mb-4">
              Seasonal and holiday-themed color palettes to give your site a festive feel for special occasions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themePresets
                .filter(preset => preset.category === 'holiday')
                .map(preset => (
                  <div
                    key={preset.id}
                    className={`
                      border rounded-lg p-4 transition-all relative
                      ${currentPreset === preset.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}
                      ${previewTheme === preset.id ? 'border-amber-500 ring-2 ring-amber-300 bg-amber-50' : ''}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{preset.name}</h4>
                        <p className="text-gray-500 text-sm mb-3">{preset.description}</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => toggleActionMenu(preset.id)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          aria-label="Theme actions"
                        >
                          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {openActionMenu === preset.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200 animate-fadeIn transform origin-top-right transition-transform duration-200 ease-out">
                            <button
                              onClick={() => {
                                handleApplyPreset(preset.id);
                                setOpenActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Apply Theme
                            </button>
                            <button
                              onClick={() => {
                                handleCopyTheme(preset.id);
                                setOpenActionMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Copy & Customize
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Color swatches preview */}
                    <div className="flex space-x-2 mb-4">
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

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreviewTheme(preset.id)}
                        className={`w-full px-3 py-1.5 text-sm rounded transition-colors duration-200
                          ${previewTheme === preset.id
                            ? 'bg-amber-500 text-white font-medium border border-amber-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                          }`}
                      >
                        {previewTheme === preset.id ? 'Exit Preview' : 'Preview'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Custom Themes */}
        {activeTab === 'custom' && (
          <div className="animate-fadeIn">
            <h3 className="text-lg font-medium mb-4">Custom Themes</h3>
            {!isCustomizing ? (
              <div>
                {customThemes.length > 0 ? (
                  <div>
                    <p className="text-gray-600 mb-4">
                      These are your custom themes. You can preview, apply, or further customize them.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {customThemes.map(theme => (
                        <div
                          key={theme.id}
                          className={`
                            border rounded-lg p-4 transition-all relative
                            ${currentPreset === theme.id ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'}
                            ${previewTheme === theme.id ? 'border-amber-500 ring-2 ring-amber-300 bg-amber-50' : ''}
                          `}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{theme.name}</h4>
                              <p className="text-gray-500 text-sm mb-3">{theme.description}</p>
                            </div>
                            <div className="relative">
                              <button
                                onClick={() => toggleActionMenu(theme.id)}
                                className="p-1 rounded-full hover:bg-gray-100"
                                aria-label="Theme actions"
                              >
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>

                              {/* Dropdown Menu */}
                              {openActionMenu === theme.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200 animate-fadeIn transform origin-top-right transition-transform duration-200 ease-out">
                                  <button
                                    onClick={() => {
                                      handleApplyPreset(theme.id);
                                      setOpenActionMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Apply Theme
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleCopyTheme(theme.id);
                                      setOpenActionMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Edit Theme
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleCopyTheme(theme.id);
                                      setCustomThemeName(`${theme.name} (Copy)`);
                                      setCustomThemeDescription(`Copy of ${theme.name}`);
                                      setThemeToCustomize(null); // Create new instead of updating
                                      setOpenActionMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Copy & Customize
                                  </button>
                                  <button
                                    onClick={() => {
                                      // Remove theme from customThemes
                                      setCustomThemes(customThemes.filter(t => t.id !== theme.id));
                                      setOpenActionMenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    Delete Theme
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Color swatches preview */}
                          <div className="flex space-x-2 mb-4">
                            {theme.palette.primary && (
                              <div
                                className={`w-8 h-8 rounded-full bg-${theme.palette.primary.base} border border-gray-200`}
                                title="Primary color"
                              ></div>
                            )}
                            {theme.palette.secondary && (
                              <div
                                className={`w-8 h-8 rounded-full bg-${theme.palette.secondary.base} border border-gray-200`}
                                title="Secondary color"
                              ></div>
                            )}
                            {theme.palette.text && (
                              <div
                                className={`w-8 h-8 rounded-full bg-${theme.palette.text.primary} border border-gray-200`}
                                title="Text color"
                              ></div>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePreviewTheme(theme.id)}
                              className={`w-full px-3 py-1.5 text-sm rounded transition-colors duration-200
                                ${previewTheme === theme.id
                                  ? 'bg-amber-500 text-white font-medium border border-amber-600'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                }`}
                            >
                              {previewTheme === theme.id ? 'Exit Preview' : 'Preview'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">You haven't created any custom themes yet.</p>
                    <button
                      onClick={() => {
                        setIsCustomizing(true);
                        // Start with current colors as base
                        setEditedColors(temporaryColorPalette || {...colorPalette});
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Create Custom Theme
                    </button>
                    <p className="text-gray-500 mt-4">
                      Tip: You can also copy an existing theme for easier customization.
                    </p>
                  </div>
                )}

                {customThemes.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => setIsCustomizing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                    >
                      Create New Custom Theme
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h4 className="font-medium">Customize Your Theme</h4>
                  <button
                    onClick={() => setIsCustomizing(false)}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>

                {/* Notice about preview mode */}
                <div className="mb-4 bg-blue-50 border border-blue-100 rounded-md p-3 text-blue-800">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium">Preview Mode Active</p>
                      <p className="text-sm">You're currently previewing these theme changes across the site. Feel free to navigate to other pages to see how your theme looks. Your changes will be preserved when you return to this page.</p>
                    </div>
                  </div>
                </div>

                {/* Theme Details - Moved to the top */}
                <div className="mb-8">
                  <div className="bg-white p-4 rounded shadow-sm">
                    <h3 className="text-lg font-medium mb-4">Theme Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="themeName" className="block text-sm font-medium text-gray-700 mb-1">
                          Theme Name
                        </label>
                        <input
                          type="text"
                          id="themeName"
                          value={customThemeName}
                          onChange={(e) => setCustomThemeName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter a name for your custom theme"
                        />
                      </div>
                      <div>
                        <label htmlFor="themeDescription" className="block text-sm font-medium text-gray-700 mb-1">
                          Theme Description
                        </label>
                        <textarea
                          id="themeDescription"
                          value={customThemeDescription}
                          onChange={(e) => setCustomThemeDescription(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter a description for your custom theme"
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* The color editor is shown here only when customizing */}
                <div className="space-y-8">
                  {/* Primary Colors */}
                  <div className="bg-white p-4 rounded shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">Primary Colors</h3>
                      <button
                        onClick={() => handleResetSection('primary')}
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
                              className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
                              className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
                              className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
                        className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
                              className="text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
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

                <div className="flex justify-between space-x-4 mt-8 pt-4 border-t border-gray-200">
                  <div>
                    <button
                      onClick={handleResetAll}
                      className="text-gray-700 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition-colors duration-200"
                      disabled={saving}
                    >
                      Reset Colors
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsCustomizing(false)}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors duration-200"
                      disabled={saving || isLoading.colorPalette}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Save custom theme with name and description
                        if (customThemeName.trim()) {
                          // Check if editing an existing custom theme
                          const existingThemeIndex = customThemes.findIndex(t => t.id === themeToCustomize);

                          if (existingThemeIndex >= 0) {
                            // Update existing theme
                            const updatedThemes = [...customThemes];
                            updatedThemes[existingThemeIndex] = {
                              ...updatedThemes[existingThemeIndex],
                              name: customThemeName,
                              description: customThemeDescription,
                              palette: {...editedColors}
                            };
                            setCustomThemes(updatedThemes);
                          } else {
                            // Create a new custom theme
                            const newCustomTheme = {
                              id: `custom-${Date.now()}`,
                              name: customThemeName,
                              description: customThemeDescription,
                              palette: {...editedColors},
                              category: 'custom',
                              baseTheme: themeToCustomize
                            };

                            // Add to custom themes
                            setCustomThemes([...customThemes, newCustomTheme]);
                          }

                          // Save colors to apply to site
                          handleSaveColors();

                          // Reset fields and exit customizing mode
                          setCustomThemeName('');
                          setCustomThemeDescription('');
                          setThemeToCustomize(null);
                          setIsCustomizing(false);
                        } else {
                          // Name is required
                          alert('Please enter a name for your custom theme');
                        }
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
                      disabled={saving || isLoading.colorPalette}
                    >
                      {saving || isLoading.colorPalette ? (
                        <>
                          <span className="invisible">Save & Exit</span>
                          <svg className="absolute inset-0 m-auto w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </>
                      ) : (
                        "Save & Exit"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        // Save custom theme with name and description but stay in edit mode
                        if (customThemeName.trim()) {
                          // Check if editing an existing custom theme
                          const existingThemeIndex = customThemes.findIndex(t => t.id === themeToCustomize);
                          let newThemeId;

                          if (existingThemeIndex >= 0) {
                            // Update existing theme
                            const updatedThemes = [...customThemes];
                            updatedThemes[existingThemeIndex] = {
                              ...updatedThemes[existingThemeIndex],
                              name: customThemeName,
                              description: customThemeDescription,
                              palette: {...editedColors}
                            };
                            setCustomThemes(updatedThemes);
                            newThemeId = themeToCustomize;
                          } else {
                            // Create a new custom theme
                            newThemeId = `custom-${Date.now()}`;
                            const newCustomTheme = {
                              id: newThemeId,
                              name: customThemeName,
                              description: customThemeDescription,
                              palette: {...editedColors},
                              category: 'custom',
                              baseTheme: themeToCustomize
                            };

                            // Add to custom themes
                            setCustomThemes([...customThemes, newCustomTheme]);
                          }

                          // Save colors to apply to site
                          handleSaveColors();

                          // Update the theme we're customizing to the new/updated one
                          setThemeToCustomize(newThemeId);

                          // Show a success message
                          alert(`Theme "${customThemeName}" saved successfully! You can continue editing.`);
                        } else {
                          // Name is required
                          alert('Please enter a name for your custom theme');
                        }
                      }}
                      className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors duration-200"
                      disabled={saving || isLoading.colorPalette}
                    >
                      {saving || isLoading.colorPalette ? (
                        <>
                          <span className="invisible">Save & Continue</span>
                          <svg className="absolute inset-0 m-auto w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </>
                      ) : (
                        "Save & Continue Editing"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {saveError}
        </div>
      )}
    </div>
  );
};

export default ColorsSection;
