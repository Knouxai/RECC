import React, { useState } from 'react';
import "../styles/glassmorphism.css";

interface SettingsModalProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  darkMode,
  toggleDarkMode,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [autoTheme, setAutoTheme] = useState(false);
  const [savePath, setSavePath] = useState('/Users/username/Videos/Recordings');
  const [fileNamingTemplate, setFileNamingTemplate] = useState('KNOUX_REC_%DATE%_%TIME%');
  const [startWithSystem, setStartWithSystem] = useState(false);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState({
    startStop: 'Alt+R',
    pause: 'Alt+P',
    screenshot: 'Alt+S'
  });
  const [cpuThrottle, setCpuThrottle] = useState(4);
  const [audioQuality, setAudioQuality] = useState('high');
  const [fpsLimit, setFpsLimit] = useState('auto');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`settings-modal ${darkMode ? '' : 'light-mode'} w-4/5 max-w-4xl max-h-[90vh] overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button onClick={onClose} className="neon-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="flex border-b border-gray-600 mb-6">
            <button 
              className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button 
              className={`settings-tab ${activeTab === 'recording' ? 'active' : ''}`}
              onClick={() => setActiveTab('recording')}
            >
              Recording
            </button>
            <button 
              className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              Appearance
            </button>
            <button 
              className={`settings-tab ${activeTab === 'shortcuts' ? 'active' : ''}`}
              onClick={() => setActiveTab('shortcuts')}
            >
              Keyboard Shortcuts
            </button>
            <button 
              className={`settings-tab ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </button>
          </div>
          
          {/* General Settings */}
          {activeTab === 'general' && (
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg">Start with system</label>
                  <div className="toggle-switch">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={startWithSystem} 
                        onChange={() => setStartWithSystem(!startWithSystem)} 
                        className="sr-only peer"
                      />
                      <div className={`
                        w-11 h-6 rounded-full 
                        ${darkMode 
                          ? 'bg-gray-700 peer-checked:bg-purple-700' 
                          : 'bg-gray-300 peer-checked:bg-blue-400'
                        } 
                        peer-focus:ring-2 peer-focus:ring-purple-300
                        after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                        after:bg-white after:rounded-full after:h-5 after:w-5 
                        after:transition-all peer-checked:after:translate-x-full
                      `}></div>
                    </label>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-lg mb-2">Save recordings to</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      value={savePath} 
                      onChange={(e) => setSavePath(e.target.value)}
                      className="flex-1 bg-opacity-20 bg-gray-700 rounded-l-lg border border-gray-600 px-4 py-2"
                    />
                    <button className="neon-button rounded-l-none">Browse</button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-lg mb-2">File naming template</label>
                  <input 
                    type="text" 
                    value={fileNamingTemplate} 
                    onChange={(e) => setFileNamingTemplate(e.target.value)}
                    className="w-full bg-opacity-20 bg-gray-700 rounded-lg border border-gray-600 px-4 py-2"
                  />
                  <div className="mt-2 text-sm opacity-70">
                    Available variables: %DATE%, %TIME%, %COUNTER%, %APP%
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Recording Settings */}
          {activeTab === 'recording' && (
            <div>
              <div className="mb-6">
                <label className="block text-lg mb-2">Default recording mode</label>
                <select className="w-full neon-button">
                  <option>Full Screen</option>
                  <option>Window</option>
                  <option>Custom Area</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-lg mb-2">Default video quality</label>
                <select className="w-full neon-button">
                  <option>720p</option>
                  <option selected>1080p</option>
                  <option>2K</option>
                  <option>4K</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-lg mb-2">Default frame rate</label>
                <select className="w-full neon-button">
                  <option>30 FPS</option>
                  <option selected>60 FPS</option>
                  <option>120 FPS</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg">Dark Mode</label>
                  <div className="toggle-switch">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={darkMode} 
                        onChange={toggleDarkMode} 
                        className="sr-only peer"
                      />
                      <div className={`
                        w-11 h-6 rounded-full 
                        ${darkMode 
                          ? 'bg-gray-700 peer-checked:bg-purple-700' 
                          : 'bg-gray-300 peer-checked:bg-blue-400'
                        } 
                        peer-focus:ring-2 peer-focus:ring-purple-300
                        after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                        after:bg-white after:rounded-full after:h-5 after:w-5 
                        after:transition-all peer-checked:after:translate-x-full
                      `}></div>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <label className="text-lg">Auto theme based on time</label>
                  <div className="toggle-switch">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={autoTheme} 
                        onChange={() => setAutoTheme(!autoTheme)} 
                        className="sr-only peer"
                      />
                      <div className={`
                        w-11 h-6 rounded-full 
                        ${darkMode 
                          ? 'bg-gray-700 peer-checked:bg-purple-700' 
                          : 'bg-gray-300 peer-checked:bg-blue-400'
                        } 
                        peer-focus:ring-2 peer-focus:ring-purple-300
                        after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                        after:bg-white after:rounded-full after:h-5 after:w-5 
                        after:transition-all peer-checked:after:translate-x-full
                      `}></div>
                    </label>
                  </div>
                </div>
                
                {autoTheme && (
                  <div className="mb-4 ml-4">
                    <div className="flex items-center justify-between gap-4">
                      <label>Dark mode starts at</label>
                      <input type="time" value="18:00" className="neon-button" />
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-2">
                      <label>Light mode starts at</label>
                      <input type="time" value="06:00" className="neon-button" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Keyboard Shortcuts */}
          {activeTab === 'shortcuts' && (
            <div>
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 border border-gray-600 rounded-lg">
                    <span>Start/Stop Recording</span>
                    <input 
                      type="text" 
                      value={keyboardShortcuts.startStop} 
                      onChange={(e) => setKeyboardShortcuts({...keyboardShortcuts, startStop: e.target.value})}
                      className="w-24 bg-opacity-20 bg-gray-700 rounded px-2 py-1 text-center"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border border-gray-600 rounded-lg">
                    <span>Pause Recording</span>
                    <input 
                      type="text" 
                      value={keyboardShortcuts.pause} 
                      onChange={(e) => setKeyboardShortcuts({...keyboardShortcuts, pause: e.target.value})}
                      className="w-24 bg-opacity-20 bg-gray-700 rounded px-2 py-1 text-center"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border border-gray-600 rounded-lg">
                    <span>Take Screenshot</span>
                    <input 
                      type="text" 
                      value={keyboardShortcuts.screenshot} 
                      onChange={(e) => setKeyboardShortcuts({...keyboardShortcuts, screenshot: e.target.value})}
                      className="w-24 bg-opacity-20 bg-gray-700 rounded px-2 py-1 text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Performance Settings */}
          {activeTab === 'performance' && (
            <div>
              <div className="mb-6">
                <label className="block text-lg mb-2">CPU throttle level (higher = less CPU usage)</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={cpuThrottle} 
                  onChange={(e) => setCpuThrottle(parseInt(e.target.value))}
                  className="custom-range w-full"
                />
                <div className="flex justify-between mt-1">
                  <span>Max Performance</span>
                  <span>Current: {cpuThrottle}</span>
                  <span>Power Saving</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-lg mb-2">Audio quality</label>
                <select 
                  value={audioQuality} 
                  onChange={(e) => setAudioQuality(e.target.value)}
                  className="w-full neon-button"
                >
                  <option value="low">Low (128 kbps)</option>
                  <option value="medium">Medium (256 kbps)</option>
                  <option value="high">High (320 kbps)</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-lg mb-2">FPS limit</label>
                <select 
                  value={fpsLimit} 
                  onChange={(e) => setFpsLimit(e.target.value)}
                  className="w-full neon-button"
                >
                  <option value="auto">Auto (based on recording settings)</option>
                  <option value="30">30 FPS</option>
                  <option value="60">60 FPS</option>
                  <option value="120">120 FPS</option>
                </select>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-4 mt-6">
            <button className="neon-button" onClick={onClose}>
              Cancel
            </button>
            <button className="neon-button active" onClick={onClose}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};