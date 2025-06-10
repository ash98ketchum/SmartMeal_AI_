import React, { useEffect, useState } from "react";
import axios from "axios";

import PredictionCard, { Prediction } from "./PredictionCard";

const PredictionsSection: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 1) Fetch bandit summary
        const { data: summary } = await axios.get<{
          epsilon: number;
          dishes: string[];
          q_values: Record<string, number>;
          counts: Record<string, number>;
        }>("/api/model/summary");

        // 2) Fetch today's actual servings
        const { data: servings } = await axios.get<
          { name: string; totalEarning: number }[]
        >("/api/servings");

        // 3) Build actual earnings map
        const actualMap: Record<string, number> = {};
        servings.forEach((s) => {
          actualMap[s.name] = (actualMap[s.name] || 0) + s.totalEarning;
        });

        // 4) Compute total selection count for confidence
        const totalCount =
          Object.values(summary.counts).reduce((a, b) => a + b, 0) || 1;

        // 5) Assemble Prediction list
        const list: Prediction[] = summary.dishes.map((dish) => {
          const predictedValue = summary.q_values[dish] || 0;
          const actualValue    = actualMap[dish] || 0;
          const saved          = actualValue - predictedValue;
          const confidence     = Math.round(
            ((summary.counts[dish] || 0) / totalCount) * 100
          );

          return {
            dishName: dish,
            imageUrl: `/images/${encodeURIComponent(dish)}.jpg`, // placeholder
            ingredients: [], // fill in later
            predictedValue,
            actualValue,
            saved,
            confidence,
          };
        });

        // 6) Sort & pick top 5
        list.sort((a, b) => b.predictedValue - a.predictedValue);
        setPredictions(list.slice(0, 5));
      } catch (err) {
        console.error("Failed to load predictions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }

  if (!predictions.length) {
    return (
      <div className="py-8 text-center text-gray-500">
        No predictions available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Top Dish Predictions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map((p, idx) => (
          <PredictionCard key={p.dishName} prediction={p} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default PredictionsSection;
