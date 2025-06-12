import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/NgoBadge';
import GlowingText from '@/components/ui/GlowingText';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronDown, 
  MessageCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Activity,
  X,
  Plus,
  Check
} from 'lucide-react';

const MyRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const requests = [
    {
      id: 1001,
      foodItem: 'Fresh Vegetables & Fruits',
      quantity: '30 lbs',
      status: 'Pending',
      dateCreated: '2024-01-15',
      partner: 'Green Market Grocery',
      priority: 'High',
      notes: 'Urgent need for food bank distribution',
      estimatedPickup: '2024-01-16',
      requestedBy: 'Sarah Johnson'
    },
    {
      id: 1002,
      foodItem: 'Prepared Sandwiches',
      quantity: '50 items',
      status: 'Approved',
      dateCreated: '2024-01-14',
      partner: 'Downtown Deli',
      priority: 'Medium',
      notes: 'For homeless shelter dinner service',
      estimatedPickup: '2024-01-15',
      requestedBy: 'Mike Chen'
    },
    {
      id: 1003,
      foodItem: 'Bakery Items',
      quantity: '20 pastries',
      status: 'Completed',
      dateCreated: '2024-01-13',
      partner: 'Sweet Dreams Bakery',
      priority: 'Low',
      notes: 'Successfully delivered to community center',
      estimatedPickup: '2024-01-14',
      requestedBy: 'Emma Davis'
    },
    {
      id: 1004,
      foodItem: 'Rice & Grains',
      quantity: '25 lbs',
      status: 'In Progress',
      dateCreated: '2024-01-12',
      partner: 'Asian Fusion Kitchen',
      priority: 'High',
      notes: 'Pickup scheduled for tomorrow morning',
      estimatedPickup: '2024-01-13',
      requestedBy: 'Alex Rodriguez'
    },
    {
      id: 1005,
      foodItem: 'Dairy Products',
      quantity: '15 containers',
      status: 'Declined',
      dateCreated: '2024-01-11',
      partner: 'Farm Fresh Cafe',
      priority: 'Medium',
      notes: 'Unable to maintain proper temperature',
      estimatedPickup: '2024-01-12',
      requestedBy: 'Lisa Wong'
    },
  ];

  const stats = [
    { 
      title: 'Pending Requests', 
      value: requests.filter(r => r.status === 'Pending').length.toString(), 
      unit: 'awaiting approval', 
      icon: Clock, 
      change: '+2 today',
      gradient: 'from-yellow-500 to-yellow-600'
    },
    { 
      title: 'Approved Requests', 
      value: requests.filter(r => r.status === 'Approved').length.toString(), 
      unit: 'ready for pickup', 
      icon: CheckCircle2, 
      change: '+5 this week',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      title: 'Completed Requests', 
      value: requests.filter(r => r.status === 'Completed').length.toString(), 
      unit: 'successfully fulfilled', 
      icon: TrendingUp, 
      change: '+12% vs last month',
      gradient: 'from-green-500 to-green-600'
    },
    { 
      title: 'Total Requests', 
      value: requests.length.toString(), 
      unit: 'all time', 
      icon: FileText, 
      change: 'Growing network',
      gradient: 'from-purple-500 to-purple-600'
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pending': 'warning',
      'Approved': 'info',
      'Completed': 'success',
      'In Progress': 'info',
      'Declined': 'error',
    } as const;
    return variants[status as keyof typeof variants] || 'neutral';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Approved': case 'In Progress': return <CheckCircle2 className="w-4 h-4" />;
      case 'Completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'Declined': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.foodItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectRequest = (id: number) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(reqId => reqId !== id)
        : [...prev, id]
    );
  };

  const toggleExpandRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My{' '}
           <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                            Requests{' '}
                          </span>
          </h1>
          <p className="text-gray-600 text-lg">Track and manage your food pickup requests</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center space-x-3 font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>New Request</span>
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
              placeholder="Search requests by food item, partner, or requester..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="in progress">In Progress</option>
                <option value="declined">Declined</option>
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

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedRequests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-xl border border-green-200"
            >
              {/* <div className="flex items-center justify-between"> */}
                {/* <span className="text-sm font-medium text-green-800">
                  {selectedRequests.length} request(s) selected
                </span> */}
                {/* <div className="flex gap-2"> */}
                  {/* <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    Approve Selected
                  </motion.button> */}
                  {/* <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </motion.button> */}
                {/* </div> */}
              {/* </div> */}
            </motion.div>
          )}
        </AnimatePresence>

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
                {['High Priority', 'Recent Requests', 'Pending Approval', 'This Week'].map((filter) => (
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

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request, index) => (
          <motion.div
            key={request.id}
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
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 bg-gradient-to-br from-green-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg"
                    >
                      #{request.id.toString().slice(-2)}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-green-600 transition-colors duration-200">
                        {request.foodItem}
                      </h3>
                      <p className="text-sm text-gray-600">{request.partner}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={getStatusBadge(request.status)} size="sm">
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status}</span>
                    </Badge>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">Quantity</div>
                    <div className="font-semibold text-gray-900">{request.quantity}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Date Created</div>
                    <div className="font-semibold text-gray-900">{request.dateCreated}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Requested By</div>
                    <div className="font-semibold text-gray-900">{request.requestedBy}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Est. Pickup</div>
                    <div className="font-semibold text-gray-900">{request.estimatedPickup}</div>
                  </div>
                </div>

                {/* Notes */}
                {request.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl group-hover:bg-green-50 transition-colors duration-200">
                    <div className="text-xs text-gray-500 mb-1">Notes:</div>
                    <div className="text-sm text-gray-700">{request.notes}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Mark as Completed</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleExpandRow(request.id)}
                    className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      expandedRow === request.id ? 'rotate-180' : ''
                    }`} />
                  </motion.button>
                  {/* <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSelectRequest(request.id)}
                    className={`p-3 rounded-xl transition-colors duration-200 ${
                      selectedRequests.includes(request.id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.button> */}
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedRow === request.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Additional Details</h4>
                          <div className="text-sm space-y-1">
                            <p><span className="text-gray-600">Request ID:</span> #{request.id}</p>
                            <p><span className="text-gray-600">Priority Level:</span> {request.priority}</p>
                            <p><span className="text-gray-600">Current Status:</span> {request.status}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {/* <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm font-medium"
                          >
                            Mark as Completed
                          </motion.button> */}
                          {/* <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                          >
                            Start Chat
                          </motion.button> */}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;