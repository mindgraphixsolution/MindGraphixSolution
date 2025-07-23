import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useAutoSave = () => {
  const { isAdmin, getContent } = useAuth();
  const lastSaveRef = useRef<string>('');
  const indicatorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isAdmin) return;

    const saveInterval = setInterval(() => {
      const currentContent = localStorage.getItem('siteContent') || '{}';

      // Only save if content has changed
      if (currentContent !== lastSaveRef.current) {
        lastSaveRef.current = currentContent;

        // Show save indicator safely
        showSaveIndicator('✓ Sauvegardé automatiquement', 'bg-green-500');
      }
    }, 5000); // Save every 5 seconds

    return () => {
      clearInterval(saveInterval);
      // Clean up any existing indicator on unmount
      if (indicatorRef.current && document.body.contains(indicatorRef.current)) {
        document.body.removeChild(indicatorRef.current);
        indicatorRef.current = null;
      }
    };
  }, [isAdmin]);

  const showSaveIndicator = (message: string, bgColor: string) => {
    // Remove existing indicator first
    if (indicatorRef.current && document.body.contains(indicatorRef.current)) {
      document.body.removeChild(indicatorRef.current);
    }

    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = `fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg transition-opacity`;
    indicator.textContent = message;
    indicatorRef.current = indicator;

    document.body.appendChild(indicator);

    setTimeout(() => {
      if (indicatorRef.current && document.body.contains(indicatorRef.current)) {
        document.body.removeChild(indicatorRef.current);
        indicatorRef.current = null;
      }
    }, 3000);
  };

  const forceSave = () => {
    if (!isAdmin) return;

    const currentContent = localStorage.getItem('siteContent') || '{}';

    // Backup to a different key for recovery
    localStorage.setItem('siteContentBackup', currentContent);
    localStorage.setItem('lastSaveTime', new Date().toISOString());

    // Show save confirmation
    showSaveIndicator('💾 Sauvegarde manuelle effectuée', 'bg-blue-500');
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
