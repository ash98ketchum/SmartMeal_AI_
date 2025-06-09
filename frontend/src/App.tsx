import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";
import RestaurantLayout from "@/layouts/RestaurantLayout";

import Landing from "@/pages/public/Landing";
import FoodDetails from "@/pages/public/FoodDetails";
import Reviews from "@/pages/public/Reviews";
import FAQ from "@/pages/public/FAQ";

import SigninNGO from "@/pages/authentication/SigninNGO";
import SigninRestaurant from "@/pages/authentication/SigninRestaurant";

import Dashboard from "@/pages/restaurant/Dashboard";
import TodaysServing from "@/pages/restaurant/TodaysServing";
import EventsPage from "@/pages/restaurant/Events";
import Settings from "@/pages/restaurant/Settings";
import History from "@/pages/restaurant/History";
// import RestaurantFAQ from "@/pages/restaurant/RestaurantFAQ";

const App: React.FC = () => (
  <Router>
    <Routes>
      {/* Public */}
      <Route path="/" element={<MainLayout><Landing /></MainLayout>} />
      <Route path="/food-details" element={<MainLayout><FoodDetails /></MainLayout>} />
      <Route path="/reviews" element={<MainLayout><Reviews /></MainLayout>} />
      <Route path="/faq" element={<MainLayout><FAQ /></MainLayout>} />

      {/* Auth */}
      <Route path="/signin/ngo" element={<SigninNGO />} />
      <Route path="/signin/restaurant" element={<SigninRestaurant />} />

      {/* Restaurant area with nested routes */}
      <Route path="/restaurant" element={<RestaurantLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="serving" element={<TodaysServing />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="history" element={<History />} />
        {/*
        <Route path="faq" element={<RestaurantFAQ />} />
        */}
        {/* catch-all back to dashboard */}
        <Route path="*" element={<Navigate to="/restaurant" replace />} />
      </Route>
    </Routes>
  </Router>
);

export default App;
