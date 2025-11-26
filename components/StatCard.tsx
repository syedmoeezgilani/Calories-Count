import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon: ReactNode;
  color: 'red' | 'blue' | 'green' | 'orange' | 'purple';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon, color }) => {
  const colorMap = {
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-800">
          {value}<span className="text-sm font-medium text-slate-500 ml-1">{unit}</span>
        </p>
      </div>
    </div>
  );
};