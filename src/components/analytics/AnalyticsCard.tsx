import React from 'react';
import type { Analytics } from '../../types/habit';

interface AnalyticsCardProps {
  data: Analytics;
}

const AnalyticsCard = ({ data }: AnalyticsCardProps) => {
  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Analytics</h2>
        <button className="text-sm text-gray-500">View Details</button>
      </div>
      
      <div className="bg-[#E8FFF3] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">😊</span>
          <div>
            <div className="font-medium">Positive Habits</div>
            <div className="text-green-600 font-semibold">+{data.percentageIncrease}%</div>
          </div>
        </div>
      </div>

      <div className="bg-black text-white rounded-lg p-4 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-2">Habits Wrapped</h3>
          <p className="text-3xl font-bold mb-4">2023</p>
          <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium">
            View
          </button>
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-50" />
      </div>
    </div>
  );
}

export default AnalyticsCard;