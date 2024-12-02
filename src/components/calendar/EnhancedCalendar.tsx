import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface Task {
  id: string;
  title: string;
  date: Date;
  duration: number; // in minutes
  category: 'work' | 'personal' | 'health' | 'study';
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
}

interface CalendarViewProps {
  tasks: Task[];
  onAddTask: (date: Date) => void;
  onTaskClick: (task: Task) => void;
}

const categoryColors = {
  work: 'bg-blue-500',
  personal: 'bg-purple-500',
  health: 'bg-green-500',
  study: 'bg-yellow-500',
};

const ViewSelector: React.FC<{ view: string; onViewChange: (view: string) => void }> = ({ view, onViewChange }) => (
  <div className="flex bg-white rounded-lg p-1">
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        view === 'month' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={() => onViewChange('month')}
    >
      Month
    </button>
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        view === 'week' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={() => onViewChange('week')}
    >
      Week
    </button>
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        view === 'day' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={() => onViewChange('day')}
    >
      Day
    </button>
  </div>
);

const TaskIndicator: React.FC<{ task: Task }> = ({ task }) => (
  <div
    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${
      categoryColors[task.category]
    } ${task.completed ? 'opacity-50' : ''}`}
  >
    <span className="w-1 h-1 rounded-full bg-white" />
    <span className="truncate">{task.title}</span>
  </div>
);

const MiniCalendar: React.FC<{ selectedDate: Date; onDateSelect: (date: Date) => void }> = ({
  selectedDate,
  onDateSelect,
}) => {
  const days = useMemo(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    return eachDayOfInterval({ start, end });
  }, [selectedDate]);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-7 gap-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs text-gray-500 font-medium py-1">
            {day}
          </div>
        ))}
        {days.map((day, i) => (
          <button
            key={i}
            className={`text-center p-1 text-sm rounded-full hover:bg-purple-50 transition-colors ${
              isSameDay(day, selectedDate) ? 'bg-purple-100 text-purple-600' : ''
            }`}
            onClick={() => onDateSelect(day)}
          >
            {format(day, 'd')}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function EnhancedCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);

  // Sample tasks (replace with actual data)
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Project Meeting',
      date: new Date(),
      duration: 60,
      category: 'work',
      isRecurring: true,
      recurringPattern: 'weekly',
      completed: false,
    },
    {
      id: '2',
      title: 'Gym Session',
      date: new Date(),
      duration: 90,
      category: 'health',
      isRecurring: true,
      recurringPattern: 'daily',
      completed: true,
    },
  ]);

  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleAddTask = (date: Date) => {
    // Implement task creation logic
    console.log('Add task for date:', date);
  };

  const handleTaskClick = (task: Task) => {
    // Implement task detail view/edit logic
    console.log('Task clicked:', task);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={handleNextMonth}
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ViewSelector view={view} onViewChange={(v) => setView(v as 'month' | 'week' | 'day')} />
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowMiniCalendar(!showMiniCalendar)}
            >
              <CalendarIcon className="w-5 h-5 text-gray-600" />
            </button>
            {showMiniCalendar && (
              <div className="absolute right-0 mt-2 z-10">
                <MiniCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
          (day, i) => (
            <div key={i} className="text-center text-sm text-gray-500 font-medium py-2">
              {day}
            </div>
          )
        )}

        {days.map((day, i) => {
          const dayTasks = tasks.filter((task) => isSameDay(task.date, day));
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={i}
              className={`min-h-[120px] p-2 border rounded-lg ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              } ${isSameDay(day, new Date()) ? 'border-purple-500' : 'border-gray-100'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                <button
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => handleAddTask(day)}
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-1">
                {dayTasks.map((task) => (
                  <button
                    key={task.id}
                    className="w-full"
                    onClick={() => handleTaskClick(task)}
                  >
                    <TaskIndicator task={task} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
