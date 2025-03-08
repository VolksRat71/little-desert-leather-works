import * as yup from 'yup';

// Product validation schema
export const productSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  shortDescription: yup.string().required('Short description is required').min(10, 'Short description must be at least 10 characters').max(200, 'Short description must be less than 200 characters'),
  description: yup.string().required('Description is required').min(20, 'Description must be at least 20 characters').max(2000, 'Description must be less than 2000 characters'),
  price: yup.string().required('Price is required').matches(/^\$\d+(\.\d{1,2})?$/, 'Price must be in format $XX.XX'),
  image: yup.string().url('Image must be a valid URL').required('Image URL is required'),
  images: yup.array().of(yup.string().url('All images must be valid URLs')),
  features: yup.array().of(yup.string()),
  careInstructions: yup.string(),
  isVisible: yup.boolean().default(true)
});

// User validation schema
export const userSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: yup.string().email('Must be a valid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  phone: yup.string().matches(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX'),
  address: yup.string(),
  profileImage: yup.string().url('Profile image must be a valid URL').nullable(),
  role: yup.string().oneOf(['User', 'Admin'], 'Role must be either User or Admin').default('User'),
  marketingPreferences: yup.object({
    emailOffers: yup.boolean().default(false),
    textOffers: yup.boolean().default(false),
    orderUpdates: yup.boolean().default(true)
  })
});

// Order validation schema
export const orderSchema = yup.object({
  userId: yup.number().required('User ID is required'),
  status: yup.string()
    .oneOf(
      ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      'Status must be pending, processing, shipped, delivered, or cancelled'
    )
    .default('pending'),
  items: yup.array().of(
    yup.object({
      productId: yup.number().required('Product ID is required'),
      quantity: yup.number().integer().min(1, 'Quantity must be at least 1').required('Quantity is required'),
      price: yup.string().required('Price is required').matches(/^\$\d+(\.\d{1,2})?$/, 'Price must be in format $XX.XX')
    })
  ),
  shippingAddress: yup.string().required('Shipping address is required'),
  billingAddress: yup.string().required('Billing address is required'),
  paymentMethod: yup.string().required('Payment method is required'),
  subtotal: yup.string().required('Subtotal is required').matches(/^\$\d+(\.\d{1,2})?$/, 'Subtotal must be in format $XX.XX'),
  tax: yup.string().required('Tax is required').matches(/^\$\d+(\.\d{1,2})?$/, 'Tax must be in format $XX.XX'),
  shipping: yup.string().required('Shipping cost is required').matches(/^\$\d+(\.\d{1,2})?$/, 'Shipping must be in format $XX.XX'),
  total: yup.string().required('Total is required').matches(/^\$\d+(\.\d{1,2})?$/, 'Total must be in format $XX.XX'),
  discount: yup.string().matches(/^\$\d+(\.\d{1,2})?$/, 'Discount must be in format $XX.XX').nullable(),
  promoCode: yup.string().nullable(),
  notes: yup.string().nullable()
});

// Testimonial validation schema
export const testimonialSchema = yup.object({
  author: yup.string().required('Author name is required').min(2, 'Author name must be at least 2 characters').max(100, 'Author name must be less than 100 characters'),
  content: yup.string().required('Content is required').min(10, 'Content must be at least 10 characters').max(500, 'Content must be less than 500 characters'),
  rating: yup.number().integer().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').required('Rating is required'),
  date: yup.date().required('Date is required'),
  isVisible: yup.boolean().default(true)
});

// Campaign validation schema
export const campaignSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters').max(100, 'Name must be less than 100 characters'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().min(
    yup.ref('startDate'),
    'End date must be after start date'
  ),
  discountType: yup.string().oneOf(['percentage', 'fixed'], 'Discount type must be percentage or fixed').required('Discount type is required'),
  discountValue: yup.number().required('Discount value is required')
    .when('discountType', {
      is: 'percentage',
      then: (schema) => schema.min(1, 'Percentage must be at least 1').max(100, 'Percentage must be at most 100'),
      otherwise: (schema) => schema.min(1, 'Value must be at least 1')
    }),
  promoCode: yup.string().required('Promo code is required').matches(/^[a-zA-Z0-9]{4,20}$/, 'Promo code must be alphanumeric and 4-20 characters'),
  isActive: yup.boolean().default(false),
  targetAudience: yup.string().oneOf(['all', 'new', 'returning'], 'Target audience must be all, new, or returning').default('all'),
  minimumPurchase: yup.number().min(0, 'Minimum purchase cannot be negative').default(0)
});
