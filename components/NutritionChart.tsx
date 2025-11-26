import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { NutritionData } from '../types';

interface NutritionChartProps {
  data: NutritionData;
}

const COLORS = ['#F87171', '#60A5FA', '#34D399']; // Red (Fat), Blue (Carbs), Green (Protein)

export const NutritionChart: React.FC<NutritionChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Fat', value: data.fat },
    { name: 'Carbs', value: data.carbs },
    { name: 'Protein', value: data.protein },
  ];

  // Filter out zero values to avoid empty segments looking weird
  const activeData = chartData.filter(d => d.value > 0);

  if (activeData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400 bg-slate-50 rounded-xl">
        No macronutrient data available
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-white rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide text-center">Calorie Source Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={activeData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {activeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}g`, '']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};