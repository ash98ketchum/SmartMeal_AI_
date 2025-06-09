// src/pages/restaurant/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import RestaurantLayout from "@/layouts/RestaurantLayout";
import FilterBar from "@/components/restaurant/dashboard/FilterBar";
import MetricCard from "@/components/restaurant/dashboard/MetricCard";
import ChartSection from "@/components/restaurant/dashboard/ChartSection";
import EventsList, { EventItem } from "@/components/restaurant/dashboard/EventsList";

import PredictionCard, { Prediction } from "@/components/restaurant/dashboard/PredictionCard";

import predictedData from "@/predicted.json";

interface PredictedSummary {
  dishes: string[];
  q_values: number[];
  counts: number[];
  bestAction: { dish: string; value: number };
  // other fields ignored
}

const Dashboard: React.FC = () => {
  // FilterBar state (if needed)
  const [filters, setFilters] = useState({} as any);
  // Example events array
  const [events, setEvents] = useState<EventItem[]>([]);

  // Parsed predictions from JSON
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    // 1) Load upcoming events (if you have API) else leave blank
    // setEvents([...])

    // 2) Build predictions array from predicted.json
    const summary = (predictedData as unknown) as PredictedSummary;
    const { dishes, q_values, counts } = summary;

    const preds: Prediction[] = dishes.map((dish, idx) => {
      const actual = counts[idx] ?? 0;
      const predicted = q_values[idx] ?? 0;
      const saved = Math.max(predicted - actual, 0);
      const confidence = actual
        ? Math.max(0, Math.min(100, (predicted / actual) * 100))
        : 0;

      return {
        dishName: dish,
        imageUrl: "/placeholder.png", // swap in real URLs
        ingredients: [],              // populate if you have real data
        predictedValue: predicted,
        actualValue: actual,
        saved,
        confidence: Math.round(confidence),
      };
    });

    setPredictions(preds);
  }, []);

  return (
    // <RestaurantLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Filters */}
        <FilterBar
          onFilterChange={(f) => setFilters(f)}
          className="mb-6"
        />

        {/* Metrics */}
        <MetricCard />

        {/* Charts & Events */}
        <ChartSection className="mb-12" />
        <EventsList events={events} />

        {/* Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="mb-4 text-2xl font-semibold text-green-600">
            Recent Predictions
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {predictions.map((p, i) => (
              <PredictionCard key={p.dishName} prediction={p} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    // </RestaurantLayout>
  );
};

export default Dashboard;
