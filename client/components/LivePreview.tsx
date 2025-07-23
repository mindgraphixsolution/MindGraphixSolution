import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, RefreshCw, ExternalLink } from 'lucide-react';

interface LivePreviewProps {
  url?: string;
  className?: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ 
  url = '/', 
  className = '' 
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState(0); // Pour forcer le reload de l'iframe

  const refreshPreview = () => {
    setIsLoading(true);
    setKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getDeviceStyles = () => {
    switch (deviceMode) {
      case 'mobile':
        return {
          width: '375px',
          height: '667px',
          transform: 'scale(0.7)',
          transformOrigin: 'top center',
        };
      case 'tablet':
        return {
          width: '768px',
          height: '1024px',
          transform: 'scale(0.6)',
          transformOrigin: 'top center',
        };
      default:
        return {
          width: '100%',
          height: '100%',
          transform: 'scale(1)',
        };
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Aperçu:</span>
          
          {/* Device Mode Buttons */}
          <div className="flex items-center space-x-1 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-2 rounded-md transition-colors ${
                deviceMode === 'desktop'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vue Desktop"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-2 rounded-md transition-colors ${
                deviceMode === 'tablet'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vue Tablet"
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-2 rounded-md transition-colors ${
                deviceMode === 'mobile'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vue Mobile"
            >
              <Smartphone size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={refreshPreview}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            title="Actualiser l'aperçu"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span className="text-sm">Actualiser</span>
          </button>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink size={16} />
            <span className="text-sm">Ouvrir</span>
          </a>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-gray-50 p-4 overflow-auto">
        <div className="flex justify-center items-start h-full">
          <div 
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            style={getDeviceStyles()}
          >
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="flex items-center space-x-2">
                  <RefreshCw size={20} className="animate-spin text-blue-500" />
                  <span className="text-gray-600">Chargement...</span>
                </div>
              </div>
            )}
            
            <iframe
              key={key}
              src={url}
              className="w-full h-full border-0"
              title="Aperçu du site"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        </div>
      </div>

      {/* Device Info */}
      <div className="p-2 bg-gray-100 border-t border-gray-200 text-center">
        <span className="text-xs text-gray-500">
          {deviceMode === 'desktop' && 'Desktop (Responsive)'}
          {deviceMode === 'tablet' && 'Tablet (768px × 1024px)'}
          {deviceMode === 'mobile' && 'Mobile (375px × 667px)'}
        </span>
      </div>
    </div>
  );
};
