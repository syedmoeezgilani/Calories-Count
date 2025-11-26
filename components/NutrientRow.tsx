import React from 'react';

interface NutrientRowProps {
  label: string;
  value: number;
  unit: string;
  colorClass?: string;
  isMain?: boolean;
}

export const NutrientRow: React.FC<NutrientRowProps> = ({ label, value, unit, colorClass = "text-slate-700", isMain = false }) => {
  return (
    <div className={`flex justify-between items-center py-2 border-b border-slate-100 last:border-0 ${isMain ? 'font-medium' : 'text-sm'}`}>
      <span className="text-slate-500">{label}</span>
      <span className={`${colorClass} ${isMain ? 'text-lg' : ''}`}>
        {value} <span className="text-xs text-slate-400 ml-0.5">{unit}</span>
      </span>
    </div>
  );
};