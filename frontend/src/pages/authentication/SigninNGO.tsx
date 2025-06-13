import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Github, Facebook, Mail, Linkedin } from 'lucide-react';
import FloatingFoodIcons from '@/components/common/FloatingFoodIcons';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  gstNumber: string;
  aadharNumber: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const SignInNGO: React.FC = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    gstNumber: '',
    aadharNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }
      const res = await axios.post(`${API_URL}/auth/signup`, {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        gstNumber: formData.gstNumber,
        aadharNumber: formData.aadharNumber,
      });
      localStorage.setItem('token', res.data.token || '');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      gstNumber: '',
      aadharNumber: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-200 to-green-100 flex items-center justify-center p-4 font-['Montserrat'] relative">
      <FloatingFoodIcons />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl min-h-[540px] overflow-hidden">
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded z-20">
            {error}
          </div>
        )}

        {/* Sign In Panel */}
        <div
          className={`absolute top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out ${
            isSignUp ? '-translate-x-full left-0' : 'translate-x-0 left-0'
          }`}
        >
          <form
            onSubmit={handleSignIn}
            className="h-full flex flex-col items-center justify-center px-10"
          >
            <h1 className="text-2xl font-bold mb-5 text-gray-800">Sign In</h1>
            <div className="flex gap-3 mb-5">
              {[Mail, Facebook, Github, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-green-50 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <span className="text-xs text-gray-600 mb-5">
              or use your email password
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-100 my-2 px-4 py-3 text-sm rounded-lg w-full outline-none"
              required
            />
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-100 my-2 px-4 py-3 text-sm rounded-lg w-full outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <a
              href="#"
              className="text-gray-700 text-sm hover:text-green-600 mb-4 transition-colors"
            >
              Forget Your Password?
            </a>
            <button
              type="submit"
              className="bg-green-500 text-white text-xs px-11 py-3 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-3 cursor-pointer hover:bg-green-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Sign Up Panel */}
        <div
          className={`absolute top-0 w-1/2 h-full transition-transform duration-1000 ease-in-out ${
            isSignUp ? 'translate-x-0 left-1/2' : 'translate-x-full left-1/2'
          }`}
        >
          <form
            onSubmit={handleSignUp}
            className="h-full flex flex-col items-center justify-center px-10"
          >
            <h1 className="text-2xl font-bold mb-5 text-gray-800">
              Create Account
            </h1>
            <div className="flex gap-3 mb-5">
              {[Mail, Facebook, Github, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="border border-gray-300 rounded-lg w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-green-50 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <span className="text-xs text-gray-600 mb-5">
              or use your email for registration
            </span>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="bg-gray-100 my-1 px-4 py-3 text-sm rounded-lg w-full outline-none"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-gray-100 my-1 px-4 py-3 text-sm rounded-lg w-full outline-none"
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="bg-gray-100 my-1 px-4 py-3 text-sm rounded-lg w-full outline-none"
              required
            >
              <option value="">Select Role</option>
              <option value="ngo">NGO</option>
              <option value="restaurant">Restaurant</option>
            </select>
            <input
              type="text"
              name="gstNumber"
              placeholder="GST Number"
              value={formData.gstNumber}
              onChange={handleInputChange}
              className="bg-gray-100 my-1 px-4 py-3 text-sm rounded-lg w-full outline-none"
              required
            />
            <input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar Number"
              value={formData.aadharNumber}
              onChange={handleInputChange}
              className="bg-gray-100 my-1 px-4 py-3 text-sm rounded-lg w-full outline-none"
              required
            />
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-100 my-1 px-4 py-3 text-sm rounded-lg w-full outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="bg-gray-100 my-1 px-4 py-3 text-sm rounded-lg w-full outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white text-xs px-11 py-3 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-3 cursor-pointer hover:bg-green-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Curved Toggle Panel */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-1000 ease-in-out rounded-[150px_0_0_100px] z-[1000] ${
            isSignUp
              ? 'transform -translate-x-full rounded-[0_150px_100px_0]'
              : ''
          }`}
        >
          <div
            className={`bg-gradient-to-r from-green-500 to-green-600 h-full text-white relative -left-full w-[200%] transform transition-all duration-1000 ease-in-out ${
              isSignUp ? 'translate-x-1/2' : 'translate-x-0'
            }`}
          >
            <div
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-1000 ease-in-out ${
                isSignUp ? 'translate-x-0' : '-translate-x-[200%]'
              }`}
            >
              <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
              <p className="text-sm leading-5 tracking-wide mb-5">
                Enter your personal details to use all site features
              </p>
              <button
                onClick={toggleMode}
                className="bg-transparent border border-white text-white text-xs px-11 py-3 rounded-lg font-semibold tracking-wider uppercase cursor-pointer hover:bg-white hover:text-green-600 transition-all"
              >
                Sign In
              </button>
            </div>
            <div
              className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-1000 ease-in-out ${
                isSignUp ? 'translate-x-[200%]' : 'translate-x-0'
              }`}
            >
              <h1 className="text-2xl font-bold mb-4">Welcome, Friend!</h1>
              <p className="text-sm leading-5 tracking-wide mb-5">
                Enter your personal details to use all site features
              </p>
              <button
                onClick={toggleMode}
                className="bg-transparent border border-white text-white text-xs px-11 py-3 rounded-lg font-semibold tracking-wider uppercase cursor-pointer hover:bg-white hover:text-green-600 transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInNGO;
