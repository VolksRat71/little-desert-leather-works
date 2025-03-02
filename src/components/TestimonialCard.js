import React from 'react';
import { colorPalette } from '../context/WebsiteContext';

const TestimonialCard = ({ testimonial }) => (
  <div className={`bg-${colorPalette.ui.background} p-6 rounded shadow-md transform transition-all duration-300 hover:shadow-lg h-full flex flex-col`}>
    <div className="flex items-center mb-4">
      <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
      <div>
        <h3 className="font-semibold">{testimonial.name}</h3>
        <p className={`text-${colorPalette.text.secondary} text-sm`}>{testimonial.location}</p>
      </div>
    </div>
    <p className={`italic text-${colorPalette.text.secondary} flex-grow`}>"{testimonial.testimonial}"</p>
  </div>
);

export default TestimonialCard;
