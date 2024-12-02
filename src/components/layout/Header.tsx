import React, { useState } from 'react';
import { Search, Sun, Moon, Bell, Settings, User, LogOut, ChevronDown, Clock } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
  onTimeTrackerClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onTimeTrackerClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const currentTime = new Date();
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  const formattedDate = currentTime.toLocaleDateString('en-US', { 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const notifications = [
    {
      id: 1,
      title: 'New task completed',
      message: 'You completed "Study" task',
      time: '5m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Reminder',
      message: 'Swimming session in 30 minutes',
      time: '30m ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Streak milestone!',
      message: 'You have maintained a 7-day streak',
      time: '2h ago',
      unread: false,
    },
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center gap-4">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400">
            ‹
          </button>
          <span className="text-sm text-gray-500">Dashboard | Schedule</span>
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            onClick={onTimeTrackerClick}
          >
            <Clock className="w-6 h-6 text-gray-600" />
          </button>
          <div className="relative">
            <button 
              className="w-8 h-8 flex items-center justify-center relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                        notification.unread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="w-8 h-8 flex items-center justify-center">
            <Moon className="w-5 h-5 text-gray-600" />
          </button>

          <button 
            className="w-8 h-8 flex items-center justify-center"
            onClick={onSettingsClick}
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          <div className="relative">
            <button 
              className="flex items-center gap-2 hover:bg-gray-50 rounded-full pr-2"
              onClick={() => setShowProfile(!showProfile)}
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=faces"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">john@example.com</p>
                </div>
                <div className="py-1">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;