import React, { useState } from 'react';
import { useWebsite } from '../../context/WebsiteContext';
import TailwindColorPicker from '../TailwindColorPicker';

const ColorsSection = () => {
  const { colors, updateColorPalette } = useWebsite();
  const [editedColors, setEditedColors] = useState({ ...colors });

  const handleSaveColors = () => {
    updateColorPalette(editedColors);
    // Could add a success message here
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

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">Theme Colors</h2>
      <p className="mb-6 text-gray-600">Customize the color scheme of your website. Changes will be applied site-wide.</p>

      <div className="space-y-8">
        {/* Primary Colors */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium mb-3">Primary Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(editedColors.primary).map(([key, value]) => (
              <div key={`primary-${key}`} className="mb-4">
                <label className="block mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                <TailwindColorPicker
                  value={value}
                  onChange={(newColor) => handleColorChange('primary', key, newColor)}
                />
                <div className={`mt-2 h-8 w-full rounded bg-${value}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium mb-3">Secondary Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(editedColors.secondary).map(([key, value]) => (
              <div key={`secondary-${key}`} className="mb-4">
                <label className="block mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                <TailwindColorPicker
                  value={value}
                  onChange={(newColor) => handleColorChange('secondary', key, newColor)}
                />
                <div className={`mt-2 h-8 w-full rounded bg-${value}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Text Colors */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium mb-3">Text Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(editedColors.text).map(([key, value]) => (
              <div key={`text-${key}`} className="mb-4">
                <label className="block mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                <TailwindColorPicker
                  value={value}
                  onChange={(newColor) => handleColorChange('text', key, newColor)}
                />
                <div className={`mt-2 h-8 w-full rounded bg-${value}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* UI Colors */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-medium mb-3">UI Elements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(editedColors.ui).map(([key, value]) => (
              <div key={`ui-${key}`} className="mb-4">
                <label className="block mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                <TailwindColorPicker
                  value={value}
                  onChange={(newColor) => handleColorChange('ui', key, newColor)}
                />
                <div className={`mt-2 h-8 w-full rounded bg-${value}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-right">
        <button
          onClick={handleSaveColors}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Color Changes
        </button>
      </div>
    </div>
  );
};

export default ColorsSection;
