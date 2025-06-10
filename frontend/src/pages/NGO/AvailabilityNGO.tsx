import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, CheckCircle, Info } from 'lucide-react';

const donationOffers = [
  {
    id: 1,
    restaurant: 'Spice Hub',
    meals: 10,
    distance: '2.3 km',
    status: 'Ready for Pickup',
    image: 'https://picsum.photos/seed/spicehub/400/200',
    timeLeft: '15 min',
  },
  {
    id: 2,
    restaurant: 'Green Bowl',
    meals: 8,
    distance: '1.1 km',
    status: 'Packaging',
    image: 'https://source.unsplash.com/400x200/?healthy,food',
    timeLeft: '5 min',
  },
];

const statusColors: Record<string, string> = {
  'Ready for Pickup': 'bg-green-100 text-green-700',
  Packaging: 'bg-yellow-100 text-yellow-700',
};

const AvailabilityNGO: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);

  const openModal = (id: number) => setSelected(id);
  const closeModal = () => setSelected(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 py-12 px-4 md:px-8 relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Live Donation Offers</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {donationOffers.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow-lg rounded-3xl overflow-hidden border border-green-100"
            >
              <img src={item.image} alt={item.restaurant} className="w-full h-40 object-cover" />

              <div className="p-5 space-y-2">
                <h3 className="text-xl font-bold text-gray-800">{item.restaurant}</h3>
                <p className="text-sm text-gray-600">{item.meals} meals available</p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" /> {item.distance}
                </div>

                {/* Status chip */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status] || 'bg-gray-100 text-gray-600'}`}>
                  <CheckCircle className="inline w-3 h-3 mr-1" />
                  {item.status}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center text-sm text-yellow-600 gap-1">
                    <Clock className="w-4 h-4" /> {item.timeLeft}
                  </div>

                  {/* Details button */}
                  <button
                    onClick={() => openModal(item.id)}
                    className="text-blue-600 text-sm flex items-center gap-1 hover:underline"
                  >
                    <Info className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      {selected !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-2">Pickup Instructions</h3>
            <p className="text-gray-700 mb-2">
              Please visit <strong>{donationOffers.find((i) => i.id === selected)?.restaurant}</strong> within the next{' '}
              <strong>{donationOffers.find((i) => i.id === selected)?.timeLeft}</strong>. Ensure to bring necessary ID
              or NGO pass.
            </p>
            <p className="text-sm text-gray-500">Note: Confirm with the restaurant before pickup.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityNGO;
