// User data placeholders
export const users = [
  {
    id: 1,
    name: 'Morgan Ludemann',
    email: 'morgan@littledesertleatherworks.com',
    phone: '(512) 555-1234',
    address: '123 Main St, Austin, TX 78701',
    profileImage: 'https://res.cloudinary.com/notsupreme/image/upload/v1741109031/egk8wjdmjhgctiysphv6.png',
    role: 'Admin',
    lastLogin: '2023-03-15',
    marketingPreferences: {
      emailOffers: true,
      textOffers: false,
      orderUpdates: true
    }
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '(555) 987-6543',
    address: '456 Admin Ave, Austin, TX 78702',
    profileImage: 'https://placehold.co/200x200/amber700/ffffff?text=AU',
    role: 'Admin',
    lastLogin: '2023-03-16',
    marketingPreferences: {
      emailOffers: true,
      textOffers: true,
      orderUpdates: true
    }
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    lastLogin: '2023-03-12',
    phone: '(555) 456-7890',
    address: '789 Customer Blvd, Austin, TX 78745',
    profileImage: 'https://placehold.co/200x200/amber700/ffffff?text=JS',
    marketingPreferences: {
      emailOffers: false,
      textOffers: false,
      orderUpdates: true
    }
  }
];

export default users;
