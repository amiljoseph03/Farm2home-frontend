import { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Search, ShoppingCart, Filter, Tag } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();

  // Backend Mongoose Schema-യിലുള്ള exact categories
  const categories = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains',
    'Pulses',
    'Spices',
    'Organic Fertilizers',
    'Seeds',
    'Other',
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products');
      // ബാക്കെൻഡ് റെസ്‌പോൺസ് സ്ട്രക്ചർ അനുസരിച്ച് ഡാറ്റ എടുക്കുന്നു
      setProducts(response.data.data.products || response.data.data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await API.post('/cart', { productId, quantity: 1 });
      toast.success('Product added to cart!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add to cart';
      toast.error(errorMsg);
    }
  };

  // Search & Category Filter Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Fresh Farm Produce
          </h1>
          <p className="text-gray-500 text-sm">
            Directly from verified local farmers
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-64"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white w-full sm:w-48 appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 text-emerald-700 font-semibold">
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            No products found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            // Schema-യും Frontend-ഉം തമ്മിലുള്ള mapping
            const price = product.pricePerUnit ?? product.price ?? 0;
            const stock = product.quantityAvailable ?? product.stock ?? 0;
            const sellerName =
              product.seller?.name || product.farmer?.name || 'Verified Farmer';

            // Image handling (Schema supports images array)
            const imageSrc =
              product.images?.[0] && product.images[0] !== 'default-product.jpg'
                ? product.images[0]
                : product.imageUrl;

            return (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 border border-gray-100 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="h-48 bg-emerald-50 flex items-center justify-center overflow-hidden">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🌾</span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-gray-800 text-lg capitalize">
                        {product.name}
                      </h3>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                        {product.category || 'Produce'}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {product.description ||
                        'Fresh agricultural product sourced directly.'}
                    </p>

                    <div className="text-xs text-gray-500 mb-2">
                      Seller:{' '}
                      <span className="font-medium text-gray-700">
                        {sellerName}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline mt-2">
                      <span className="text-xl font-bold text-emerald-700">
                        ₹{price}{' '}
                        <span className="text-xs font-normal text-gray-500">
                          / {product.unit || 'kg'}
                        </span>
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          stock > 0 ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        {stock > 0 ? `Stock: ${stock}` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-4 pt-0">
                  {user?.role === 'buyer' || !user ? (
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={stock <= 0}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <div className="text-center text-xs text-gray-400 py-2 border-t border-gray-100">
                      Farmer Account
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
