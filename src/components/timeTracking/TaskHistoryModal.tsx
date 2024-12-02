import React from 'react';
import { X, Clock, Calendar, Tag, CheckCircle, RotateCcw, Coffee } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { TaskRecord } from '../../services/TaskHistoryDB';

interface TaskHistoryModalProps {
  task: TaskRecord;
  taskHistory: NonNullable<TaskRecord['timeTracking']>;
  taskStats: {
    totalTime: number;
    averageSessionTime: number;
    totalBreakTime: number;
    completionRate: number;
  };
  onClose: () => void;
}

const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours}h ${minutes}m ${remainingSeconds}s`;
};

export default function TaskHistoryModal({
  task,
  taskHistory,
  taskStats,
  onClose,
}: TaskHistoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Task Details */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>Created {formatDistanceToNow(new Date(task.createdAt))} ago</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-5 h-5" />
                <span className="capitalize">{task.category}</span>
              </div>
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>Total time: {formatDuration(taskStats.totalTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <RotateCcw className="w-5 h-5" />
                <span>Average session: {formatDuration(taskStats.averageSessionTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Coffee className="w-5 h-5" />
                <span>Break time: {formatDuration(taskStats.totalBreakTime)}</span>
              </div>
            </div>
          </div>

          {/* Task Description */}
          {task.description && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-600">{task.description}</p>
            </div>
          )}

          {/* Time Tracking History */}
          <div>
            <h3 className="text-lg font-medium mb-4">Time Tracking History</h3>
            <div className="space-y-4">
              {taskHistory.map((session, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      Session {taskHistory.length - index}
                    </span>
                    <span className="text-gray-500">
                      {format(new Date(session.startTime), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div>
                      Start: {format(new Date(session.startTime), 'h:mm a')}
                    </div>
                    <div>
                      End: {format(new Date(session.endTime), 'h:mm a')}
                    </div>
                    <div>
                      Duration:{' '}
                      {formatDuration(
                        new Date(session.endTime).getTime() -
                          new Date(session.startTime).getTime()
                      )}
                    </div>
                  </div>
                  {session.breaks.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        Breaks:
                      </div>
                      <div className="space-y-1">
                        {session.breaks.map((break_, breakIndex) => (
                          <div
                            key={breakIndex}
                            className="text-sm text-gray-600 flex items-center gap-2"
                          >
                            <Coffee className="w-4 h-4" />
                            {format(new Date(break_.start), 'h:mm a')} -{' '}
                            {format(new Date(break_.end), 'h:mm a')} (
                            {formatDuration(
                              new Date(break_.end).getTime() -
                                new Date(break_.start).getTime()
                            )}
                            )
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
