import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import type { Habit } from '../../types/habit';

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
}

const HabitCard = ({ habit, onComplete }: HabitCardProps) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{habit.title}</h3>
        <button
          onClick={() => onComplete(habit.id)}
          className="p-2 hover:bg-[#6C5CE7]/10 rounded-full transition-colors"
        >
          <CheckCircle className="w-6 h-6 text-[#6C5CE7]" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Clock className="w-4 h-4" />
        <span>{habit.timeOfDay}</span>
        {habit.location && (
          <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
            {habit.location}
          </span>
        )}
      </div>
      
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#6C5CE7] rounded-full transition-all duration-300"
            style={{ width: `${(habit.streak / 7) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-[#6C5CE7]">
          {habit.streak} day streak
        </span>
      </div>
    </div>
  );
};

export default HabitCard;