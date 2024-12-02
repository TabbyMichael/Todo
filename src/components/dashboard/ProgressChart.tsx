import React from 'react';
import type { DailyProgress } from '../../types/habit';

interface ProgressChartProps {
  data: DailyProgress[];
}

const ProgressChart = ({ data }: ProgressChartProps) => {
  const maxValue = Math.max(...data.map(d => d.total));
  
  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Weekly Progress</h2>
      <div className="flex items-end h-40 gap-3">
        {data.map((day, index) => {
          const height = (day.completed / maxValue) * 100;
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full relative bg-gray-100 rounded-t-lg" style={{ height: '100%' }}>
                <div
                  className="absolute bottom-0 w-full bg-[#6C5CE7] rounded-t-lg transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressChart;