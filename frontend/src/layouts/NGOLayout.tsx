// src/layouts/NGOLayout.tsx
import React, { useState } from 'react';
import { Link, NavLink, Outlet , useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Home, Grid, Clock, Archive, Menu, X, StarIcon } from 'lucide-react';
import Footer from '@/components/common/Footer';

const NGOLayout: React.FC = () => {
  const navigate = useNavigate();
  const [showMobile, setShowMobile] = useState(false);

  const links = [
    { to: '/ngo',                           label: 'Dashboard',      Icon: Home    },
    { to: '/ngo/features',                  label: 'Features',       Icon: Grid    },
    { to: '/ngo/features/pickup-tracker',   label: 'Pickup Tracker', Icon: Clock   },
    { to: '/ngo/history',                   label: 'History',        Icon: Archive },
    { to: '/ngo/feedback',                   label: 'Feedback',        Icon: StarIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* ─── Logo ─── */}
            <Link to="/" className="flex items-center space-x-2 select-none">
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <ChefHat className="h-8 w-8 text-green-600" />
              </motion.div>
              <span className="bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-xl font-bold text-transparent">
                SmartMeal AI 
              </span>
            </Link>

            {/* ─── Desktop Links ─── */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {links.map(({ to, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/ngo'}
                  className={({ isActive }) =>
                    `flex items-center space-x-1 font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-green-600'
                        : 'text-gray-700 hover:text-green-600'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>

            {/* ─── Mobile toggle ─── */}
            <button
              onClick={() => setShowMobile(o => !o)}
              className="rounded-lg p-2 transition-colors duration-200 hover:bg-gray-100 md:hidden"
              aria-label="Toggle Menu"
            >
              {showMobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* ─── Mobile menu ─── */}
          <AnimatePresence>
            {showMobile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden"
              >
                <div className="flex flex-col space-y-4 border-t border-gray-200 py-4">
                  {links.map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setShowMobile(false)}
                      className="flex items-center space-x-2 font-medium text-gray-700 px-4 py-2 transition-colors duration-200 hover:text-green-600"
                    >
                      {/* find the matching icon */}
                      {links.find(l => l.to === to)?.Icon({ className: 'h-5 w-5' })}
                      <span>{label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Render the currently selected NGO page */}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default NGOLayout;
