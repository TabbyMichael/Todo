import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Calendar from './components/calendar/Calendar';
import TodoList from './components/todos/TodoList';
import AnalyticsCard from './components/analytics/AnalyticsCard';
import TimeTrackingChart from './components/dashboard/TimeTrackingChart';
import SettingsPanel from './components/settings/SettingsPanel';
import TimeTracker from './components/timeTracking/TimeTracker';
import NewItemSection from './components/new/NewItemSection';
import CreateItemModal from './components/new/CreateItemModal';
import AuthModal from './components/auth/AuthModal';
import { User } from 'lucide-react';
import { todoService, TodoItem } from './services/TodoService';
import { format } from 'date-fns';

const mockAnalytics = {
  positiveHabits: 5,
  percentageIncrease: 58.2
};

const mockTimeTracking = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
  completed: Math.floor(Math.random() * 10),
  total: 10,
  timeSpent: Math.floor(Math.random() * 180)
}));

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showTimeTracker, setShowTimeTracker] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState<'task' | 'event' | 'note' | 'project' | 'timer' | 'upload' | 'chat'>('task');
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Load todos on component mount
  useEffect(() => {
    const loadTodos = async () => {
      const today = format(new Date(), 'yyyy-MM-dd');
      const todaysTodos = await todoService.getTodosByDate(today);
      setTodos(todaysTodos);
    };
    loadTodos();
  }, []);

  const handleSettingsClick = () => {
    setShowSettings(!showSettings);
    setShowTimeTracker(false);
  };

  const handleTimeTrackerClick = () => {
    setShowTimeTracker(!showTimeTracker);
    setShowSettings(false);
  };

  const handleCreateTask = () => {
    setCreateModalType('task');
    setShowCreateModal(true);
  };

  const handleCreateEvent = () => {
    setCreateModalType('event');
    setShowCreateModal(true);
  };

  const handleCreateNote = () => {
    setCreateModalType('note');
    setShowCreateModal(true);
  };

  const handleCreateProject = () => {
    setCreateModalType('project');
    setShowCreateModal(true);
  };

  const handleStartTimer = () => {
    setCreateModalType('timer');
    setShowCreateModal(true);
  };

  const handleUploadFile = () => {
    setCreateModalType('upload');
    setShowCreateModal(true);
  };

  const handleOpenChat = () => {
    setCreateModalType('chat');
    setShowCreateModal(true);
  };

  const handleSaveItem = async (itemData: TodoItem) => {
    // Save the item to IndexedDB
    await todoService.addTodo(itemData);
    
    // Update the local state
    setTodos([...todos, itemData]);
  };

  const handleToggleComplete = async (id: string) => {
    await todoService.toggleTodoCompletion(id);
    const updatedTodo = await todoService.getTodo(id);
    if (updatedTodo) {
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Header onSettingsClick={handleSettingsClick} onTimeTrackerClick={handleTimeTrackerClick} />
      
      <div className="absolute top-4 right-4">
        <button onClick={() => setShowAuthModal(true)} className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors">
          <User className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {showSettings ? (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      ) : showTimeTracker ? (
        <TimeTracker />
      ) : (
        <main className="container mx-auto p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Happy Tuesday 👋</h1>
              <p className="text-gray-500">30 Dec 2023, 10:03 am</p>
            </div>
            <NewItemSection
              onCreateTask={handleCreateTask}
              onCreateEvent={handleCreateEvent}
              onCreateNote={handleCreateNote}
              onCreateProject={handleCreateProject}
              onStartTimer={handleStartTimer}
              onUploadFile={handleUploadFile}
              onOpenChat={handleOpenChat}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Calendar />
              <TimeTrackingChart data={mockTimeTracking} />
            </div>

            <div className="space-y-6">
              <AnalyticsCard data={mockAnalytics} />
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Today's Todos</h2>
                <TodoList 
                  items={todos}
                  onToggleComplete={handleToggleComplete}
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {showCreateModal && (
        <CreateItemModal
          type={createModalType}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveItem}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}