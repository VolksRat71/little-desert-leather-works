// Testimonials data placeholders
export const testimonials = [
  {
    id: 1,
    name: "Michael R.",
    location: "Dallas, TX",
    content: "I've had my travel duffle for 5 years now and it's only getting better with age. The craftsmanship is unmatched.",
    rating: 5,
    date: "2022-11-15",
    isVisible: true
  },
  {
    id: 2,
    name: "Sarah T.",
    location: "Chicago, IL",
    content: "Beautiful leather goods that are both functional and luxurious. The messenger bag is my daily companion for work.",
    rating: 5,
    date: "2023-01-22",
    isVisible: true
  },
  {
    id: 3,
    name: "James L.",
    location: "Austin, TX",
    content: "Exceptional quality and surprisingly practical. I use the backpack for both business travel and weekend adventures.",
    rating: 4,
    date: "2023-02-18",
    isVisible: true
  },
  {
    id: 4,
    name: "Emily W.",
    location: "San Francisco, CA",
    content: "These leather goods are investment pieces that will last a lifetime. Worth every penny.",
    rating: 5,
    date: "2023-03-05",
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
