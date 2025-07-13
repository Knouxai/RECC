import React, { useState } from 'react';
import { type Recording } from '../hooks/useScreenRecording';
import "../styles/glassmorphism.css";

interface VideoGalleryProps {
  darkMode: boolean;
  recordings: Recording[];
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  darkMode,
  recordings,
  onDelete,
  onRename,
}) => {
  const [selectedRecordingId, setSelectedRecordingId] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'name' | 'duration'>('date-desc');

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const kilobytes = bytes / 1024;
    if (kilobytes < 1024) return `${kilobytes.toFixed(1)} KB`;
    const megabytes = kilobytes / 1024;
    if (megabytes < 1024) return `${megabytes.toFixed(1)} MB`;
    const gigabytes = megabytes / 1024;
    return `${gigabytes.toFixed(1)} GB`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredRecordings = recordings
    .filter(recording => recording.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortOrder) {
        case 'date-desc':
          return b.date.getTime() - a.date.getTime();
        case 'date-asc':
          return a.date.getTime() - b.date.getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

  const selectedRecording = selectedRecordingId 
    ? recordings.find(r => r.id === selectedRecordingId) 
    : null;

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this recording?')) {
      onDelete(id);
      if (selectedRecordingId === id) {
        setSelectedRecordingId(null);
      }
    }
  };

  const handleRename = () => {
    if (selectedRecordingId && newName.trim()) {
      onRename(selectedRecordingId, newName);
      setIsRenaming(false);
      setNewName('');
    }
  };

  const startRenaming = (recording: Recording) => {
    setSelectedRecordingId(recording.id);
    setNewName(recording.name);
    setIsRenaming(true);
  };

  return (
    <div className={`glass-card p-6 ${darkMode ? '' : 'light-mode'}`}>
      <h2 className="text-2xl font-bold mb-6">Video Gallery</h2>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left side - Recording list */}
        <div className="lg:w-1/2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search recordings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-opacity-20 bg-gray-700 rounded-lg border border-gray-600 px-4 py-2 pr-8"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute right-3 top-2.5"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="neon-button px-3"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name">Name</option>
              <option value="duration">Duration</option>
            </select>
          </div>
          
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {filteredRecordings.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-3"
                >
                  <path d="M21 15.5a2.5 2.5 0 0 1-2.5 2.5H5.5A2.5 2.5 0 0 1 3 15.5V8.5A2.5 2.5 0 0 1 5.5 6H9l3 3h6.5a2.5 2.5 0 0 1 2.5 2.5Z"></path>
                  <path d="M9 13h6"></path>
                </svg>
                <p>No recordings found</p>
              </div>
            ) : (
              filteredRecordings.map((recording) => (
                <div
                  key={recording.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-150 ${
                    selectedRecordingId === recording.id
                      ? darkMode ? 'bg-purple-900 bg-opacity-50' : 'bg-blue-100'
                      : 'hover:bg-opacity-20 hover:bg-gray-500'
                  }`}
                  onClick={() => setSelectedRecordingId(recording.id)}
                >
                  <div className="w-16 h-10 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={recording.thumbnail}
                      alt={recording.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-medium truncate">{recording.name}</h3>
                    <div className="flex text-xs text-gray-400 gap-3">
                      <span>{formatDuration(recording.duration)}</span>
                      <span>{formatDate(recording.date)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Right side - Recording details */}
        <div className="lg:w-1/2">
          {selectedRecording ? (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-black flex items-center justify-center">
                <img
                  src={selectedRecording.thumbnail}
                  alt={selectedRecording.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {isRenaming ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-grow bg-opacity-20 bg-gray-700 rounded-lg border border-gray-600 px-4 py-2"
                    autoFocus
                  />
                  <button
                    className="neon-button active"
                    onClick={handleRename}
                  >
                    Save
                  </button>
                  <button
                    className="neon-button"
                    onClick={() => setIsRenaming(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold truncate">{selectedRecording.name}</h2>
                  <div className="flex gap-2">
                    <button
                      className="neon-button"
                      onClick={() => startRenaming(selectedRecording)}
                    >
                      Rename
                    </button>
                    <button
                      className="neon-button"
                      onClick={() => handleDelete(selectedRecording.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-opacity-20 bg-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Duration</div>
                  <div className="font-medium">{formatDuration(selectedRecording.duration)}</div>
                </div>
                <div className="bg-opacity-20 bg-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-400">File Size</div>
                  <div className="font-medium">{formatSize(selectedRecording.size)}</div>
                </div>
                <div className="bg-opacity-20 bg-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Created</div>
                  <div className="font-medium">{formatDate(selectedRecording.date)}</div>
                </div>
                <div className="bg-opacity-20 bg-gray-700 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Video ID</div>
                  <div className="font-medium truncate">{selectedRecording.id}</div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button className="neon-button active flex-grow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Play
                </button>
                <button className="neon-button flex-grow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download
                </button>
                <button className="neon-button flex-grow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-4"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="m10 13-2 2 2 2"></path>
                <path d="m14 17 2-2-2-2"></path>
              </svg>
              <h3 className="text-xl font-bold mb-2">No Recording Selected</h3>
              <p className="max-w-xs mx-auto">
                Select a recording from the list to view details and access playback options
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};