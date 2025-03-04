// Testimonials data placeholders
export const testimonials = [
  {
    id: 1,
    name: "Michael R.",
    location: "Dallas, TX",
    testimonial: "The craftsmanship on my wallet is incredible. After two years of daily use, it's developing a beautiful patina and holding up perfectly. It's rare to find goods made with this level of care these days.",
    image: "https://placehold.co/64x64/8b5a2b/ffffff?text=MR",
    isVisible: true
  },
  {
    id: 2,
    name: "Sarah J.",
    location: "Austin, TX",
    testimonial: "I commissioned a custom bag as a gift for my husband. The attention to detail and the personal touches make it truly one of a kind. The entire experience working with Little Desert Leather Works was exceptional.",
    image: "https://placehold.co/64x64/704820/ffffff?text=SJ",
    isVisible: true
  },
  {
    id: 3,
    name: "David M.",
    location: "Houston, TX",
    testimonial: "The belt I purchased has become my everyday favorite. The quality of the leather is unmatched by anything I've found elsewhere. I've already ordered two more in different colors.",
    image: "https://placehold.co/64x64/5c4c35/ffffff?text=DM",
    isVisible: true
  }
];

// Marketing campaigns data placeholders
export const marketingCampaigns = [
  {
    id: 1,
    name: "Summer Sale 2023",
    type: "site-wide",
    discountType: "percentage",
    discountValue: 20,
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    isActive: true,
    heroImage: "https://placehold.co/1200x400/8b5a2b/ffffff?text=Summer+Sale+20%+Off",
    description: "Summer sale with 20% off all products",
    promoCode: "SUMMER20"
  },
  {
    id: 2,
    name: "New Customer Discount",
    type: "individual",
    discountType: "percentage",
    discountValue: 15,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    isActive: true,
    heroImage: "https://placehold.co/1200x400/8b5a2b/ffffff?text=New+Customer+15%+Off",
    description: "15% off your first purchase",
    promoCode: "NEWCUSTOMER15"
  },
  {
    id: 3,
    name: "Holiday Bundle",
    type: "product",
    discountType: "fixed",
    discountValue: 75,
    startDate: "2023-11-15",
    endDate: "2023-12-31",
    isActive: false,
    heroImage: "https://placehold.co/1200x400/8b5a2b/ffffff?text=Holiday+Bundle+$75+Off",
    description: "Save $75 when you buy any two items",
    promoCode: "HOLIDAY75"
  }
];

export default {
  testimonials,
  marketingCampaigns
};
