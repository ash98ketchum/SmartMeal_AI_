import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Package, MapPin, ThumbsUp, ShieldCheck, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingFoodIcons from '@/components/common/FloatingFoodIcons';

const items = [
  { icon: MapPin,    title: 'Real-Time Availability', to: '/ngo/features/availability', color: 'bg-green-100', svg: '/assets/availability-bg.svg', comingSoon: false },
  { icon: Clock,     title: 'Pickup & Tracking',      to: '/ngo/features/pickup-tracker', color: 'bg-yellow-100', svg: '/assets/tracker-bg.svg', comingSoon: false },
  { icon: Package,   title: 'Rate & Feedback',        to: '/ngo/feedback', color: 'bg-blue-100', svg: '/assets/feedback-bg.svg', comingSoon: false },

  // 🔮 Future features
  { icon: ShieldCheck, title: 'Food Safety Checker',   to: '', color: 'bg-red-100', svg: '/assets/safety-bg.svg', comingSoon: true },
  { icon: MessageSquare, title: 'Volunteer Chatroom',  to: '', color: 'bg-purple-100', svg: '/assets/chat-bg.svg', comingSoon: true },
  { icon: ThumbsUp, title: 'NGO Reputation Score',     to: '', color: 'bg-pink-100', svg: '/assets/reputation-bg.svg', comingSoon: true },
];

const FeaturesNGO: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 relative">
      <FloatingFoodIcons />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-8 space-y-6"
      >
        <h1 className="text-3xl font-extrabold text-gray-800">Features</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, to, color, svg, comingSoon }) => (
            <motion.div
              key={title}
              whileHover={!comingSoon ? { scale: 1.03, rotate: 1 } : {}}
              onClick={() => { if (!comingSoon) navigate(to); }}
              className={`relative p-6 rounded-3xl shadow-lg border border-green-50 transition-all ${
                comingSoon ? 'cursor-not-allowed opacity-60 blur-[0.5px]' : 'cursor-pointer'
              } ${color}`}
            >
              <img src={svg} alt="" className="absolute top-0 right-0 w-24 opacity-20 pointer-events-none" />
              <Icon className="h-10 w-10 text-green-600 mb-3" />
              <h2 className="text-lg font-semibold text-gray-700 mb-1">{title}</h2>
              <p className="text-sm text-gray-500">{comingSoon ? 'Coming Soon...' : 'View live data & actions'}</p>

              <span className={`absolute top-2 left-2 text-white text-xs px-2 py-0.5 rounded-full ${
                comingSoon ? 'bg-gray-500' : 'bg-green-600'
              }`}>
                {comingSoon ? 'Coming Soon' : 'NEW'}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default FeaturesNGO;
