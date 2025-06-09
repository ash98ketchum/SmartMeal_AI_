// src/pages/restaurant/History.tsx

import React from "react";
import { motion } from "framer-motion";
import { Calendar, Search } from "lucide-react";

import RestaurantLayout from "@/layouts/RestaurantLayout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import predictedData from "@/predicted.json";

interface PredictedSummary {
  trainedAt: string;
  epsilon: number;
  dishes: string[];
  q_values: number[];
  counts: number[];
  bestAction: { dish: string; value: number };
}

export interface Prediction {
  id: string;
  dishName: string;
  imageUrl: string;
  ingredients: string[];
  predictedValue: number;
  actualValue: number;
  saved: number;
  date: string;
}

const History: React.FC = () => {
  // Build minimal Prediction history from predicted.json
  const { dishes, q_values, counts } = (predictedData as unknown) as PredictedSummary;
  // Assume all from same date for now
  const today = new Date(predictedData.trainedAt).toISOString().split("T")[0];

  const predictions: Prediction[] = dishes.map((dish, idx) => {
    const predicted = q_values[idx] || 0;
    const actual = counts[idx] || 0;
    const saved = Math.max(predicted - actual, 0);
    return {
      id: `${today}-${idx}`,
      dishName: dish,
      imageUrl: "/placeholder.png",
      ingredients: [],
      predictedValue: predicted,
      actualValue: actual,
      saved,
      date: today,
    };
  });

  // Group by date (here just one)
  const grouped: Record<string, Prediction[]> = { [today]: predictions };
  const sortedDates = Object.keys(grouped).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    // <RestaurantLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="mb-6 rounded-lg bg-white/50 p-4 backdrop-blur">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search history..."
                className="w-full sm:w-64 rounded-lg border border-gray-200 bg-white px-3 py-2 pl-10 text-gray-800 focus:ring-2 focus:ring-green-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="transparent" className="flex items-center">
                <Calendar size={16} className="mr-2" />
                Date Range
              </Button>
              <Button variant="outline">Export Data</Button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {sortedDates.map((date, dIdx) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dIdx * 0.1, duration: 0.5 }}
            >
              <h2 className="mb-4 text-lg font-medium text-gray-800">
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <div className="space-y-4">
                {grouped[date].map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.4 }}
                  >
                    <Card className="p-4" glow={false}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 overflow-hidden rounded-md bg-green-50">
                            <img
                              src={p.imageUrl}
                              alt={p.dishName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {p.dishName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {p.ingredients.length} ingredients • ${" "}
                              {p.saved.toFixed(2)} saved
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-col sm:mt-0 sm:flex-row sm:items-center sm:gap-3">
                          <div className="text-right">
                            <p className="text-sm">
                              <span className="text-green-600">
                                Predicted: ${p.predictedValue.toFixed(2)}
                              </span>
                            </p>
                            <p className="text-sm">
                              <span className="text-gray-700">
                                Actual: ${p.actualValue.toFixed(2)}
                              </span>
                            </p>
                          </div>
                          <Button variant="transparent" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    // </RestaurantLayout>
  );
};

export default History;