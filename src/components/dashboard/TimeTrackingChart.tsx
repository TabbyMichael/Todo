import React from 'react';
import { Clock } from 'lucide-react';
import type { DailyProgress } from '../../types/habit';

interface TimeTrackingChartProps {
  data: DailyProgress[];
}

const TimeTrackingChart = ({ data }: TimeTrackingChartProps) => {
  const maxTime = Math.max(...data.map(d => d.timeSpent));
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Time Tracking</h2>
          <p className="text-sm text-gray-500">Daily activity duration</p>
        </div>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="flex items-end h-48 gap-3">
        {data.map((day, index) => {
          const height = (day.timeSpent / maxTime) * 100;
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block">
                <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  {day.timeSpent} minutes
                </div>
              </div>
              <div className="w-full relative bg-gray-50 rounded-lg" style={{ height: '100%' }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#6C5CE7] to-[#6C5CE7]/60 rounded-lg transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-500">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimeTrackingChart;