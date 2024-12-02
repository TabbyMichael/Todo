import React, { useState } from 'react';
import EnhancedCalendar from './EnhancedCalendar';
import FloatingTimer from './FloatingTimer';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

export default function TimeTracker() {
  const [showFloatingTimer, setShowFloatingTimer] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Time Management</h1>
        <div className="flex items-center gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => setShowFloatingTimer(!showFloatingTimer)}
          >
            <Clock className="w-5 h-5" />
            {showFloatingTimer ? 'Hide Timer' : 'Show Timer'}
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <CalendarIcon className="w-5 h-5" />
            {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
          </button>
        </div>
      </div>

      {showCalendar && (
        <div className="mb-6">
          <EnhancedCalendar />
        </div>
      )}

      {showFloatingTimer && (
        <FloatingTimer
          onClose={() => setShowFloatingTimer(false)}
          position={{ x: window.innerWidth - 340, y: 20 }}
        />
      )}
    </div>
  );
}
