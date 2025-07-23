import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAutoSave = () => {
  const { isAdmin, getContent } = useAuth();
  const lastSaveRef = useRef<string>('');

  useEffect(() => {
    if (!isAdmin) return;

    const saveInterval = setInterval(() => {
      const currentContent = localStorage.getItem('siteContent') || '{}';
      
      // Only save if content has changed
      if (currentContent !== lastSaveRef.current) {
        lastSaveRef.current = currentContent;
        
        // Show save indicator
        const indicator = document.createElement('div');
        indicator.className = 'fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
        indicator.textContent = '✓ Sauvegardé automatiquement';
        document.body.appendChild(indicator);
        
        setTimeout(() => {
          document.body.removeChild(indicator);
        }, 2000);
      }
    }, 5000); // Save every 5 seconds

    return () => clearInterval(saveInterval);
  }, [isAdmin]);

  const forceSave = () => {
    if (!isAdmin) return;
    
    const currentContent = localStorage.getItem('siteContent') || '{}';
    
    // Backup to a different key for recovery
    localStorage.setItem('siteContentBackup', currentContent);
    localStorage.setItem('lastSaveTime', new Date().toISOString());
    
    // Show save confirmation
    const indicator = document.createElement('div');
    indicator.className = 'fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg';
    indicator.textContent = '💾 Sauvegarde manuelle effectuée';
    document.body.appendChild(indicator);
    
    setTimeout(() => {
      if (document.body.contains(indicator)) {
        document.body.removeChild(indicator);
      }
    }, 3000);
  };

  const exportContent = () => {
    if (!isAdmin) return;
    
    const content = localStorage.getItem('siteContent') || '{}';
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `mind-graphix-content-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importContent = (file: File) => {
    if (!isAdmin) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        
        // Validate content structure
        if (typeof parsed === 'object' && parsed !== null) {
          localStorage.setItem('siteContent', content);
          window.location.reload(); // Reload to apply changes
        } else {
          alert('Format de fichier invalide');
        }
      } catch (error) {
        alert('Erreur lors de l\'importation du fichier');
      }
    };
    reader.readAsText(file);
  };

  return {
    forceSave,
    exportContent,
    importContent,
  };
};
