import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/NgoBadge';
import GlowingText from '@/components/ui/GlowingText';
import { 
  Search, 
  Plus, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  MessageCircle,
  Edit,
  UserMinus,
  Star,
  TrendingUp,
  Users,
  Package,
  Filter,
  X,
  ChevronDown
} from 'lucide-react';

const Partners: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const partners = [
    {
      id: 1,
      name: 'Mario\'s Italian Kitchen',
      logo: '🍝',
      address: '123 Main St, Downtown',
      phone: '(555) 123-4567',
      email: 'mario@italikitchen.com',
      cuisine: 'Italian',
      status: 'Active',
      lastPickup: '2024-01-14',
      totalDonations: '2,450 lbs',
      totalPickups: 47,
      rating: 4.8,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      joinedDate: '2023-03-15',
      reliability: 98
    },
    {
      id: 2,
      name: 'Green Garden Bistro',
      logo: '🥗',
      address: '456 Oak Ave, Midtown',
      phone: '(555) 234-5678',
      email: 'info@greengarden.com',
      cuisine: 'Vegetarian',
      status: 'Active',
      lastPickup: '2024-01-13',
      totalDonations: '1,890 lbs',
      totalPickups: 32,
      rating: 4.9,
      coordinates: { lat: 40.7589, lng: -73.9851 },
      joinedDate: '2023-05-22',
      reliability: 95
    },
    {
      id: 3,
      name: 'Downtown Deli',
      logo: '🥪',
      address: '789 Broadway, Financial District',
      phone: '(555) 345-6789',
      email: 'orders@downtowndeli.com',
      cuisine: 'American',
      status: 'Inactive',
      lastPickup: '2024-01-08',
      totalDonations: '3,120 lbs',
      totalPickups: 68,
      rating: 4.6,
      coordinates: { lat: 40.7074, lng: -74.0113 },
      joinedDate: '2022-11-10',
      reliability: 87
    },
    {
      id: 4,
      name: 'Spice Route Indian',
      logo: '🍛',
      address: '321 Curry Lane, Little India',
      phone: '(555) 456-7890',
      email: 'chef@spiceroute.com',
      cuisine: 'Indian',
      status: 'Active',
      lastPickup: '2024-01-15',
      totalDonations: '1,675 lbs',
      totalPickups: 29,
      rating: 4.7,
      coordinates: { lat: 40.7505, lng: -73.9934 },
      joinedDate: '2023-07-08',
      reliability: 92
    },
    {
      id: 5,
      name: 'Fresh Catch Seafood',
      logo: '🐟',
      address: '654 Harbor St, Waterfront',
      phone: '(555) 567-8901',
      email: 'captain@freshcatch.com',
      cuisine: 'Seafood',
      status: 'Active',
      lastPickup: '2024-01-12',
      totalDonations: '2,890 lbs',
      totalPickups: 51,
      rating: 4.5,
      coordinates: { lat: 40.7051, lng: -74.0148 },
      joinedDate: '2023-01-20',
      reliability: 89
    },
    {
      id: 6,
      name: 'Sweet Dreams Bakery',
      logo: '🧁',
      address: '987 Sugar St, Bakery District',
      phone: '(555) 678-9012',
      email: 'baker@sweetdreams.com',
      cuisine: 'Bakery',
      status: 'Active',
      lastPickup: '2024-01-14',
      totalDonations: '945 lbs',
      totalPickups: 23,
      rating: 4.9,
      coordinates: { lat: 40.7282, lng: -73.9942 },
      joinedDate: '2023-09-12',
      reliability: 96
    },
  ];

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || partner.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activePartners = partners.filter(p => p.status === 'Active').length;
  const totalDonations = partners.reduce((sum, p) => sum + parseFloat(p.totalDonations.replace(/[^\d.]/g, '')), 0);
  const avgRating = partners.reduce((sum, p) => sum + p.rating, 0) / partners.length;

  const stats = [
    { 
      title: 'Active Partners', 
      value: activePartners.toString(), 
      unit: 'restaurants', 
      icon: Users, 
      change: '+3 this month',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      title: 'Total Donations', 
      value: totalDonations.toFixed(0), 
      unit: 'lbs saved', 
      icon: Package, 
      change: '+15% vs last month',
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      title: 'Average Rating', 
      value: avgRating.toFixed(1), 
      unit: 'out of 5.0', 
      icon: Star, 
      change: 'Excellent service',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    { 
      title: 'Total Pickups', 
      value: partners.reduce((sum, p) => sum + p.totalPickups, 0).toString(), 
      unit: 'completed', 
      icon: TrendingUp, 
      change: '+12% efficiency',
      gradient: 'from-blue-500 to-blue-600'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Restaurant{' '}
            <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                            Partners{' '}
                          </span>
          </h2>
          <p className="text-gray-600 text-lg">Manage your food donation network and build lasting partnerships</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center space-x-3 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Partner</span>
        </motion.button>
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
              placeholder="Search partners by name or cuisine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 pr-10"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </motion.button>
          </div>
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
                {['High Rating (4.5+)', 'Recent Pickups', 'High Volume', 'New Partners'].map((filter) => (
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

      {/* Interactive Map Placeholder */}
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Interactive Partner Map</h3>
              <p className="text-gray-600 mb-1">Visualize all your restaurant partners across the city</p>
              <p className="text-sm text-green-600 font-medium">{filteredPartners.length} partners displayed</p>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-6 left-12 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-700"></div>
        </div>
      </Card>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner, index) => (
          <motion.div
            key={partner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden group cursor-pointer">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="w-14 h-14 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                    >
                      {partner.logo}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors duration-200">
                        {partner.name}
                      </h3>
                      <p className="text-sm text-gray-600">{partner.cuisine} Cuisine</p>
                    </div>
                  </div>
                  <Badge variant={partner.status === 'Active' ? 'success' : 'warning'} size="sm">
                    {partner.status}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-sm text-gray-600 mb-6">
                  <div className="flex items-center group/item">
                    <MapPin className="w-4 h-4 mr-3 text-gray-400 group-hover/item:text-green-500 transition-colors duration-200" />
                    <span className="group-hover/item:text-gray-800 transition-colors duration-200">{partner.address}</span>
                  </div>
                  <div className="flex items-center group/item">
                    <Phone className="w-4 h-4 mr-3 text-gray-400 group-hover/item:text-green-500 transition-colors duration-200" />
                    <span className="group-hover/item:text-gray-800 transition-colors duration-200">{partner.phone}</span>
                  </div>
                  <div className="flex items-center group/item">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400 group-hover/item:text-green-500 transition-colors duration-200" />
                    <span className="group-hover/item:text-gray-800 transition-colors duration-200">Last pickup: {partner.lastPickup}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-xl group-hover:bg-green-50 transition-colors duration-200">
                    <div className="font-bold text-gray-900 text-lg">{partner.totalDonations}</div>
                    <div className="text-xs text-gray-600">Total Donated</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl group-hover:bg-orange-50 transition-colors duration-200">
                    <div className="font-bold text-gray-900 text-lg">{partner.totalPickups}</div>
                    <div className="text-xs text-gray-600">Pickups</div>
                  </div>
                </div>

                {/* Rating and Reliability */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{partner.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">rating</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">{partner.reliability}%</div>
                    <div className="text-xs text-gray-500">reliability</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPartner(partner.id)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors duration-200"
                  >
                    <UserMinus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Partner Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-orange-500 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Add New Partner</h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-green-100 mt-2">Expand your food rescue network</p>
                </div>
                
                <div className="p-6">
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Restaurant Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Enter restaurant name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cuisine Type
                      </label>
                      <div className="relative">
                        <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-gray-50 hover:bg-white transition-all duration-200">
                          <option>Select cuisine type</option>
                          <option>Italian</option>
                          <option>American</option>
                          <option>Asian</option>
                          <option>Mexican</option>
                          <option>Indian</option>
                          <option>Mediterranean</option>
                          <option>Other</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Enter full address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Enter email address"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Enter phone number"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium"
                      >
                        Add Partner
                      </motion.button>
                    </div>
                  </form>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Partners;