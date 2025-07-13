import React, { useState } from 'react';
import { FeatureCard } from './FeatureCard';
import "../styles/glassmorphism.css";

interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: React.ReactNode;
}

interface AITool {
  id: string;
  title: string;
  description: string;
  modelName: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface TemplatesToolboxProps {
  darkMode: boolean;
  onSelectTemplate: (templateId: string) => void;
  onToggleAITool: (toolId: string) => void;
}

export const TemplatesToolbox: React.FC<TemplatesToolboxProps> = ({
  darkMode,
  onSelectTemplate,
  onToggleAITool
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'ai'>('templates');
  const [templateCategory, setTemplateCategory] = useState('for-you');
  
  // Sample template categories
  const templateCategories = [
    { id: 'for-you', name: 'For You' },
    { id: 'education', name: 'Education' },
    { id: 'birthday', name: 'Birthday' },
    { id: 'festival', name: 'Festival' },
    { id: 'intro', name: 'Intro' },
    { id: 'outro', name: 'Outro' },
    { id: 'vlog', name: 'Vlog' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'news', name: 'News' },
    { id: 'business', name: 'Business' },
  ];
  
  // Sample templates
  const templates: Template[] = [
    {
      id: 'template1',
      title: 'Modern Intro',
      category: 'intro',
      description: 'Clean and professional intro with smooth transitions',
      thumbnail: (
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg h-32 flex items-center justify-center">
          <span className="text-white font-bold">Intro</span>
        </div>
      )
    },
    {
      id: 'template2',
      title: 'Educational Slides',
      category: 'education',
      description: 'Perfect for tutorials and educational content',
      thumbnail: (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg h-32 flex items-center justify-center">
          <span className="text-white font-bold">Education</span>
        </div>
      )
    },
    {
      id: 'template3',
      title: 'Birthday Animation',
      category: 'birthday',
      description: 'Colorful animation for birthday celebrations',
      thumbnail: (
        <div className="bg-gradient-to-r from-pink-500 to-yellow-500 rounded-lg h-32 flex items-center justify-center">
          <span className="text-white font-bold">Birthday</span>
        </div>
      )
    },
    {
      id: 'template4',
      title: 'Corporate Presentation',
      category: 'business',
      description: 'Professional template for business presentations',
      thumbnail: (
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg h-32 flex items-center justify-center">
          <span className="text-white font-bold">Business</span>
        </div>
      )
    },
  ];
  
  // Sample AI tools
  const aiTools: AITool[] = [
    {
      id: 'ai-effects',
      title: 'AI Effects',
      description: 'Apply intelligent visual effects using YOLOv8 + OpenCV',
      modelName: 'YOLOv8 + OpenCV Filters',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
          <path d="M2 12h20"></path>
        </svg>
      ),
      enabled: false
    },
    {
      id: 'ai-animation',
      title: 'AI Animation',
      description: 'Create animated content using Stable Diffusion + AnimateDiff',
      modelName: 'Stable Diffusion + AnimateDiff',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      enabled: false
    },
    {
      id: 'ai-transition',
      title: 'AI Transition',
      description: 'Smart scene transitions with SceneCut',
      modelName: 'SceneCut (.onnx)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2"></rect>
          <path d="m6 10 6-2 6 2"></path>
        </svg>
      ),
      enabled: false
    },
    {
      id: 'image-to-video',
      title: 'Image to Video',
      description: 'Convert static images into dynamic videos',
      modelName: 'Luma AI local / FFmpeg',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="8" height="8" rx="2"></rect>
          <rect x="14" y="2" width="8" height="8" rx="2"></rect>
          <rect x="2" y="14" width="8" height="8" rx="2"></rect>
          <rect x="14" y="14" width="8" height="8" rx="2"></rect>
        </svg>
      ),
      enabled: false
    },
  ];
  
  const filteredTemplates = templates.filter(template => 
    templateCategory === 'for-you' || template.category === templateCategory
  );
  
  return (
    <div className={`glass-card p-6 ${darkMode ? '' : 'light-mode'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">AI-powered Tools</h2>
        
        <div className="flex gap-3">
          <button 
            className={`neon-button ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            Templates
          </button>
          <button 
            className={`neon-button ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            AI Toolbox
          </button>
        </div>
      </div>
      
      {activeTab === 'templates' && (
        <>
          <div className="flex overflow-x-auto gap-3 pb-4 mb-6">
            {templateCategories.map(category => (
              <button 
                key={category.id}
                className={`neon-button whitespace-nowrap ${templateCategory === category.id ? 'active' : ''}`}
                onClick={() => setTemplateCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map(template => (
              <div 
                key={template.id}
                className="feature-card cursor-pointer"
                onClick={() => onSelectTemplate(template.id)}
              >
                {template.thumbnail}
                <h3 className="text-lg font-bold mt-4 mb-2">{template.title}</h3>
                <p className="text-sm opacity-80 mb-3">{template.description}</p>
                <button className="neon-button mt-auto w-full">
                  Apply Template
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiTools.map((tool) => (
            <div key={tool.id} className="feature-card">
              <div className="flex justify-between items-start mb-3">
                <div className="icon">
                  {tool.icon}
                </div>
                <div className="toggle-switch">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={tool.enabled} 
                      onChange={() => onToggleAITool(tool.id)} 
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
              
              <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
              <p className="text-sm opacity-80 mb-1">{tool.description}</p>
              <div className="text-xs py-1 px-2 bg-opacity-30 bg-gray-600 rounded inline-block mb-3">
                Model: {tool.modelName}
              </div>
              
              <button 
                className={`neon-button mt-auto w-full ${tool.enabled ? 'active' : ''}`}
                onClick={() => onToggleAITool(tool.id)}
              >
                {tool.enabled ? 'Configure' : 'Enable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};