// frontend/src/components/restaurant/dashboard/PredictionSection.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import PredictionCard, { Prediction } from "./PredictionCard";

interface RawPredictions {
  trainedAt: string;
  epsilon: number;
  dishes: string[];
  q_values: number[];
  counts: number[];
  averageRewards: Record<string, number>;
  bestAction: { dish: string; value: number };
}

const PredictionSection: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: summary } = await axios.get<RawPredictions>("/data/predicted.json");

        const { data: servingsRaw } = await axios.get<any>("/api/servings");
        const servings = Array.isArray(servingsRaw) ? servingsRaw : [];

        const actualMap: Record<string, number> = {};
        servings.forEach((s) => {
          actualMap[s.name] = (actualMap[s.name] || 0) + (s.totalEarning || 0);
        });

        const totalCount = summary.counts?.reduce((sum, c) => sum + c, 0) || 1;

        const list: Prediction[] = (summary.dishes || []).map((dish, i) => {
          const predictedValue = summary.averageRewards?.[dish] || 0;
          const actualValue = actualMap[dish] || 0;
          const saved = actualValue - predictedValue;
          const confidence = Math.round((summary.counts?.[i] || 0) / totalCount * 100);

          return {
            dishName: dish,
            imageUrl: `/images/${encodeURIComponent(dish)}.jpg`,
            ingredients: [],
            predictedValue,
            actualValue,
            saved,
            confidence,
          };
        });

        list.sort((a, b) => b.predictedValue - a.predictedValue);
        setPredictions(list.slice(0, 5));
      } catch (err) {
        console.error("Failed to load predictions:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="py-8 text-center text-gray-500">Loading...</div>;
  if (!predictions.length) return <div className="py-8 text-center text-gray-500">No predictions available.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Top Dish Predictions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map((p, idx) => (
          <PredictionCard key={p.dishName} prediction={p} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default PredictionSection;
