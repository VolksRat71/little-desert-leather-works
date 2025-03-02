import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Color palette as JSON for easy customization
export const colorPalette = {
  primary: {
    base: "amber-700",
    light: "amber-600",
    dark: "amber-800",
    hover: "amber-800",
    lightest: "amber-100",
    background: "amber-50"
  },
  secondary: {
    base: "stone-800",
    light: "stone-700",
    dark: "stone-900",
    background: "stone-100",
    lightest: "stone-50"
  },
  text: {
    primary: "stone-800",
    secondary: "stone-600",
    light: "amber-50",
    accent: "amber-700",
    medium: "stone-700",
    dark: "stone-900",
    lightest: "stone-50"
  },
  ui: {
    border: "stone-300",
    shadow: "stone-200",
    background: "white",
    darkBackground: "stone-800",
    lightBackground: "stone-50"
  }
};

// Fake data for products
export const products = [
  {
    id: 1,
    name: "Handcrafted Leather Wallet",
    description: "Vegetable-tanned full-grain leather wallet with hand-stitched details and multiple card slots. Each piece is burnished by hand for a smooth finish.",
    shortDescription: "Vegetable-tanned full-grain leather wallet with hand-stitched details.",
    price: "$95",
    image: "https://placehold.co/600x400/8b5a2b/ffffff?text=Leather+Wallet",
    images: [
      "https://placehold.co/600x400/8b5a2b/ffffff?text=Leather+Wallet",
      "https://placehold.co/600x400/704820/ffffff?text=Wallet+Open",
      "https://placehold.co/600x400/5c4c35/ffffff?text=Wallet+Details"
    ],
    features: [
      "Full-grain vegetable-tanned leather",
      "Saddle-stitched with waxed thread",
      "Six card slots and two hidden pockets",
      "Dimensions: 4.5\" x 3.5\"",
      "Available in Whiskey, Dark Brown, and Natural"
    ],
    careInstructions: "Condition with leather balm every 3-6 months. Avoid excessive moisture."
  },
  {
    id: 2,
    name: "Artisan Belt",
    description: "Custom-cut belt with solid brass buckle, handmade in Austin. Made from a single piece of 8-10oz leather for durability and longevity.",
    shortDescription: "Custom-cut belt with brass buckle, handmade in Austin.",
    price: "$120",
    image: "https://placehold.co/600x400/704820/ffffff?text=Leather+Belt",
    images: [
      "https://placehold.co/600x400/704820/ffffff?text=Leather+Belt",
      "https://placehold.co/600x400/8b5a2b/ffffff?text=Belt+Buckle",
      "https://placehold.co/600x400/5c4c35/ffffff?text=Belt+Detail"
    ],
    features: [
      "8-10oz full-grain leather",
      "Solid brass or nickel buckle",
      "Hand-beveled and burnished edges",
      "Width options: 1.25\" or 1.5\"",
      "Custom sizing available"
    ],
    careInstructions: "Clean with damp cloth and mild soap. Condition every 6 months."
  },
  {
    id: 3,
    name: "Desert Messenger Bag",
    description: "Rugged messenger bag with adjustable strap and antique hardware. Featuring a spacious main compartment and multiple organization pockets.",
    shortDescription: "Rugged messenger bag with adjustable strap and antique hardware.",
    price: "$275",
    image: "https://placehold.co/600x400/8b5a2b/ffffff?text=Messenger+Bag",
    images: [
      "https://placehold.co/600x400/8b5a2b/ffffff?text=Messenger+Bag",
      "https://placehold.co/600x400/704820/ffffff?text=Bag+Interior",
      "https://placehold.co/600x400/5c4c35/ffffff?text=Bag+Hardware"
    ],
    features: [
      "5-6oz full-grain oil-tanned leather",
      "Antique brass hardware",
      "Adjustable shoulder strap",
      "Cotton canvas lining",
      "Fits 15\" laptop",
      "Dimensions: 15\" x 11\" x 4\""
    ],
    careInstructions: "Wipe with damp cloth. Apply leather conditioner yearly or as needed."
  },
  {
    id: 4,
    name: "Leather Journal Cover",
    description: "Hand-tooled journal cover that will age beautifully with time. Designed to fit standard A5 notebooks with an easy replacement system.",
    shortDescription: "Hand-tooled journal cover that will age beautifully with time.",
    price: "$85",
    image: "https://placehold.co/600x400/704820/ffffff?text=Journal+Cover",
    images: [
      "https://placehold.co/600x400/704820/ffffff?text=Journal+Cover",
      "https://placehold.co/600x400/8b5a2b/ffffff?text=Journal+Open",
      "https://placehold.co/600x400/5c4c35/ffffff?text=Journal+Detail"
    ],
    features: [
      "4-5oz full-grain leather",
      "Fits standard A5 notebooks (5.8\" x 8.3\")",
      "Elastic band closure",
      "Bookmark ribbon",
      "Optional personalization available"
    ],
    careInstructions: "Keep dry. Apply leather conditioner when leather feels dry."
  }
];

