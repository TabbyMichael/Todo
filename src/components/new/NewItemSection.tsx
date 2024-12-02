import React, { useState } from 'react';
import { Plus, Clipboard, Calendar, FileText, Clock, FolderPlus, MessageSquare } from 'lucide-react';

interface NewItemSectionProps {
  onCreateTask: () => void;
  onCreateEvent: () => void;
  onCreateNote: () => void;
  onCreateProject: () => void;
  onStartTimer: () => void;
  onUploadFile: () => void;
  onOpenChat: () => void;
}

export default function NewItemSection({
  onCreateTask,
  onCreateEvent,
  onCreateNote,
  onCreateProject,
  onStartTimer,
  onUploadFile,
  onOpenChat,
}: NewItemSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus className="w-5 h-5" />
        New
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="flex flex-col gap-2">
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                onCreateTask();
                setIsOpen(false);
              }}
            >
              <Clipboard className="w-5 h-5 text-gray-600" />
              Task
            </button>
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                onCreateEvent();
                setIsOpen(false);
              }}
            >
              <Calendar className="w-5 h-5 text-gray-600" />
              Event
            </button>
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                onCreateNote();
                setIsOpen(false);
              }}
            >
              <FileText className="w-5 h-5 text-gray-600" />
              Note
            </button>
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                onCreateProject();
                setIsOpen(false);
              }}
            >
              <FolderPlus className="w-5 h-5 text-gray-600" />
              Project
            </button>
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                onStartTimer();
                setIsOpen(false);
              }}
            >
              <Clock className="w-5 h-5 text-gray-600" />
              Timer
            </button>
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                onUploadFile();
                setIsOpen(false);
              }}
            >
              <Clipboard className="w-5 h-5 text-gray-600" />
              Upload
            </button>
            <button
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => {
                onOpenChat();
                setIsOpen(false);
              }}
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
              Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
