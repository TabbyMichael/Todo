import React, { useState, useEffect, useRef } from 'react';
import { X, Minimize2, Maximize2, Play, Pause, RotateCcw, Coffee } from 'lucide-react';

interface TimerState {
  isRunning: boolean;
  timeElapsed: number;
  breakTime: boolean;
  taskName: string;
}

interface FloatingTimerProps {
  onClose: () => void;
  position?: { x: number; y: number };
  opacity?: number;
}

export default function FloatingTimer({ onClose, position = { x: 20, y: 20 }, opacity = 0.9 }: FloatingTimerProps) {
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    timeElapsed: 0,
    breakTime: false,
    taskName: 'Current Task',
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(position);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const timerRef = useRef<number | null>(null);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle timer tick
  useEffect(() => {
    if (timerState.isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerState.isRunning]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      x: e.clientX - dragPosition.x,
      y: e.clientY - dragPosition.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragRef.current) {
      setDragPosition({
        x: e.clientX - dragRef.current.x,
        y: e.clientY - dragRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragRef.current = null;
  };

  // Timer controls
  const toggleTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setTimerState(prev => ({ ...prev, timeElapsed: 0, isRunning: false }));
  };

  const toggleBreak = () => {
    setTimerState(prev => ({ ...prev, breakTime: !prev.breakTime }));
  };

  return (
    <div
      className={`fixed select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: dragPosition.x,
        top: dragPosition.y,
        opacity,
        transition: isDragging ? 'none' : 'all 0.2s ease',
        zIndex: 9999,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className={`bg-white rounded-xl shadow-lg ${
          isMinimized ? 'w-auto' : 'w-80'
        } overflow-hidden backdrop-blur-lg bg-opacity-90`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-purple-600 text-white">
          <div className="flex items-center gap-2">
            {!isMinimized && <span className="font-medium">Time Tracker</span>}
            {timerState.breakTime && <Coffee className="w-4 h-4" />}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-1 hover:bg-white/20 rounded transition-colors"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              className="p-1 hover:bg-white/20 rounded transition-colors"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timer Content */}
        {!isMinimized && (
          <div className="p-4">
            <input
              type="text"
              value={timerState.taskName}
              onChange={(e) =>
                setTimerState(prev => ({ ...prev, taskName: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg bg-gray-100 mb-4"
              placeholder="Task name..."
            />

            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-800 font-mono">
                {formatTime(timerState.timeElapsed)}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <button
                className="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
                onClick={toggleTimer}
              >
                {timerState.isRunning ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <button
                className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                onClick={resetTimer}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                className={`p-3 rounded-full transition-colors ${
                  timerState.breakTime
                    ? 'bg-green-100 text-green-600 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={toggleBreak}
              >
                <Coffee className="w-5 h-5" />
              </button>
            </div>

            {timerState.breakTime && (
              <div className="text-center text-sm text-green-600 bg-green-50 rounded-lg p-2">
                Break time! Take a moment to relax.
              </div>
            )}
          </div>
        )}

        {/* Minimized View */}
        {isMinimized && (
          <div className="p-2 flex items-center gap-2">
            <span className="font-mono font-bold text-sm">
              {formatTime(timerState.timeElapsed)}
            </span>
            <button
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              onClick={toggleTimer}
            >
              {timerState.isRunning ? (
                <Pause className="w-4 h-4 text-gray-600" />
              ) : (
                <Play className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
