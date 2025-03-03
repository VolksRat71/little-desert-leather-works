import React, { useState } from 'react';
import { useWebsite } from '../../context/WebsiteContext';

const AboutSection = () => {
  const { artisan, updateArtisanInfo } = useWebsite();
  const [editedArtisan, setEditedArtisan] = useState({ ...artisan });
  const [skills, setSkills] = useState(artisan.skills.join('\n'));

  const handleSaveArtisanInfo = () => {
    // Convert skills from textarea (newline-separated) to array
    const skillsArray = skills.split('\n').filter(skill => skill.trim() !== '');

    // Update artisan info with the skills array
    const updatedArtisan = {
      ...editedArtisan,
      skills: skillsArray
    };

    updateArtisanInfo(updatedArtisan);
  };

  return (
    <div className="animate-fadeIn">
      <h2 className="text-xl font-semibold mb-4">About the Artisan</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Artisan Photo URL</label>
            <input
              type="text"
              value={editedArtisan.image}
              onChange={(e) => setEditedArtisan({ ...editedArtisan, image: e.target.value })}
              className="w-full p-2 border rounded"
            />

            {editedArtisan.image && (
              <div className="mt-2 border rounded p-2">
                <img src={editedArtisan.image} alt="Artisan Preview" className="w-full h-auto" />
              </div>
            )}
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
