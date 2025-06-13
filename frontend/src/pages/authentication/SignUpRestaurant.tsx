import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingFoodIcons from '@/components/common/FloatingFoodIcons';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';


const SignUpRestaurant: React.FC = () => {
    function SignupForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'RESTAURANT', // or 'RESTAURANT', 'ADMIN'
    gstNumber: '',
    aadharNumber: '',
    
  });
}
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [GSTNumber, setGSTNumber] = useState('');
  const [error, setError] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        role: 'restaurant',
        restaurantName,
        GSTNumber,
      });

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Sign up failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gradient-to-br from-orange-100 via-green-100 to-yellow-50 relative">
      <FloatingFoodIcons />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-xl px-10 py-6 bg-white rounded-3xl shadow-2xl border border-green-50"
      >
        <div className="flex items-center justify-center mb-6 space-x-3">
          <ChefHat className="h-10 w-10 text-orange-600" />
          <h1 className="text-3xl font-extrabold text-gray-800">SmartMeal AI</h1>
        </div>

        <h2 className="text-center text-lg font-medium text-gray-700 mb-4">Register as Restaurant Partner</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Restaurant Name</label>
            <input
              type="text"
              required
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="restaurant@smartmeal.ai"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              placeholder="••••••••"
            />
          </div>

            <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">GST Number</label>
            <input
              type="text"
              required
              value={GSTNumber}
              onChange={(e) => setGSTNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 text-center">{error}</div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-orange-600 text-white font-semibold uppercase shadow-md hover:bg-orange-700 transition"
          >
            Sign Up
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin/restaurant" className="text-orange-600 hover:underline">
            Sign In
          </Link>
          <p className="mt-2">
            Not a restaurant?{' '}
            <Link to="/signin/ngo" className="text-orange-600 hover:underline">
              Sign in as NGO
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpRestaurant;
