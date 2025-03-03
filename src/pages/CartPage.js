import React, { useState } from 'react';
import { useWebsite, colorPalette, useDocumentTitle } from '../context/WebsiteContext';

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    navigate
  } = useWebsite();

  // Set document title
  useDocumentTitle('Shopping Cart');

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    updateCartQuantity(productId, parseInt(newQuantity));
  };

  // Calculate formatted cart total with dollar sign
  const formattedTotal = `$${getCartTotal()}`;

  return (
    <div className="pb-16 pt-16 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 text-${colorPalette.text.primary}`}>Your Shopping Cart</h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart Items - 2/3 width on medium screens and up */}
            <div className="md:col-span-2">
              <div className={`p-4 bg-white rounded shadow mb-4`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-xl font-semibold text-${colorPalette.text.primary}`}>Items ({cart.length})</h2>
                  <button
                    onClick={clearCart}
                    className={`text-sm text-${colorPalette.text.secondary} hover:text-${colorPalette.primary.base}`}
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="divide-y">
                  {cart.map(item => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 mb-3 sm:mb-0 sm:mr-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <h3 className={`text-lg font-medium text-${colorPalette.text.primary} mb-1`}>
                          {item.name}
                        </h3>
                        <p className={`text-${colorPalette.text.secondary} text-sm mb-2`}>
                          {item.price}
                        </p>

                        {/* Quantity and Remove Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
                            <select
                              id={`quantity-${item.id}`}
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              className={`p-1 border border-${colorPalette.ui.border} rounded w-16 focus:ring-2 focus:ring-${colorPalette.primary.base} focus:outline-none`}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className={`text-${colorPalette.text.secondary} hover:text-red-600 text-sm`}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-4">
                <button
                  onClick={() => navigate('/products')}
                  className={`text-${colorPalette.primary.base} hover:underline focus:outline-none`}
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>

            {/* Order Summary - 1/3 width on medium screens and up */}
            <div className="md:col-span-1">
              <div className={`p-4 bg-white rounded shadow sticky top-20`}>
                <h2 className={`text-xl font-semibold mb-4 text-${colorPalette.text.primary}`}>Order Summary</h2>

                {/* Summary Details */}
                <div className={`text-${colorPalette.text.secondary} space-y-3 mb-4 text-sm`}>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formattedTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                {/* Total */}
                <div className={`flex justify-between pt-3 border-t border-${colorPalette.ui.border} mb-6`}>
                  <span className={`font-semibold text-${colorPalette.text.primary}`}>Estimated Total</span>
                  <span className={`font-semibold text-${colorPalette.text.primary}`}>{formattedTotal}</span>
                </div>

                {/* Checkout Button */}
                <button
                  className={`w-full py-3 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.dark} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-${colorPalette.primary.base} focus:ring-opacity-50`}
                >
                  Proceed to Checkout
                </button>

                {/* Payment Methods */}
                <div className="mt-4 text-center">
                  <p className={`text-xs text-${colorPalette.text.secondary} mb-2`}>We Accept</p>
                  <div className="flex justify-center space-x-2">
                    <div className={`w-10 h-6 bg-${colorPalette.ui.border} rounded`}></div>
                    <div className={`w-10 h-6 bg-${colorPalette.ui.border} rounded`}></div>
                    <div className={`w-10 h-6 bg-${colorPalette.ui.border} rounded`}></div>
                    <div className={`w-10 h-6 bg-${colorPalette.ui.border} rounded`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={`text-center p-12 bg-white rounded shadow`}>
            <div className={`text-6xl text-${colorPalette.text.secondary} mb-4`}>
              🛒
            </div>
            <h2 className={`text-2xl font-semibold mb-4 text-${colorPalette.text.primary}`}>Your cart is empty</h2>
            <p className={`text-${colorPalette.text.secondary} mb-6`}>
              Looks like you haven't added any products to your cart yet.
            </p>
            <button
              onClick={() => navigate('/products')}
              className={`px-6 py-3 bg-${colorPalette.primary.base} text-white rounded hover:bg-${colorPalette.primary.dark} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-${colorPalette.primary.base} focus:ring-opacity-50`}
            >
              Browse Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
