import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/NgoBadge';
import GlowingText from '@/components/ui/GlowingText';
import Chart from '@/components/ui/Chart';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  ChevronRight,
  MapPin,
  User,
  Package,
  TrendingUp,
  Users,
  CheckCircle,
  Activity,
  Clock,
  Camera,
  FileText,
  ChevronDown
} from 'lucide-react';

const HistoryNGO: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('30');
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const pickupHistory = [
    {
      id: 1,
      date: '2024-01-15',
      time: '14:30',
      partner: 'Mario\'s Italian Kitchen',
      foodItem: 'Fresh Pasta & Sauce',
      quantity: '15 lbs',
      volunteer: 'Sarah Johnson',
      status: 'Completed',
      notes: 'Excellent condition, delivered to food bank',
      photos: 2,
      impactScore: 95,
      beneficiaries: 25
    },
    {
      id: 2,
      date: '2024-01-14',
      time: '11:15',
      partner: 'Green Garden Bistro',
      foodItem: 'Mixed Salads',
      quantity: '8 containers',
      volunteer: 'Mike Chen',
      status: 'Completed',
      notes: 'Fresh produce, distributed immediately',
      photos: 1,
      impactScore: 88,
      beneficiaries: 16
    },
    {
      id: 3,
      date: '2024-01-13',
      time: '16:45',
      partner: 'Sweet Dreams Bakery',
      foodItem: 'Assorted Pastries',
      quantity: '25 items',
      volunteer: 'Emma Davis',
      status: 'Completed',
      notes: 'Day-old items, perfect for shelter breakfast',
      photos: 3,
      impactScore: 92,
      beneficiaries: 30
    },
    {
      id: 4,
      date: '2024-01-12',
      time: '13:20',
      partner: 'Spice Route Indian',
      foodItem: 'Curry & Rice',
      quantity: '20 portions',
      volunteer: 'Alex Rodriguez',
      status: 'Partial',
      notes: 'Some containers were damaged during transport',
      photos: 1,
      impactScore: 65,
      beneficiaries: 15
    },
    {
      id: 5,
      date: '2024-01-11',
      time: '12:00',
      partner: 'Downtown Deli',
      foodItem: 'Sandwich Platters',
      quantity: '30 sandwiches',
      volunteer: 'Lisa Wong',
      status: 'Completed',
      notes: 'High quality, great for lunch distribution',
      photos: 2,
      impactScore: 98,
      beneficiaries: 35
    },
    {
      id: 6,
      date: '2024-01-10',
      time: '15:30',
      partner: 'Fresh Catch Seafood',
      foodItem: 'Grilled Fish',
      quantity: '12 lbs',
      volunteer: 'David Kim',
      status: 'Cancelled',
      notes: 'Partner had to cancel due to equipment issues',
      photos: 0,
      impactScore: 0,
      beneficiaries: 0
    },
  ];

  const monthlyData = [
    { label: 'Jul', value: 145 },
    { label: 'Aug', value: 165 },
    { label: 'Sep', value: 178 },
    { label: 'Oct', value: 192 },
    { label: 'Nov', value: 156 },
    { label: 'Dec', value: 203 },
  ];

  const foodTypeData = [
    { label: 'Prepared Meals', value: 40 },
    { label: 'Fresh Produce', value: 30 },
    { label: 'Bakery Items', value: 20 },
    { label: 'Packaged Goods', value: 10 },
  ];

  const filteredHistory = pickupHistory.filter(record => {
    const matchesSearch = record.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.foodItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.volunteer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'Completed': 'success',
      'Partial': 'warning',
      'Cancelled': 'error',
    } as const;
    return variants[status as keyof typeof variants] || 'neutral';
  };

  const totalPickups = filteredHistory.length;
  const completedPickups = filteredHistory.filter(r => r.status === 'Completed').length;
  const totalWeight = filteredHistory.reduce((sum, record) => {
    const weight = parseFloat(record.quantity.replace(/[^\d.]/g, '')) || 0;
    return sum + weight;
  }, 0);
  const totalBeneficiaries = filteredHistory.reduce((sum, record) => sum + record.beneficiaries, 0);

  const stats = [
    { 
      title: 'Total Pickups', 
      value: totalPickups.toString(), 
      unit: 'completed missions', 
      icon: Package, 
      change: '+8 this month',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Success Rate', 
      value: `${((completedPickups / totalPickups) * 100).toFixed(0)}%`, 
      unit: 'completion rate', 
      icon: CheckCircle, 
      change: '+5% improvement',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      title: 'Food Rescued', 
      value: totalWeight.toFixed(0), 
      unit: 'lbs saved', 
      icon: TrendingUp, 
      change: '+15% vs last month',
      gradient: 'from-orange-500 to-orange-600'
    },
    { 
      title: 'People Helped', 
      value: totalBeneficiaries.toString(), 
      unit: 'beneficiaries', 
      icon: Users, 
      change: 'Growing impact',
      gradient: 'from-purple-500 to-purple-600'
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pickup{' '}
            <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                            History{' '}
                          </span>
          </h1>
          <p className="text-gray-600 text-lg">Complete record of all your food rescue activities and impact</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center space-x-3 font-semibold"
        >
          <Download className="w-5 h-5" />
          <span>Export Report</span>
        </motion.button>
      </div>

      {/* Summary Stats */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart 
          type="bar" 
          data={monthlyData} 
          title="Monthly Pickups Trend"
          className="hover:shadow-lg transition-shadow duration-300"
        />
        <Chart 
          type="pie" 
          data={foodTypeData} 
          title="Food Types Rescued"
          className="hover:shadow-lg transition-shadow duration-300"
        />
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by partner, food item, or volunteer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 hover:bg-white transition-all duration-200 pr-10"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="365">Last year</option>
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
                {['High Impact (90+)', 'Recent Pickups', 'Large Quantities', 'Perfect Completion'].map((filter) => (
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

      {/* History Timeline */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Pickup Timeline</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredHistory.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {record.date} at {record.time}
                      </span>
                    </div>
                    <Badge variant={getStatusBadge(record.status)} size="sm">
                      {record.status}
                    </Badge>
                    {record.impactScore > 0 && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">
                          Impact: {record.impactScore}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>Partner</span>
                      </div>
                      <div className="font-medium text-gray-900">{record.partner}</div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <Package className="w-4 h-4" />
                        <span>Food Item</span>
                      </div>
                      <div className="font-medium text-gray-900">{record.foodItem}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">Quantity</div>
                      <div className="font-medium text-gray-900">{record.quantity}</div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-gray-600 mb-1">
                        <User className="w-4 h-4" />
                        <span>Volunteer</span>
                      </div>
                      <div className="font-medium text-gray-900">{record.volunteer}</div>
                    </div>
                  </div>

                  {/* Impact Metrics */}
                  {record.beneficiaries > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-green-50 rounded-xl">
                        <div className="text-sm text-green-600 mb-1">People Helped</div>
                        <div className="text-lg font-bold text-green-700">{record.beneficiaries}</div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-xl">
                        <div className="text-sm text-blue-600 mb-1">Photos Taken</div>
                        <div className="text-lg font-bold text-blue-700 flex items-center space-x-1">
                          <Camera className="w-4 h-4" />
                          <span>{record.photos}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {record.notes && (
                    <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-green-50 transition-colors duration-200">
                      <div className="text-sm text-gray-600 mb-1">Notes:</div>
                      <div className="text-sm text-gray-900">{record.notes}</div>
                    </div>
                  )}
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
                  className="ml-4 p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${
                    selectedRecord === record.id ? 'rotate-90' : ''
                  }`} />
                </motion.button>
              </div>
              
              <AnimatePresence>
                {selectedRecord === record.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>Detailed Report</span>
                        </h4>
                        <div className="text-sm space-y-2">
                          <p><span className="text-gray-600">Pickup ID:</span> <span className="font-medium">#{record.id}</span></p>
                          <p><span className="text-gray-600">Impact Score:</span> <span className="font-medium text-green-600">{record.impactScore}%</span></p>
                          <p><span className="text-gray-600">Photos taken:</span> <span className="font-medium">{record.photos}</span></p>
                          <p><span className="text-gray-600">Delivery status:</span> <span className="font-medium text-green-600">Confirmed</span></p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2"
                        >
                          <Camera className="w-4 h-4" />
                          <span>View Photos</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download Report</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HistoryNGO;