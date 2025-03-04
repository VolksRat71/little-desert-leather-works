import React, { useState } from 'react';
import { useDocumentTitle, useWebsite } from '../context/WebsiteContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const ContactPage = () => {
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

  // Get contact information from context
  const { contactInfo, colorPalette } = useWebsite();

  // Set document title
  useDocumentTitle('Contact Us');

  // Define contact form validation schema
  const contactSchema = yup.object({
    name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    email: yup.string().email('Must be a valid email').required('Email is required'),
    message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters')
  });

  // Set up react-hook-form with yup resolver
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(contactSchema)
  });

  // Handle form submission
  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    // Add your form submission logic here
    alert('Message sent! We will contact you soon.');
  };

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className={`bg-desert-black text-${colorPalette.text.light} px-6 py-12 rounded-t shadow`}>
          <h1 className="text-4xl font-bold mb-2 text-center">
            <span className="desert-road-font text-shadow" style={centeredDesertFontStyle}>Contact Us</span>
          </h1>
          <p className="text-xl text-center">We'd love to hear from you</p>
        </div>

        <div className={`bg-${colorPalette.ui.background} p-8 rounded-b shadow mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className={`text-xl font-bold mb-4 text-${colorPalette.text.primary}`}>
                <span className="desert-road-font" style={desertFontStyle}>Get In Touch</span>
              </h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className={`block text-${colorPalette.text.secondary} mb-2`} htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`w-full px-4 py-2 border ${errors.name ? `border-red-500` : `border-${colorPalette.ui.border}`} rounded focus:outline-none focus:ring-2 focus:ring-${colorPalette.primary.base} transition-all duration-300`}
                  />
                  {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="mb-4">
                  <label className={`block text-${colorPalette.text.secondary} mb-2`} htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`w-full px-4 py-2 border ${errors.email ? `border-red-500` : `border-${colorPalette.ui.border}`} rounded focus:outline-none focus:ring-2 focus:ring-${colorPalette.primary.base} transition-all duration-300`}
                  />
                  {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div className="mb-4">
                  <label className={`block text-${colorPalette.text.secondary} mb-2`} htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    {...register('message')}
                    className={`w-full px-4 py-2 border ${errors.message ? `border-red-500` : `border-${colorPalette.ui.border}`} rounded focus:outline-none focus:ring-2 focus:ring-${colorPalette.primary.base} transition-all duration-300`}
                  ></textarea>
                  {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>}
                </div>
                <button
                  type="submit"
                  className={`bg-${colorPalette.primary.base} text-${colorPalette.text.light} px-6 py-2 rounded hover:bg-${colorPalette.primary.dark} transition-all duration-300 transform hover:scale-105`}
                >
                  Send Message
                </button>
              </form>
            </div>
            <div>
              <h2 className={`text-xl font-bold mb-4 text-${colorPalette.text.primary}`}>
                <span className="desert-road-font" style={desertFontStyle}>Visit Our Workshop</span>
              </h2>
              <p className={`text-${colorPalette.text.secondary} mb-4`}>
                We're located in the heart of Austin, Texas. Feel free to stop by our workshop to see our craftsmanship in action.
              </p>
              {contactInfo.showAddress && (
                <div className={`p-4 bg-${colorPalette.primary.lightest} rounded mb-4`}>
                  <h3 className={`font-semibold mb-2 text-${colorPalette.text.primary}`}>
                    <span className="desert-road-font" style={desertFontStyle}>Address</span>
                  </h3>
                  <p className={`text-${colorPalette.text.secondary}`}>
                    {contactInfo.address.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        {index < contactInfo.address.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              )}
              <div className={`p-4 bg-${colorPalette.primary.lightest} rounded mb-4`}>
                <h3 className={`font-semibold mb-2 text-${colorPalette.text.primary}`}>
                  <span className="desert-road-font" style={desertFontStyle}>Hours</span>
                </h3>
                <p className={`text-${colorPalette.text.secondary}`}>
                  {contactInfo.hours.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < contactInfo.hours.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </div>
              <div className={`p-4 bg-${colorPalette.primary.lightest} rounded`}>
                <h3 className={`font-semibold mb-2 text-${colorPalette.text.primary}`}>
                  <span className="desert-road-font" style={desertFontStyle}>Contact</span>
                </h3>
                <p className={`text-${colorPalette.text.secondary}`}>
                  Email: {contactInfo.email}<br/>
                  {contactInfo.showPhone && <>Phone: {contactInfo.phone}</>}
                </p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          {contactInfo.showMap && (
            <div className={`bg-${colorPalette.primary.dark} h-64 rounded shadow flex items-center justify-center`}>
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.address)}&output=embed`}
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
