import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarDay } from '../../types/habit';

const Calendar = () => {
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const days: CalendarDay[] = Array.from({ length: 31 }, (_, i) => ({
    date: i + 1,
    isActive: i + 1 === currentDate.getDate(),
    hasEvents: Math.random() > 0.7,
    timeSpent: Math.floor(Math.random() * 180) // Random time spent (0-180 minutes)
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{month}, {year}</h2>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-center py-2">
            <span className="text-xs font-medium text-gray-500">{day}</span>
          </div>
        ))}
        
        {days.map((day, index) => (
          <div
            key={index}
            className="aspect-square relative group cursor-pointer"
          >
            <div className={`
              w-full h-full rounded-lg flex flex-col items-center justify-center
              ${day.isActive ? 'bg-[#6C5CE7] text-white' : 'hover:bg-gray-50'}
              ${day.hasEvents ? 'font-semibold' : ''}
              transition-colors
            `}>
              <span className="text-sm">{day.date}</span>
              {day.timeSpent > 0 && (
                <div className="h-1 w-8 bg-[#6C5CE7]/20 rounded-full mt-1">
                  <div 
                    className="h-full bg-[#6C5CE7] rounded-full"
                    style={{ width: `${(day.timeSpent / 180) * 100}%` }}
                  />
                </div>
              )}
            </div>
            {day.timeSpent > 0 && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded">
                  {day.timeSpent} min
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;