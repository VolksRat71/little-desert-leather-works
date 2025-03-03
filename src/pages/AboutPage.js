import React from 'react';
import { useWebsite, colorPalette, artisan, useDocumentTitle } from '../context/WebsiteContext';

const AboutPage = () => {
  const { artisan } = useWebsite();

  // Set document title
  useDocumentTitle('About Us');

  // Custom style with larger font
  const desertFontStyle = {
    transform: 'scale(1.5)',
    transformOrigin: 'left center',
    display: 'inline-block'
  };

  // Center-aligned style for centered text
  const centeredDesertFontStyle = {
    transform: 'scale(1.5)',
    transformOrigin: 'center center',
    display: 'inline-block'
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className={`bg-desert-black text-${colorPalette.text.light} px-6 py-12 rounded-t shadow`}>
          <h1 className="text-4xl font-bold mb-2 text-center">
            <span className="desert-road-font text-shadow" style={centeredDesertFontStyle}>About Your Artisan</span>
          </h1>
          <p className="text-xl text-center">Meet the hands behind our leather goods</p>
        </div>

        <div className={`bg-${colorPalette.ui.background} p-8 rounded-b shadow mb-8`}>
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="md:w-1/3">
              <img
                src={artisan.image}
                alt={artisan.name}
                className="w-full h-auto rounded shadow"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className={`text-3xl font-bold mb-2 text-${colorPalette.text.primary}`}>
                <span className="desert-road-font" style={desertFontStyle}>{artisan.name}</span>
              </h2>
              <p className={`text-xl text-${colorPalette.text.accent} mb-4`}>{artisan.title}</p>

              {artisan.bio.split('\n\n').map((paragraph, index) => (
                <p key={index} className={`text-${colorPalette.text.secondary} mb-4`}>{paragraph}</p>
              ))}

              <div className="mt-6">
                <h3 className={`text-xl font-semibold mb-2 text-${colorPalette.text.primary}`}>
                  <span className="desert-road-font" style={desertFontStyle}>My Craft Philosophy</span>
                </h3>
                <p className={`text-${colorPalette.text.secondary} italic`}>"{artisan.philosophy}"</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h3 className={`text-xl font-semibold mb-4 text-${colorPalette.text.primary}`}>
              <span className="desert-road-font" style={desertFontStyle}>Specialized Skills</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {artisan.skills.map((skill, index) => (
                <div
                  key={index}
                  className={`p-4 bg-${colorPalette.primary.lightest} rounded text-center transform transition-transform duration-300 hover:scale-105`}
                >
                  <span className={`text-${colorPalette.text.primary} font-medium`}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workshop Images */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 text-${colorPalette.text.primary}`}>
            <span className="desert-road-font" style={desertFontStyle}>The Workshop</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img src="https://placehold.co/400x300/8b5a2b/ffffff?text=Workshop+View" alt="Workshop view" className="w-full h-64 object-cover rounded shadow transition-transform duration-300 hover:scale-105" />
            <img src="https://placehold.co/400x300/704820/ffffff?text=Leather+Tools" alt="Tools" className="w-full h-64 object-cover rounded shadow transition-transform duration-300 hover:scale-105" />
            <img src="https://placehold.co/400x300/5c4c35/ffffff?text=Leather+Selection" alt="Leather selection" className="w-full h-64 object-cover rounded shadow transition-transform duration-300 hover:scale-105" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
