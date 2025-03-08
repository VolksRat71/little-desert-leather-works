import React from 'react';
import { useTheme } from '../hooks/useTheme';

const TestimonialCard = ({ testimonial }) => {
  const theme = useTheme();

  return (
    <div className={`${theme.bg('ui.background', 'stone-50')} p-6 rounded shadow-md transform transition-all duration-300 hover:shadow-lg h-full flex flex-col`}>
      <div className="flex items-center mb-4">
        <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h3 className="font-semibold">{testimonial.name}</h3>
          <p className={`${theme.text('text.secondary', 'gray-600')} text-sm`}>{testimonial.location}</p>
        </div>
      </div>
      <p className={`italic ${theme.text('text.secondary', 'gray-600')} flex-grow`}>"{testimonial.testimonial}"</p>
    </div>
  );
};

export default TestimonialCard;
