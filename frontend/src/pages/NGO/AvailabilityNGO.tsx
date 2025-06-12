import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/NgoBadge';
import GlowingText from '@/components/ui/GlowingText';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Eye,
  Share2,
  BookmarkPlus,
  ChefHat,
  TrendingUp,
  Package,
  Users,
  Star,
  ChevronDown,
  X,
  Plus,
  Heart
} from 'lucide-react';

const AvailabilityNGO: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const foodItems = [
    {
      id: 1,
      name: 'Fresh Pasta & Marinara',
      restaurant: 'Mario\'s Italian Kitchen',
      quantity: '12 servings',
      expiry: '2 hours',
      category: 'Prepared Meals',
      dietary: ['Vegetarian'],
      distance: '0.8 miles',
      image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=300',
      status: 'Available',
      rating: 4.8,
      estimatedValue: '$45',
      pickupWindow: '2:00 PM - 4:00 PM'
    },
    {
      id: 2,
      name: 'Artisan Bread & Pastries',
      restaurant: 'Golden Grain Bakery',
      quantity: '25 items',
      expiry: '4 hours',
      category: 'Bakery',
      dietary: ['Vegan Options'],
      distance: '1.2 miles',
      image: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=300',
      status: 'Available',
      rating: 4.9,
      estimatedValue: '$75',
      pickupWindow: '3:00 PM - 6:00 PM'
    },
    {
      id: 3,
      name: 'Mixed Green Salads',
      restaurant: 'Fresh Garden Bistro',
      quantity: '8 portions',
      expiry: '1 hour',
      category: 'Produce',
      dietary: ['Vegan', 'Gluten-Free'],
      distance: '0.5 miles',
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
      status: 'Reserved',
      rating: 4.7,
      estimatedValue: '$32',
      pickupWindow: '1:00 PM - 2:00 PM'
    },
    {
      id: 4,
      name: 'Grilled Chicken & Vegetables',
      restaurant: 'Healthy Bites Cafe',
      quantity: '15 meals',
      expiry: '3 hours',
      category: 'Prepared Meals',
      dietary: ['High Protein', 'Low Carb'],
      distance: '2.1 miles',
      image: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg?auto=compress&cs=tinysrgb&w=300',
      status: 'Available',
      rating: 4.6,
      estimatedValue: '$85',
      pickupWindow: '4:00 PM - 7:00 PM'
    },
    {
      id: 5,
      name: 'Seasonal Fruit Mix',
      restaurant: 'Corner Market Deli',
      quantity: '20 lbs',
      expiry: '6 hours',
      category: 'Produce',
      dietary: ['Organic', 'Vegan'],
      distance: '1.8 miles',
      image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=300',
      status: 'Available',
      rating: 4.5,
      estimatedValue: '$60',
      pickupWindow: '5:00 PM - 8:00 PM'
    },
    {
      id: 6,
      name: 'Packaged Snacks & Beverages',
      restaurant: 'Campus Coffee House',
      quantity: '30 items',
      expiry: '12 hours',
      category: 'Packaged Goods',
      dietary: ['Various'],
      distance: '0.3 miles',
      image: 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=300',
      status: 'Available',
      rating: 4.4,
      estimatedValue: '$90',
      pickupWindow: '6:00 PM - 9:00 PM'
    },
  ];

  const filters = [
    { id: 'all', label: 'All Items', count: foodItems.length },
    { id: 'prepared', label: 'Prepared Meals', count: foodItems.filter(item => item.category === 'Prepared Meals').length },
    { id: 'produce', label: 'Fresh Produce', count: foodItems.filter(item => item.category === 'Produce').length },
    { id: 'bakery', label: 'Bakery Items', count: foodItems.filter(item => item.category === 'Bakery').length },
    { id: 'packaged', label: 'Packaged Goods', count: foodItems.filter(item => item.category === 'Packaged Goods').length },
  ];

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.restaurant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         item.category.toLowerCase().includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const totalItems = filteredItems.length;
  const availableItems = filteredItems.filter(item => item.status === 'Available').length;
  const nearestExpiry = Math.min(...filteredItems.map(item => parseInt(item.expiry)));
  const totalValue = filteredItems.reduce((sum, item) => sum + parseFloat(item.estimatedValue.replace('$', '')), 0);

  const stats = [
    { 
      title: 'Available Items', 
      value: availableItems.toString(), 
      unit: 'ready for pickup', 
      icon: Package, 
      change: '+5 new today',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      title: 'Total Value', 
      value: `$${totalValue.toFixed(0)}`, 
      unit: 'estimated worth', 
      icon: TrendingUp, 
      change: '+$120 today',
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      title: 'Nearest Expiry', 
      value: `${nearestExpiry}h`, 
      unit: 'time remaining', 
      icon: Clock, 
      change: 'Act fast!',
      gradient: 'from-red-500 to-red-600'
    },
    { 
      title: 'Partner Restaurants', 
      value: new Set(filteredItems.map(item => item.restaurant)).size.toString(), 
      unit: 'active donors', 
      icon: Users, 
      change: 'Growing network',
      gradient: 'from-blue-500 to-blue-600'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available{' '}
            <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                            Food{' '}
                          </span>
          </h1>
          <p className="text-gray-600 text-lg">Fresh donations ready for pickup from our partner restaurants</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMap(!showMap)}
            className={`px-6 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 ${
              showMap 
                ? 'bg-gradient-to-r from-green-500 to-orange-500 text-white shadow-lg' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center space-x-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            <span>Request Food</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="success" size="sm">{stat.change}</Badge>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.unit}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by food item or restaurant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {filters.map(filter => (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap flex items-center space-x-2 ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-green-500 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{filter.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedFilter === filter.id ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                }`}>
                  {filter.count}
                </span>
              </motion.button>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>More</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="text-sm text-gray-600 mb-2">Quick Filters:</div>
              <div className="flex flex-wrap gap-2">
                {['Expiring Soon', 'High Value', 'Nearby', 'Vegetarian', 'Large Quantity'].map((filter) => (
                  <button
                    key={filter}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors duration-200"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Interactive Map */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="overflow-hidden">
              <div className="h-80 bg-gradient-to-br from-green-50 to-orange-50 border-2 border-dashed border-green-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <MapPin className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Food Map</h3>
                    <p className="text-gray-600 mb-1">Visualize all available food donations across the city</p>
                    <p className="text-sm text-green-600 font-medium">{filteredItems.length} items displayed</p>
                  </div>
                </div>
                {/* Decorative animated pins */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute top-8 right-8 w-2 h-2 bg-orange-400 rounded-full"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-6 left-12 w-2 h-2 bg-blue-400 rounded-full"
                />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge 
                    variant={item.status === 'Available' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                  <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{item.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{item.expiry} left</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                  {item.estimatedValue}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-green-600 transition-colors duration-200">
                  {item.name}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <ChefHat className="w-4 h-4 mr-2" />
                  <span className="text-sm">{item.restaurant}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{item.distance}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.dietary.map((diet, index) => (
                    <Badge key={index} variant="info" size="sm">
                      {diet}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Quantity</div>
                    <div className="font-semibold text-gray-900">{item.quantity}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Pickup Window</div>
                    <div className="font-semibold text-gray-900">{item.pickupWindow}</div>
                  </div>
                </div>
                
                {/* Hover Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-orange-500 text-white py-3 px-4 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Reserve Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Heart className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No food items found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters to find available donations.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSearchTerm('');
              setSelectedFilter('all');
            }}
            className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Clear Filters
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default AvailabilityNGO;