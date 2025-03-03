import React from 'react';
import { useWebsite, colorPalette } from '../context/WebsiteContext';

const ProductCard = ({ product }) => {
  const { navigate } = useWebsite();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-${colorPalette.ui.background} rounded shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full flex flex-col block`}
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
        <p className={`text-${colorPalette.text.secondary} mb-4 flex-grow`}>{product.shortDescription}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className={`text-${colorPalette.text.accent} font-bold`}>{product.price}</span>
          <button
            className={`bg-${colorPalette.secondary.base} text-${colorPalette.text.light} px-4 py-2 rounded text-sm hover:bg-${colorPalette.secondary.light} transition-colors duration-300`}
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
