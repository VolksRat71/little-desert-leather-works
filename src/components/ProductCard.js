import React from 'react';
import { useWebsite } from '../context/WebsiteContext';

const ProductCard = ({ product }) => {
  const { navigate, colorPalette } = useWebsite();

  // Default classes if colorPalette isn't loaded yet
  const bgClass = colorPalette ? `bg-${colorPalette.ui?.background || 'stone-50'}` : 'bg-stone-50';
  const textSecondaryClass = colorPalette ? `text-${colorPalette.text?.secondary || 'gray-600'}` : 'text-gray-600';
  const textAccentClass = colorPalette ? `text-${colorPalette.text?.accent || 'amber-600'}` : 'text-amber-600';
  const bgButtonClass = colorPalette ? `bg-${colorPalette.secondary?.base || 'amber-700'}` : 'bg-amber-700';
  const textButtonClass = colorPalette ? `text-${colorPalette.text?.light || 'white'}` : 'text-white';
  const hoverButtonClass = colorPalette ? `hover:bg-${colorPalette.secondary?.light || 'amber-600'}` : 'hover:bg-amber-600';

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`${bgClass} rounded shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full flex flex-col block`}
    >
      <div className="overflow-hidden rounded-t">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 transform hover:scale-110"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className={`${textSecondaryClass} mb-4 flex-grow`}>{product.shortDescription}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className={`${textAccentClass} font-bold`}>{product.price}</span>
          <button
            className={`${bgButtonClass} ${textButtonClass} px-4 py-2 rounded text-sm ${hoverButtonClass} transition-colors duration-300`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent the card click event from firing
              navigate(`/product/${product.id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
