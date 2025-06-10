import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const barData = [
  { date: '06-01', meals: 12, location: 'Shelter A', trend: [{ v:5 },{v:8},{v:6}] },
  { date: '06-02', meals:  8, location: 'Shelter B', trend: [{ v:3 },{v:4},{v:7}] },
  { date: '06-03', meals: 15, location: 'Shelter C', trend: [{ v:9 },{v:5},{v:6}] },
  { date: '06-04', meals: 10, location: 'Shelter A', trend: [{ v:6 },{v:10},{v:4}] },
  { date: '06-05', meals: 18, location: 'Shelter B', trend: [{ v:12},{v:7},{v:9}] },
];

const HistoryNGO: React.FC = () => {
  const [records] = useState(barData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 p-6">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        className="text-3xl font-extrabold text-gray-800 mb-6 text-center"
      >
        Your History
      </motion.h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 mb-6">
        <input type="text" placeholder="Search…" className="flex-1 px-4 py-2 border rounded-lg" />
        <input type="date" className="px-4 py-2 border rounded-lg" />
        <input type="date" className="px-4 py-2 border rounded-lg" />
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mt-2 md:mt-0">
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead className="bg-green-50">
            <tr>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Meals</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Trend</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.date} className="hover:bg-gray-50">
                <td className="p-4">{r.date}</td>
                <td className="p-4">{r.meals}</td>
                <td className="p-4">{r.location}</td>
                <td className="p-4">
                  <ResponsiveContainer width={80} height={30}>
                    <LineChart data={r.trend}>
                      <Line dataKey="v" stroke="#4CAF50" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryNGO;