// Fake testimonials
export const testimonials = [
  {
    id: 1,
    name: "Michael R.",
    location: "Dallas, TX",
    testimonial: "The craftsmanship on my wallet is incredible. After two years of daily use, it's developing a beautiful patina and holding up perfectly. It's rare to find goods made with this level of care these days.",
    image: "https://placehold.co/64x64/8b5a2b/ffffff?text=MR"
  },
  {
    id: 2,
    name: "Sarah J.",
    location: "Austin, TX",
    testimonial: "I commissioned a custom bag as a gift for my husband. The attention to detail and the personal touches make it truly one of a kind. The entire experience working with Little Desert Leather Works was exceptional.",
    image: "https://placehold.co/64x64/704820/ffffff?text=SJ"
  },
  {
    id: 3,
    name: "David M.",
    location: "Houston, TX",
    testimonial: "The belt I purchased has become my everyday favorite. The quality of the leather is unmatched by anything I've found elsewhere. I've already ordered two more in different colors.",
    image: "https://placehold.co/64x64/5c4c35/ffffff?text=DM"
  }
];

// Artisan information
export const artisan = {
  name: "Morgan E Ludemann",
  title: "Master Leather Craftsman",
  image: "https://placehold.co/600x800/8b5a2b/ffffff?text=James+Harrison",
  bio: "With over 15 years of experience working with leather, I bring traditional techniques and modern design to every piece I create. My journey began in my grandfather's workshop, where I learned that quality craftsmanship requires patience, precision, and passion. Today, I handcraft each item in my Austin studio, selecting only the finest full-grain leathers.\n\nI was drawn to leatherworking after a trip through the American Southwest, where I was captivated by the rugged beauty of the desert and the generations of artisans who worked with natural materials. The textures, colors, and resilience of the desert landscape continue to inspire my work.\n\nEvery stitch, every cut, and every burnished edge represents my commitment to creating heirloom-quality goods that will age beautifully and tell a story with time. I believe in creating pieces that become more beautiful with age and use – developing a rich patina that reflects their journey with you.",
  philosophy: "I believe in slow craft – taking the time needed to do things right. No shortcuts, no mass production. Just honest materials, traditional techniques, and meticulous attention to detail.",
  skills: ["Hand-stitching", "Tooling & Carving", "Dyeing & Finishing", "Pattern Making", "Custom Design"]
};

// Create website context
const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const [previousScrollPosition, setPreviousScrollPosition] = useState(0);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const location = useLocation();
  const navigateFunc = useNavigate();

  // Custom navigate function that includes transition effects
  const navigate = (path) => {
    if (path === location.pathname) return;

    // Scroll to top when navigating
    window.scrollTo(0, 0);

    // Trigger page transition animation
    setPageTransition(true);

    // Change route after animation starts
    setTimeout(() => {
      navigateFunc(path);
      // End transition
      setTimeout(() => {
        setPageTransition(false);
      }, 300);
    }, 300);

    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  // Handle scroll for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.pageYOffset;

      // Show/hide navbar based on scroll direction
      if (previousScrollPosition > currentScrollPosition || currentScrollPosition < 50) {
        setIsNavbarVisible(true);
      } else {
        setIsNavbarVisible(false);
      }

      setPreviousScrollPosition(currentScrollPosition);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [previousScrollPosition]);

  return (
    <WebsiteContext.Provider
      value={{
        currentRoute: location.pathname,
        navigate,
        isMenuOpen,
        setIsMenuOpen,
        pageTransition,
        isNavbarVisible,
        products,
        testimonials,
        artisan
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => useContext(WebsiteContext);

export default WebsiteContext;
