import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/NgoBadge';
import GlowingText from '@/components/ui/GlowingText';
import Chart from '@/components/ui/Chart';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle, 
  Plus,
  Package,
  UserPlus,
  Activity
} from 'lucide-react';

const NgoDashboard: React.FC = () => {
  const stats = [
    { title: 'Total Food Saved', value: '12,450', unit: 'lbs', icon: TrendingUp, change: '+15%' },
    { title: 'Active Partners', value: '89', unit: 'restaurants', icon: Users, change: '+3' },
    { title: 'Upcoming Pickups', value: '24', unit: 'scheduled', icon: Calendar, change: 'today' },
    { title: 'Requests Fulfilled', value: '156', unit: 'this week', icon: CheckCircle, change: '+12%' },
  ];

  const donationData = [
    { label: 'Jan', value: 850 },
    { label: 'Feb', value: 920 },
    { label: 'Mar', value: 1100 },
    { label: 'Apr', value: 980 },
    { label: 'May', value: 1200 },
    { label: 'Jun', value: 1450 },
  ];

  const foodTypeData = [
    { label: 'Prepared Meals', value: 45 },
    { label: 'Produce', value: 25 },
    { label: 'Bakery Items', value: 20 },
    { label: 'Packaged Goods', value: 10 },
  ];

  const quickActions = [
    { title: 'New Request', description: 'Submit a food pickup request', icon: Plus, gradient: 'from-green-500 to-green-600' },
    { title: 'Reserve Food', description: 'Browse available donations', icon: Package, gradient: 'from-orange-500 to-orange-600' },
    { title: 'Add Partner', description: 'Register new restaurant', icon: UserPlus, gradient: 'from-blue-500 to-blue-600' },
  ];

  const recentActivities = [
    { text: 'New pickup scheduled with Mario\'s Bistro', time: '5 minutes ago', type: 'pickup' },
    { text: 'Food request fulfilled - 45 lbs donated', time: '1 hour ago', type: 'donation' },
    { text: 'New partner registered: Green Garden Cafe', time: '2 hours ago', type: 'partner' },
    { text: 'Volunteer check-in completed', time: '3 hours ago', type: 'volunteer' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Message */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
         Your efforts are <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent">
                            feeding change.{' '}
                          </span>
          
        </h2>
        <p className="text-gray-600 text-lg">Here's what's happening with your food rescue efforts today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
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
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart 
          type="bar" 
          data={donationData} 
          title="Food Donations Over Time (lbs)"
          className="hover:shadow-lg transition-shadow duration-300"
        />
        <Chart 
          type="pie" 
          data={foodTypeData} 
          title="Food Type Breakdown"
          className="hover:shadow-lg transition-shadow duration-300"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="p-6 cursor-pointer group">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Activity className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium">{activity.text}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default NgoDashboard;