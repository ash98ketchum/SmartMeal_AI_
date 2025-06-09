// src/components/restaurant/dashboard/MetricCard.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Carrot,
  DollarSign,
  TrendingUp,
  BarChart,
  LucideIcon,
} from "lucide-react";

import Card from "@/components/ui/Card";
import GlowingText from "@/components/ui/GlowingText";
import predictedData from "@/predicted.json";

interface PredictedSummary {
  trainedAt: string;
  epsilon: number;
  dishes: string[];
  q_values: number[];
  counts: number[];
  bestAction: { dish: string; value: number };
}

interface Metric {
  id: string;
  name: string;
  Icon: LucideIcon;
  value: number;
  change: number;
  unit: string;
}

const HARDCODED_EPSILON = 0.2;

const createMetrics = (summary: PredictedSummary): Metric[] => {
  const { dishes, q_values, bestAction } = summary;
  const totalDishes = dishes.length;
  const avgReward = parseFloat(
    (q_values.reduce((sum, v) => sum + v, 0) / q_values.length).toFixed(2)
  );

  return [
    {
      id: "epsilon",
      name: "Epsilon",
      Icon: Carrot,
      value: parseFloat(HARDCODED_EPSILON.toFixed(1)),
      change: 0,
      unit: "",
    },
    {
      id: "totalDishes",
      name: "Total Dishes",
      Icon: DollarSign,
      value: totalDishes,
      change: 0,
      unit: "",
    },
    {
      id: "bestValue",
      name: `Best Dish: ${bestAction.dish}`,
      Icon: TrendingUp,
      value: parseFloat(bestAction.value.toFixed(2)),
      change: 0,
      unit: "",
    },
    {
      id: "avgReward",
      name: "Avg Reward",
      Icon: BarChart,
      value: avgReward,
      change: 0,
      unit: "",
    },
  ];
};

const MetricCard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    const summary = (predictedData as unknown) as PredictedSummary;
    setMetrics(createMetrics(summary));
  }, []);

  if (!metrics.length) {
    return (
      <div className="py-8 text-center text-gray-500">
        Loading metrics...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m, idx) => {
        const isPositive = m.change >= 0;
        const changeColor = isPositive ? "text-green-500" : "text-red-500";
        const arrow = isPositive ? "↑" : "↓";
        const bgShade = idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200";

        return (
          <motion.div
            key={m.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
          >
            <Card className={`${bgShade} flex flex-col justify-between p-5`} glow={false}>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <motion.div
                    whileHover={{ rotate: 360, transition: { duration: 1 } }}
                    className="rounded-lg bg-green-100 p-2 text-green-600"
                  >
                    <m.Icon size={18} />
                  </motion.div>
                  <h3 className="text-gray-800 font-medium">{m.name}</h3>
                </div>
                <span className={`flex items-center text-xs ${changeColor}`}>
                  {arrow} {Math.abs(m.change)}
                  {m.unit}
                </span>
              </div>
              <div className="mt-2 flex items-baseline">
                <GlowingText
                  text={m.value}
                  variant="green"
                  hasCountUp
                  decimals={m.id === "epsilon" ? 1 : 2}
                  className="text-2xl font-bold text-gray-900"
                />
                {m.unit && <span className="ml-1 text-gray-700">{m.unit}</span>}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MetricCard;
