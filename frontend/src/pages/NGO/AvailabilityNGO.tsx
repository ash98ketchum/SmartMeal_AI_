import React, { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/NgoBadge';
import { Clock, ChefHat, MapPin, Upload } from 'lucide-react';

const AvailabilityNGO: React.FC = () => {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/available-food')
      .then(res => res.json())
      .then(data => {
        setFoodItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch food items:', err);
        setLoading(false);
      });
  }, []);

  const handleReserve = (id: string) => {
    fetch('http://localhost:4000/reserve-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFoodItems(prev => prev.filter(f => f.id !== id));
        } else {
          alert('Reservation failed');
        }
      })
      .catch(err => {
        console.error('Reservation error:', err);
        alert('Could not reserve item');
      });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Available Food</h1>
        <p className="text-gray-600">Live updates from restaurants</p>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : foodItems.length === 0 ? (
        <p className="text-center text-gray-500">No available food at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodItems.map((item, index) => (
            <Card key={item.id} className="overflow-hidden group cursor-pointer">
              <div className="relative">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                <div className="absolute top-4 right-4">
                  <Badge variant={item.status === 'available' ? 'success' : 'warning'} size="sm">
                    {item.status}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{item.pickupEndTime}</span>
                </div>
                <div className="absolute bottom-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                  ${item.estimatedValue}
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
                  <span className="text-sm">Nearby</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.dietaryTags.map((diet: string, index: number) => (
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
                    <div className="font-semibold text-gray-900">{item.pickupStartTime} - {item.pickupEndTime}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleReserve(item.id)}
                  className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                >
                  Reserve Now
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityNGO;
