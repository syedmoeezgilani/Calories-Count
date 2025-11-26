import React, { useState } from 'react';
import { fetchNutritionInfo } from './services/gemini';
import { NutritionData, FetchStatus } from './types';
import { NutritionChart } from './components/NutritionChart';
import { StatCard } from './components/StatCard';
import { NutrientRow } from './components/NutrientRow';
import { 
  Search, 
  Flame, 
  Dumbbell, 
  Wheat, 
  Droplet, 
  Info, 
  ChefHat, 
  Loader2 
} from 'lucide-react';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<FetchStatus>(FetchStatus.IDLE);
  const [data, setData] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setStatus(FetchStatus.LOADING);
    setError(null);
    setData(null);

    try {
      const result = await fetchNutritionInfo(query);
      setData(result);
      setStatus(FetchStatus.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus(FetchStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 p-2 rounded-lg text-white">
              <ChefHat size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">NutriScan AI</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        {/* Search Section */}
        <section className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">What are you eating?</h2>
            <p className="text-slate-500 text-lg">Enter a food name or meal to get an instant nutritional breakdown.</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Avocado Toast, Grilled Chicken Caesar Salad..."
              className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-300 shadow-sm focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none transition-all text-lg"
              disabled={status === FetchStatus.LOADING}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <button
              type="submit"
              disabled={status === FetchStatus.LOADING || !query.trim()}
              className="absolute right-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
              {status === FetchStatus.LOADING ? <Loader2 className="animate-spin" size={20} /> : 'Analyze'}
            </button>
          </form>
        </section>

        {/* Error State */}
        {status === FetchStatus.ERROR && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center text-red-700">
            <p>{error || "Unable to fetch nutrition data. Please try again."}</p>
          </div>
        )}

        {/* Loading State Placeholder - optional purely visual enhancement while loading could go here, but button spinner handles basic feedback */}

        {/* Results Section */}
        {status === FetchStatus.SUCCESS && data && (
          <div className="animate-fade-in-up space-y-6">
            
            {/* Title & Serving Size */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 capitalize">{data.foodName}</h2>
                <p className="text-slate-500 mt-1">Serving Size: <span className="font-medium text-slate-700">{data.servingSize}</span></p>
              </div>
              <div className="bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 max-w-md">
                <div className="flex gap-2">
                  <Info className="text-emerald-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-emerald-800 leading-relaxed">{data.healthTip}</p>
                </div>
              </div>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                title="Calories" 
                value={data.calories} 
                unit="kcal" 
                color="orange" 
                icon={<Flame size={24} />} 
              />
              <StatCard 
                title="Protein" 
                value={data.protein} 
                unit="g" 
                color="green" 
                icon={<Dumbbell size={24} />} 
              />
              <StatCard 
                title="Carbs" 
                value={data.carbs} 
                unit="g" 
                color="blue" 
                icon={<Wheat size={24} />} 
              />
              <StatCard 
                title="Fat" 
                value={data.fat} 
                unit="g" 
                color="red" 
                icon={<Droplet size={24} />} 
              />
            </div>

            {/* Detailed Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Detailed List */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  Nutrition Facts
                </h3>
                <div className="space-y-1">
                  <NutrientRow label="Calories" value={data.calories} unit="kcal" isMain />
                  <div className="border-t border-slate-100 my-2"></div>
                  <NutrientRow label="Total Fat" value={data.fat} unit="g" isMain colorClass="text-red-600" />
                  <NutrientRow label="Total Carbohydrates" value={data.carbs} unit="g" isMain colorClass="text-blue-600" />
                  <div className="pl-4 border-l-2 border-slate-100 ml-1">
                    <NutrientRow label="Dietary Fiber" value={data.fiber} unit="g" />
                    <NutrientRow label="Sugars" value={data.sugar} unit="g" />
                  </div>
                  <NutrientRow label="Protein" value={data.protein} unit="g" isMain colorClass="text-emerald-600" />
                  <div className="border-t border-slate-100 my-2"></div>
                  <NutrientRow label="Cholesterol" value={data.cholesterol} unit="mg" />
                  <NutrientRow label="Sodium" value={data.sodium} unit="mg" />
                </div>
              </div>

              {/* Chart */}
              <NutritionChart data={data} />
            </div>

          </div>
        )}
      </main>

      {/* Footer disclaimer */}
      <footer className="fixed bottom-0 w-full bg-slate-50/90 backdrop-blur text-center py-4 border-t border-slate-200 text-xs text-slate-400">
        AI-generated results may vary. Consult a professional for medical advice.
      </footer>
    </div>
  );
};

export default App;