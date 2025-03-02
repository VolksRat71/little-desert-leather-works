import React from 'react';
import { colorPalette } from '../context/WebsiteContext';

const ContactPage = () => (
  <div className="pt-24 pb-16 px-4">
    <div className="max-w-4xl mx-auto">
      <div className={`bg-${colorPalette.primary.base} text-${colorPalette.text.light} px-6 py-12 rounded-t shadow`}>
        <h1 className="text-4xl font-bold mb-2 text-center">Contact Us</h1>
        <p className="text-xl text-center">We'd love to hear from you</p>
      </div>

      <div className={`bg-${colorPalette.ui.background} p-8 rounded-b shadow mb-8`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className={`text-xl font-bold mb-4 text-${colorPalette.text.primary}`}>Get In Touch</h2>
            <form>
              <div className="mb-4">
                <label className={`block text-${colorPalette.text.secondary} mb-2`} htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className={`w-full px-4 py-2 border border-${colorPalette.ui.border} rounded focus:outline-none focus:ring-2 focus:ring-${colorPalette.primary.base} transition-all duration-300`}
                />
              </div>
              <div className="mb-4">
                <label className={`block text-${colorPalette.text.secondary} mb-2`} htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className={`w-full px-4 py-2 border border-${colorPalette.ui.border} rounded focus:outline-none focus:ring-2 focus:ring-${colorPalette.primary.base} transition-all duration-300`}
                />
              </div>
              <div className="mb-4">
                <label className={`block text-${colorPalette.text.secondary} mb-2`} htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  className={`w-full px-4 py-2 border border-${colorPalette.ui.border} rounded focus:outline-none focus:ring-2 focus:ring-${colorPalette.primary.base} transition-all duration-300`}
                ></textarea>
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
            <h2 className={`text-xl font-bold mb-4 text-${colorPalette.text.primary}`}>Visit Our Workshop</h2>
            <p className={`text-${colorPalette.text.secondary} mb-4`}>
              We're located in the heart of Austin, Texas. Feel free to stop by our workshop to see our craftsmanship in action.
            </p>
            <div className={`p-4 bg-${colorPalette.primary.lightest} rounded mb-4`}>
              <h3 className={`font-semibold mb-2 text-${colorPalette.text.primary}`}>Address</h3>
              <p className={`text-${colorPalette.text.secondary}`}>
                2345 Leather Lane<br/>
                Austin, TX 78701
              </p>
            </div>
            <div className={`p-4 bg-${colorPalette.primary.lightest} rounded mb-4`}>
              <h3 className={`font-semibold mb-2 text-${colorPalette.text.primary}`}>Hours</h3>
              <p className={`text-${colorPalette.text.secondary}`}>
                Monday - Friday: 10am - 6pm<br/>
                Saturday: 11am - 5pm<br/>
                Sunday: Closed
              </p>
            </div>
            <div className={`p-4 bg-${colorPalette.primary.lightest} rounded`}>
              <h3 className={`font-semibold mb-2 text-${colorPalette.text.primary}`}>Contact</h3>
              <p className={`text-${colorPalette.text.secondary}`}>
                Email: hello@littledesertleather.com<br/>
                Phone: (512) 555-0127
              </p>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className={`bg-${colorPalette.secondary.background} h-64 rounded shadow flex items-center justify-center`}>
          <p className={`text-${colorPalette.text.secondary}`}>Map Placeholder</p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
