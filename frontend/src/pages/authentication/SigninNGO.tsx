import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import FloatingFoodIcons from "@/components/common/FloatingFoodIcons";

const MASTER_EMAIL_NGO = "ngo@smartmeal.ai";
const MASTER_PASSWORD_NGO = "NGoP@ss2025";

const SigninNGO: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === MASTER_EMAIL_NGO && password === MASTER_PASSWORD_NGO) {
      setError(null);
      navigate("/NGO");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-100 via-yellow-100 to-orange-50">
      {/* Subtle floating icons in the background */}
      <FloatingFoodIcons />

      {/* Animated card container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl border border-green-50"
      >
        <div className="flex items-center justify-center mb-6 space-x-3">
          <Heart className="h-10 w-10 text-green-600" />
          <h1 className="text-3xl font-extrabold text-gray-800">SmartMeal AI</h1>
        </div>

        <h2 className="text-center text-lg font-medium text-gray-700 mb-8">
          NGO Partner Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              NGO Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="ngo@smartmeal.ai"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold tracking-wide uppercase shadow-md hover:bg-green-700 transition"
          >
            Sign In
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Not an NGO?{' '}
          <a href="/signin/restaurant" className="text-green-600 hover:underline">
            Sign in as Restaurant
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SigninNGO;
