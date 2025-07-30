// frontend/src/components/restaurant/dashboard/MetricCard.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Carrot,
  DollarSign,
  TrendingUp,
  BarChart,
  LucideIcon,
} from "lucide-react";
import axios from "axios";

import Card from "@/components/ui/Card";
import GlowingText from "@/components/ui/GlowingText";

interface PredictedSummary {
  trainedAt: string;
  epsilon: number;
  dishes: string[];
  q_values: { [dish: string]: number } | number[];
  counts: { [dish: string]: number } | number[];
  best: string;
}

interface Metric {
  id: string;
  name: string;
  Icon: LucideIcon;
  value: number;
  unit: string;
}

const createMetrics = (summary: PredictedSummary): Metric[] => {
  if (!summary || !summary.q_values) return [];

  const { dishes = [], epsilon = 0, best = "", q_values } = summary;

  const qArray = Array.isArray(q_values)
    ? q_values
    : Object.values(q_values || {});

  const avgReward =
    qArray.reduce((sum, v) => sum + v, 0) / (qArray.length || 1);

  return [
    {
      id: "epsilon",
      name: "Epsilon",
      Icon: Carrot,
      value: parseFloat(epsilon.toFixed(2)),
      unit: "",
    },
    {
      id: "totalDishes",
      name: "Total Dishes",
      Icon: DollarSign,
      value: dishes.length || 0,
      unit: "",
    },
    {
      id: "bestValue",
      name: `Best Dish: ${best || "N/A"}`,
      Icon: TrendingUp,
      value: parseFloat(Math.max(...qArray || [0]).toFixed(2)),
      unit: "",
    },
    {
      id: "avgReward",
      name: "Avg Reward",
      Icon: BarChart,
      value: parseFloat(avgReward.toFixed(2)),
      unit: "",
    },
  ];
};

const MetricCard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authHeader = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  });

  useEffect(() => {
    setLoading(true);
   axios.get<PredictedSummary>(`${import.meta.env.VITE_API_URL}/model/summary`, authHeader())

      .then((res) => {
        const metrics = createMetrics(res.data);
        setMetrics(metrics);
      })
      .catch((err) => {
        console.error("Failed to load model summary:", err);
        setError("Could not load metrics. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="py-8 text-center text-gray-500">Loading metrics...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.Icon;
        const bgShade = idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200";

        return (
          <motion.div
            key={metric.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <Card className={`${bgShade} p-5`} glow={false}>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    className="rounded-lg bg-green-100 p-2 text-green-600"
                  >
                    <Icon size={18} />
                  </motion.div>
                  <h3 className="text-gray-800 font-medium">{metric.name}</h3>
                </div>
              </div>
              <div className="mt-2 flex items-baseline">
                <GlowingText
                  text={metric.value}
                  variant="green"
                  hasCountUp
                  decimals={2}
                  className="text-2xl font-bold text-gray-900"
                />
                {metric.unit && <span className="ml-1 text-gray-700">{metric.unit}</span>}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricCard;
