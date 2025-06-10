import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingFoodIcons from '@/components/common/FloatingFoodIcons';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4CAF50', '#FFC107', '#2196F3'];
const lineData = [
  { day: 'Mon', pickups: 5 },
  { day: 'Tue', pickups: 8 },
  { day: 'Wed', pickups: 6 },
  { day: 'Thu', pickups: 10 },
  { day: 'Fri', pickups: 7 },
  { day: 'Sat', pickups: 12 },
  { day: 'Sun', pickups: 9 },
];
const pieData = [
  { name: 'Packed', value: 40 },
  { name: 'En Route', value: 30 },
  { name: 'Delivered', value: 30 },
];

const NGoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOffers: 128,
    pendingPickups: 24,
    completed: 104,
  });

  useEffect(() => {
    // TODO: fetch real stats
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 relative overflow-hidden">
      <FloatingFoodIcons />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 container mx-auto px-6 py-8 space-y-8"
      >
        <h1 className="text-3xl font-extrabold text-gray-700">
          Welcome Back, <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">NGO Partner</span></h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Gift, label: 'Total Offers', value: stats.totalOffers, to: '/ngo/features' },
            { icon: Clock, label: 'Pending Pickups', value: stats.pendingPickups, to: '/ngo/features/pickup-tracker' },
            { icon: CheckCircle, label: 'Completed', value: stats.completed, to: '/ngo/history' },
          ].map(({ icon: Icon, label, value, to }) => (
            <motion.div
              key={label}
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(to)}
              className="flex items-center p-6 bg-white rounded-2xl shadow-lg border border-green-50 cursor-pointer"
            >
              <Icon className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <p className="text-lg font-semibold text-gray-700">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-50">
            <h2 className="text-xl font-semibold mb-4">Pickups This Week</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="pickups" stroke="#4CAF50" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-50">
            <h2 className="text-xl font-semibold mb-4">Current Status</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NGoDashboard;
