import React, { useState, useRef } from 'react';
import { useWebsite } from '../../context/WebsiteContext';

const AboutSection = () => {
  const { artisan, updateArtisanInfo } = useWebsite();
  const [editedArtisan, setEditedArtisan] = useState({ ...artisan });
  const [skills, setSkills] = useState(artisan.skills.join('\n'));
  const [isVisible, setIsVisible] = useState(artisan.isVisible !== false); // Default to true if not specified
  const fileInputRef = useRef(null);

  const handleSaveArtisanInfo = () => {
    // Convert skills from textarea (newline-separated) to array
    const skillsArray = skills.split('\n').filter(skill => skill.trim() !== '');

    // Update artisan info with the skills array and visibility
    const updatedArtisan = {
      ...editedArtisan,
      skills: skillsArray,
      isVisible: isVisible
    };

    updateArtisanInfo(updatedArtisan);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setEditedArtisan({ ...editedArtisan, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">About the Artisan</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Artisan Photo</label>
            {editedArtisan.image && (
              <div className="mt-2 mb-3 border rounded p-2">
                <img src={editedArtisan.image} alt="Artisan Preview" className="w-full h-auto" />
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={editedArtisan.image}
                onChange={(e) => setEditedArtisan({ ...editedArtisan, image: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Enter image URL or upload below"
              />

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Image
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center text-gray-700 font-medium">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span>Visible on Website</span>
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-7">
              {isVisible
                ? "About section is currently visible to visitors"
                : "About section is currently hidden from visitors"}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Name</label>
            <input
              type="text"
              value={editedArtisan.name}
              onChange={(e) => setEditedArtisan({ ...editedArtisan, name: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              value={editedArtisan.title}
              onChange={(e) => setEditedArtisan({ ...editedArtisan, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Biography</label>
            <textarea
              value={editedArtisan.bio}
              onChange={(e) => setEditedArtisan({ ...editedArtisan, bio: e.target.value })}
              className="w-full p-2 border rounded h-48"
              placeholder="Enter the artisan's biography here..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Crafting Philosophy</label>
            <textarea
              value={editedArtisan.philosophy}
              onChange={(e) => setEditedArtisan({ ...editedArtisan, philosophy: e.target.value })}
              className="w-full p-2 border rounded h-24"
              placeholder="Enter the artisan's crafting philosophy..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Skills (one per line)</label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full p-2 border rounded h-24"
              placeholder="Enter skills, one per line..."
            />
            <p className="text-sm text-gray-500 mt-1">Enter each skill on a new line.</p>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={handleSaveArtisanInfo}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
