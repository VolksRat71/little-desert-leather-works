// Orders data placeholders
export const orders = [
  {
    id: 1,
    userId: 1,
    status: 'delivered',
    orderDate: '2023-02-15',
    items: [
      {
        productId: 1,
        quantity: 1,
        price: '$695'
      }
    ],
    shippingAddress: '123 Main St, Austin, TX 78701',
    billingAddress: '123 Main St, Austin, TX 78701',
    paymentMethod: 'Credit Card',
    subtotal: '$695',
    tax: '$57.34',
    shipping: '$0',
    total: '$752.34',
    notes: 'Please leave by the front door'
  },
  {
    id: 2,
    userId: 1,
    status: 'shipped',
    orderDate: '2023-03-10',
    items: [
      {
        productId: 2,
        quantity: 1,
        price: '$450'
      }
    ],
    shippingAddress: '123 Main St, Austin, TX 78701',
    billingAddress: '123 Main St, Austin, TX 78701',
    paymentMethod: 'PayPal',
    subtotal: '$450',
    tax: '$37.13',
    shipping: '$0',
    total: '$487.13',
    notes: ''
  },
  {
    id: 3,
    userId: 3,
    status: 'processing',
    orderDate: '2023-03-18',
    items: [
      {
        productId: 3,
        quantity: 1,
        price: '$525'
      },
      {
        productId: 2,
        quantity: 1,
        price: '$450'
      }
    ],
    shippingAddress: '789 Customer Blvd, Austin, TX 78745',
    billingAddress: '789 Customer Blvd, Austin, TX 78745',
    paymentMethod: 'Credit Card',
    subtotal: '$975',
    tax: '$80.44',
    shipping: '$0',
    total: '$1055.44',
    notes: 'Gift wrap please'
  },
  {
    id: 4,
    userId: 2,
    status: 'pending',
    orderDate: '2023-03-20',
    items: [
      {
        productId: 1,
        quantity: 2,
        price: '$695'
      }
    ],
    shippingAddress: '456 Admin Ave, Austin, TX 78702',
    billingAddress: '456 Admin Ave, Austin, TX 78702',
    paymentMethod: 'Credit Card',
    subtotal: '$1390',
    tax: '$114.68',
    shipping: '$0',
    total: '$1504.68',
    notes: ''
  }
];

export default orders;
