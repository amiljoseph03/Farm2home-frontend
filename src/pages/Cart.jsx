import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await API.get('/cart');
      setCart(response.data.data.cart || response.data.data || null);
    } catch (error) {
      toast.error('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      await API.post('/cart', { productId, quantity: change });
      fetchCart(); // Recalculate totals
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      toast.success('Item removed from cart');
      fetchCart();
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }

    setCheckoutLoading(true);
    try {
      await API.post('/orders', { shippingAddress });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'Checkout failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-emerald-700 font-semibold">
        Loading your cart...
      </div>
    );
  }

  const items = cart?.items || [];

  // Price Calculation Fix: Schema-യിലെ pricePerUnit, price എന്നീ രണ്ട് ഫീൽഡുകളെയും support ചെയ്യുന്നു
  const totalPrice = items.reduce((acc, item) => {
    const itemPrice = item.product?.pricePerUnit ?? item.product?.price ?? 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <ShoppingBag className="w-7 h-7 text-emerald-600" />
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-sm mt-1 mb-6">
            Explore our catalog for fresh farm produce.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200 cursor-pointer"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const productId = item.product?._id || item.product;
              const price =
                item.product?.pricePerUnit ?? item.product?.price ?? 0;
              const imageSrc =
                item.product?.images?.[0] &&
                item.product?.images[0] !== 'default-product.jpg'
                  ? item.product.images[0]
                  : item.product?.imageUrl;

              return (
                <div
                  key={productId || item._id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-16 h-16 bg-emerald-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={item.product?.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        '🌾'
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 capitalize">
                        {item.product?.name || 'Product'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ₹{price} / {item.product?.unit || 'kg'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity Controller */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(productId, item.quantity, -1)
                        }
                        className="p-1.5 hover:bg-gray-100 text-gray-600 transition disabled:opacity-40"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-semibold text-gray-800 text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(productId, item.quantity, 1)
                        }
                        className="p-1.5 hover:bg-gray-100 text-gray-600 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="font-bold text-emerald-700 w-20 text-right">
                      ₹{price * item.quantity}
                    </span>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(productId)}
                      className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout / Order Summary Box */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-6">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-800">
                  ₹{totalPrice}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-800">
                <span>Total Amount</span>
                <span className="text-emerald-700">₹{totalPrice}</span>
              </div>
            </div>

            {/* Shipping Address Form */}
            <form onSubmit={handleCheckout} className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows="3"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="House Name/No., Street, City, Pincode"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={checkoutLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:opacity-50"
              >
                {checkoutLoading ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <span>Place Order (COD)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
