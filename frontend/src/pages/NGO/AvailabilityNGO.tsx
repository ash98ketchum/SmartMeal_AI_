import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/NgoBadge';
import {
  Clock,
  Package,
  TrendingUp,
  Users,
  ChefHat,
  MapPin,
  Eye,
  Heart,
  Timer,
  ShoppingCart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AvailabilityNGO: React.FC = () => {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  // summary stats...
  const [summary, setSummary] = useState({
    availableCount: 0,
    totalValue: 0,
    nearestExpiryHours: 0,
    activeRestaurants: 0,
  });

  useEffect(() => {
    fetch('http://localhost:4000/api/available-food')
      .then((res) => res.json())
      .then((data) => {
        setFoodItems(data);
        setLoading(false);
        computeSummary(data);
      })
      .catch((err) => {
        console.error('Failed to fetch available-food:', err);
        setLoading(false);
      });
  }, []);

  const computeSummary = (data: any[]) => {
    const available = data.filter(i => i.status === 'available');
    const totalVal = available.reduce((sum, i) => sum + parseFloat(i.estimatedValue || '0'), 0);
    const restSet = new Set(available.map(i => i.restaurant));
    const now = Date.now();
    const hoursArr = available.map(i => {
      const [h, m] = (i.pickupEndTime || '').split(':').map(Number);
      if (isNaN(h)) return Infinity;
      const exp = new Date();
      exp.setHours(h, m, 0, 0);
      return (exp.getTime() - now) / 36e5;
    });
    const nearest = hoursArr.length ? Math.max(0, Math.min(...hoursArr)) : 0;
    setSummary({
      availableCount: available.length,
      totalValue: totalVal,
      nearestExpiryHours: Math.floor(nearest),
      activeRestaurants: restSet.size,
    });
  };

  const toggleReserve = (item: any) => {
    const url = item.status === 'available'
      ? 'http://localhost:4000/api/reserve-food'
      : 'http://localhost:4000/api/unreserve-food';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id }),
    })
    .then(res => res.json())
    .then(() => {
      // flip status locally
      const updated = foodItems.map(f =>
        f.id === item.id
          ? { ...f, status: f.status === 'available' ? 'reserved' : 'available' }
          : f
      );
      setFoodItems(updated);
      computeSummary(updated);
    })
    .catch(err => {
      console.error('toggleReserve error:', err);
      alert('Action failed');
    });
  };

  const calculateTimeLeft = (timeStr = '') => {
    if (!timeStr) return 'N/A';
    const [h, m] = timeStr.split(':').map(Number);
    const now = new Date();
    const exp = new Date();
    exp.setHours(h, m, 0, 0);
    const diff = exp.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';
    const hrs = Math.floor(diff / 36e5);
    const mins = Math.floor((diff % 36e5) / 6e4);
    return `${hrs > 0 ? `${hrs} hr ` : ''}${mins} min left`;
  };

  const statCards = [
    {
      title: 'Available Items',
      value: summary.availableCount,
      unit: 'ready for pickup',
      icon: Package,
      gradient: 'from-green-500 to-green-600',
      badge: `+${summary.availableCount} new`
    },
    {
      title: 'Total Value',
      value: `₹${summary.totalValue}`,
      unit: 'estimated worth',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-orange-600',
      badge: '+₹0 today'
    },
    {
      title: 'Nearest Expiry',
      value: `${summary.nearestExpiryHours}h`,
      unit: 'time remaining',
      icon: Clock,
      gradient: 'from-red-500 to-red-600',
      badge: 'Act fast!'
    },
    {
      title: 'Partner Restaurants',
      value: summary.activeRestaurants,
      unit: 'active donors',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      badge: 'Growing'
    }
  ];

  const reservedItems = foodItems.filter(i => i.status === 'reserved');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header + Cart button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Food</h1>
          <p className="text-gray-600">Live updates from restaurants</p>
        </div>
        <button
          onClick={() => setShowCart(true)}
          className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart ({reservedItems.length})</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="p-6 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="success" size="sm">{stat.badge}</Badge>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.unit}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Grid of items */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : foodItems.length === 0 ? (
        <p className="text-center text-gray-500">No available food at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="overflow-hidden group">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant={item.status === 'available' ? 'success' : 'warning'} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                    <Timer className="w-3 h-3" />
                    <span>{calculateTimeLeft(item.pickupEndTime)}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                    ₹{item.estimatedValue}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <ChefHat className="w-4 h-4 mr-2" />
                    <span>{item.restaurant}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>Nearby</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.dietaryTags?.map((tag: string, i: number) => (
                      <Badge key={i} variant="info" size="sm">{tag}</Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Quantity</div>
                      <div className="font-semibold text-gray-900">{item.quantity}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Pickup Window</div>
                      <div className="font-semibold text-gray-900">
                        {item.pickupStartTime} - {item.pickupEndTime}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleReserve(item)}
                    className={`w-full py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      item.status === 'available'
                        ? 'bg-gradient-to-r from-green-500 to-orange-500 text-white hover:shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {item.status === 'available' ? 'Reserve Now' : 'Unreserve'}
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Cart Panel */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-800">×</button>
            </div>
            {reservedItems.length === 0 ? (
              <p className="text-gray-500">No reserved items.</p>
            ) : (
              reservedItems.map(item => (
                <div key={item.id} className="mb-4 border-b pb-2">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.quantity}</p>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AvailabilityNGO;
