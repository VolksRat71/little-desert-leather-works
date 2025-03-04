import React from 'react';
import { useWebsite } from '../context/WebsiteContext';
import { useTheme } from '../hooks/useTheme';
import Button from './Button';

const ProductCard = ({ product }) => {
  const { navigate } = useWebsite();
  const theme = useTheme();

  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div
      className={`${theme.bg('ui.background', 'white')} shadow-md rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg`}
      onClick={handleClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className={`${theme.text('text.primary', 'gray-900')} font-bold text-lg mb-1`}>{product.name}</h3>
        <p className={`${theme.text('text.secondary', 'gray-600')} text-sm mb-2 line-clamp-2`}>{product.shortDescription}</p>
        <div className="flex justify-between items-center">
          <span className={`${theme.text('text.accent', 'amber-600')} font-bold`}>{product.price}</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
