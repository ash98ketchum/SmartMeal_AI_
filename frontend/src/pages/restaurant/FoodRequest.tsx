import React, { useState } from 'react';
import { Check, X, Clock, MapPin, Phone, User, MessageCircle } from 'lucide-react';

interface FoodRequest {
  id: string;
  ngoName: string;
  ngoContact: string;
  items: Array<{
    name: string;
    quantity: string;
    requestedQuantity: number;
  }>;
  totalValue: number;
  requestedAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
  notes?: string;
  pickupTime?: string;
}

export default function RestaurantRequests() {
  const [requests, setRequests] = useState<FoodRequest[]>([
    {
      id: '1',
      ngoName: 'Hope Kitchen',
      ngoContact: '+1 (555) 123-4567',
      items: [
        { name: 'Grilled Chicken & Vegetables', quantity: '15 meals', requestedQuantity: 10 },
        { name: 'Seasonal Fruit Mix', quantity: '20 lbs', requestedQuantity: 5 }
      ],
      totalValue: 95,
      requestedAt: new Date(Date.now() - 30 * 60 * 1000),
      status: 'pending',
      notes: 'We serve dinner to 50+ families daily. This would help us tremendously.',
      pickupTime: 'Between 5:00 PM - 7:00 PM'
    },
    {
      id: '2',
      ngoName: 'Community Care Center',
      ngoContact: '+1 (555) 987-6543',
      items: [
        { name: 'Organic Vegetable Pasta', quantity: '12 servings', requestedQuantity: 8 }
      ],
      totalValue: 65,
      requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'accepted',
      notes: 'Perfect for our lunch program. Thank you!',
      pickupTime: 'Between 2:00 PM - 4:00 PM'
    }
  ]);

  const handleRequestAction = (requestId: string, action: 'accept' | 'reject') => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId
          ? { ...req, status: action === 'accept' ? 'accepted' : 'rejected' }
          : req
      )
    );
    const actionText = action === 'accept' ? 'accepted' : 'rejected';
    alert(`Request ${actionText} successfully! The NGO has been notified.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const completedRequests = requests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Food Requests</h1>
        <p className="text-gray-600">Manage requests from NGO partners</p>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pending Requests</h2>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {pendingRequests.length} pending
          </span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No pending requests at the moment</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.ngoName}</h3>
                      <p className="text-sm text-gray-600">
                        Requested {new Date(request.requestedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{request.ngoContact}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pickup Time</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{request.pickupTime}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Requested Items</h4>
                  <div className="space-y-2">
                    {request.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-sm text-gray-600 ml-2">({item.quantity} available)</span>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          Requesting: {item.requestedQuantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {request.notes && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                    <div className="bg-white p-3 rounded border flex items-start space-x-2">
                      <MessageCircle className="w-4 h-4 text-gray-500 mt-0.5" />
                      <p className="text-sm text-gray-600">{request.notes}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-bold text-green-600">
                    Total Value: ${request.totalValue}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleRequestAction(request.id, 'reject')}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleRequestAction(request.id, 'accept')}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Request</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Requests */}
      {completedRequests.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {completedRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{request.ngoName}</h3>
                    <p className="text-sm text-gray-600">
                      {request.items.length} item(s) • ${request.totalValue} value
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span className="ml-1 capitalize">{request.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
