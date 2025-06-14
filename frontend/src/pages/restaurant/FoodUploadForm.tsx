import React, { useState } from 'react';
import { Upload, Camera, Plus, X, Clock, MapPin, DollarSign } from 'lucide-react';

interface FoodUploadForm {
  name: string;
  description: string;
  quantity: string;
  pickupStartTime: string;
  pickupEndTime: string;
  estimatedValue: string;
  dietaryTags: string[];
  image: string;
  expiryTime: string;
}

export default function RestaurantUpload() {
  const [form, setForm] = useState<FoodUploadForm>({
    name: '',
    description: '',
    quantity: '',
    pickupStartTime: '',
    pickupEndTime: '',
    estimatedValue: '',
    dietaryTags: [],
    image: '',
    expiryTime: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedItems, setUploadedItems] = useState<any[]>([]);

  const availableTags = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free',
    'High Protein', 'Low Carb', 'Organic', 'Fresh', 'Prepared Meal',
    'Bakery', 'Packaged', 'Frozen', 'Spicy', 'Kid-Friendly'
  ];

  const handleInputChange = (field: keyof FoodUploadForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setForm(prev => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter(t => t !== tag)
        : [...prev.dietaryTags, tag]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server and get a URL
      const mockImageUrl = 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600';
      setForm(prev => ({ ...prev, image: mockImageUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newItem = {
      id: Date.now().toString(),
      ...form,
      restaurant: 'Your Restaurant',
      status: 'available',
      uploadedAt: new Date()
    };

    setUploadedItems(prev => [newItem, ...prev]);
    
    // Reset form
    setForm({
      name: '',
      description: '',
      quantity: '',
      pickupStartTime: '',
      pickupEndTime: '',
      estimatedValue: '',
      dietaryTags: [],
      image: '',
      expiryTime: ''
    });

    setIsSubmitting(false);
    alert('Food item uploaded successfully and is now available for NGOs to request!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Available Food</h1>
        <p className="text-gray-600">Share your surplus food with partner NGOs and reduce waste</p>
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {form.image ? (
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Grilled Chicken & Vegetables"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
              <input
                type="text"
                required
                value={form.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 15 servings, 20 lbs, 25 items"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Brief description of the food item, preparation method, etc."
            />
          </div>

          {/* Timing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Start Time *</label>
              <input
                type="time"
                required
                value={form.pickupStartTime}
                onChange={(e) => handleInputChange('pickupStartTime', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pickup End Time *</label>
              <input
                type="time"
                required
                value={form.pickupEndTime}
                onChange={(e) => handleInputChange('pickupEndTime', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Value ($)</label>
              <input
                type="number"
                value={form.estimatedValue}
                onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    form.dietaryTags.includes(tag)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Food Item</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Recently Uploaded Items */}
      {uploadedItems.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recently Uploaded Items</h2>
          <div className="space-y-4">
            {uploadedItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                  src={item.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.quantity}</p>
                  <p className="text-sm text-gray-500">{item.pickupStartTime} - {item.pickupEndTime}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {item.dietaryTags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-medium">${item.estimatedValue}</div>
                  <div className="text-sm text-green-600">Available</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}