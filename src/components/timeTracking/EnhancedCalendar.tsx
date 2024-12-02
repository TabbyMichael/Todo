import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, MoreHorizontal, Clock, Calendar as CalendarIcon, Search } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfDay, endOfDay } from 'date-fns';
import { taskHistoryService, TaskRecord } from '../../services/TaskHistoryDB';
import TaskHistoryModal from './TaskHistoryModal';

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

const TaskIndicator: React.FC<{ task: TaskRecord }> = ({ task }) => (
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
    <div className="absolute top-full right-0 mt-2 bg-white rounded-xl p-4 shadow-lg z-50">
      <div className="grid grid-cols-7 gap-1 min-w-[280px]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs text-gray-500 font-medium py-1">
            {day}
          </div>
        ))}
        {days.map((day, i) => (
          <button
            key={i}
            className={`text-center p-2 text-sm rounded-full hover:bg-purple-50 transition-colors ${
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
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; color: string }>>([]);
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [taskHistory, setTaskHistory] = useState<NonNullable<TaskRecord['timeTracking']>>([]);
  const [taskStats, setTaskStats] = useState<{
    totalTime: number;
    averageSessionTime: number;
    totalBreakTime: number;
    completionRate: number;
  } | null>(null);

  // Load tasks for the current month
  useEffect(() => {
    const loadTasks = async () => {
      const start = startOfDay(startOfMonth(currentDate));
      const end = endOfDay(endOfMonth(currentDate));
      const monthTasks = await taskHistoryService.getTasksByDateRange(start, end);
      setTasks(monthTasks);
    };

    const loadCategories = async () => {
      const allCategories = await taskHistoryService.getAllCategories();
      setCategories(allCategories);
    };

    loadTasks();
    loadCategories();
  }, [currentDate]);

  // Search functionality
  useEffect(() => {
    const searchTasks = async () => {
      if (searchQuery.trim()) {
        const results = await taskHistoryService.searchTasks(searchQuery);
        setTasks(results);
      } else {
        const start = startOfDay(startOfMonth(currentDate));
        const end = endOfDay(endOfMonth(currentDate));
        const monthTasks = await taskHistoryService.getTasksByDateRange(start, end);
        setTasks(monthTasks);
      }
    };

    searchTasks();
  }, [searchQuery, currentDate]);

  const handleAddTask = async (date: Date) => {
    const taskId = await taskHistoryService.addTask({
      title: 'New Task',
      date,
      duration: 0,
      category: 'work',
      isRecurring: false,
      completed: false,
    });

    const start = startOfDay(startOfMonth(currentDate));
    const end = endOfDay(endOfMonth(currentDate));
    const updatedTasks = await taskHistoryService.getTasksByDateRange(start, end);
    setTasks(updatedTasks);
  };

  const handleTaskClick = async (task: TaskRecord) => {
    setSelectedTask(task);
    const history = await taskHistoryService.getTaskHistory(task.id);
    const stats = await taskHistoryService.getTaskStats(task.id);
    setTaskHistory(history);
    setTaskStats(stats);
  };

  const days = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {selectedTask && taskHistory && taskStats && (
        <TaskHistoryModal
          task={selectedTask}
          taskHistory={taskHistory}
          taskStats={taskStats}
          onClose={() => {
            setSelectedTask(null);
            setTaskHistory([]);
            setTaskStats(null);
          }}
        />
      )}

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
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            {showSearch && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-2 z-50">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>
          <ViewSelector view={view} onViewChange={(v) => setView(v as 'month' | 'week' | 'day')} />
          <div className="relative">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowMiniCalendar(!showMiniCalendar)}
            >
              <CalendarIcon className="w-5 h-5 text-gray-600" />
            </button>
            {showMiniCalendar && (
              <MiniCalendar
                selectedDate={selectedDate}
                onDateSelect={(date) => {
                  setSelectedDate(date);
                  setShowMiniCalendar(false);
                }}
              />
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
          const dayTasks = tasks.filter((task) => isSameDay(new Date(task.date), day));
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
