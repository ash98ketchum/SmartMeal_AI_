// src/pages/authentication/SignInRestaurant.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChefHat } from "lucide-react";
import FloatingFoodIcons from "@/components/common/FloatingFoodIcons";

const MASTER_EMAIL = "owner@smartmeal.ai";
const MASTER_PASSWORD = "P@ssw0rd123";

const SigninRestaurant: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === MASTER_EMAIL && password === MASTER_PASSWORD) {
      // Clear any previous error
      setError(null);
      // Redirect to restaurant dashboard
      navigate("/restaurant");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-green-50 via-orange-50 to-yellow-50">
      {/* Keep the floating food icons running behind */}
      <FloatingFoodIcons />

      <div className="z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex items-center justify-center mb-6 space-x-2">
          <ChefHat className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">SmartMeal AI</h1>
        </div>
        <h2 className="text-center text-xl font-semibold text-gray-700 mb-4">
          Restaurant Owner Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              placeholder="owner@smartmeal.ai"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border-gray-300 focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-2 text-white font-medium hover:bg-green-700 transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Not a restaurant?{" "}
          <a
            href="/signin/ngo"
            className="text-green-600 hover:underline"
          >
            Sign in as NGO
          </a>
        </p>
      </div>
    </div>
  );
};

export default SigninRestaurant;
