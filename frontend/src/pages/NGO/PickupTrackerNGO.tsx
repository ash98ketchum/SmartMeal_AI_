import React, { useState } from 'react';
import { Box, Truck, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';

const steps = [
  { icon: Box,   label: 'Packed'    },
  { icon: Truck, label: 'On the Way' },
  { icon: Check, label: 'Delivered'  },
];

const PickupTrackerNGO: React.FC = () => {
  const [current, setCurrent] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 flex items-center justify-center p-6">
      <Card glow hoverEffect className="w-full max-w-lg">
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold mb-6 text-center"
        >
          Pickup Tracker
        </motion.h2>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={i} className="relative flex-1 flex flex-col items-center">
              {i < steps.length - 1 && (
                <div className={`absolute top-4 right-0 w-full h-0.5 ${i < current ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
              <div className={`p-3 rounded-full ${i <= current ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <span className={`mt-2 font-medium ${i <= current ? 'text-green-700' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-4 mb-6">
          {[
            { time: '10:00 AM', event: 'Picked up from Restaurant A' },
            { time: '10:30 AM', event: 'En route to Shelter' },
            { time: '11:00 AM', event: 'Delivered to Shelter' },
          ].map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className="mt-1 h-3 w-3 bg-green-600 rounded-full" />
              <div>
                <p className="text-gray-700 font-medium">{t.event}</p>
                <p className="text-sm text-gray-500">{t.time}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => setCurrent(c => Math.min(c + 1, steps.length - 1))}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Next Stage
        </button>
      </Card>
    </div>
  );
};

export default PickupTrackerNGO;
