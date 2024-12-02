import React from 'react';
import { Check, Clock, Calendar, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { TodoItem } from '../../services/TodoService';

interface TodoListProps {
  items: TodoItem[];
  onToggleComplete: (id: string) => void;
}

const TodoList = ({ items, onToggleComplete }: TodoListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-600';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600';
      case 'low':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: TodoItem['type']) => {
    switch (type) {
      case 'task':
        return <Check className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'timer':
        return <Clock className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No items for today. Click the + New button to add something!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-shrink-0">
            <button
              onClick={() => onToggleComplete(item.id)}
              className={`w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center ${
                item.completed ? 'bg-purple-600 border-purple-600' : ''
              } hover:border-purple-600 transition-colors`}
            >
              {item.completed && <Check className="w-4 h-4 text-white" />}
            </button>
          </div>

          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </span>
              <span className="text-sm text-gray-500">
                {format(parseISO(`${item.date}T${item.time}`), 'h:mm a')}
              </span>
            </div>
            <h3 className="font-medium mb-1">{item.title}</h3>
            {item.description && (
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0">
            <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm">
              {getTypeIcon(item.type)}
              <span className="ml-1 capitalize">{item.type}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TodoList;