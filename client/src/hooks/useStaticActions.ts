import { useState, useEffect } from 'react';
import { staticActionsData } from '@/lib/staticActions';

export interface Action {
  id: string;
  title: string;
  description: string;
  deadline: string;
  phase: string;
  link?: string | null;
  status?: 'pending' | 'completed';
}

export function useStaticActions() {
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadActions() {
      try {
        setIsLoading(true);
        
        // Try to fetch from JSON file first
        let data: { actions: Action[] } | null = null;
        
        try {
          const response = await fetch('/api-data.json');
          if (response.ok) {
            data = await response.json();
            console.log('✅ Loaded actions from /api-data.json');
          }
        } catch (err) {
          console.warn('⚠️ Failed to load /api-data.json, using embedded data');
        }
        
        // Fallback to embedded data
        const actionsArray = data?.actions || staticActionsData;
        
        // Load progress from localStorage
        const savedProgress = localStorage.getItem('actionProgress');
        const progress = savedProgress ? JSON.parse(savedProgress) : {};
        
        // Merge data with saved progress
        const actionsWithStatus = actionsArray.map((action: Action) => ({
          ...action,
          status: progress[action.id] ? 'completed' : 'pending'
        }));
        
        setActions(actionsWithStatus);
        setError(null);
        console.log(`✅ Loaded ${actionsWithStatus.length} actions`);
      } catch (err) {
        setError(err as Error);
        console.error('❌ Error loading actions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadActions();
  }, []);

  const toggleAction = (actionId: string) => {
    setActions(prevActions => {
      const updated = prevActions.map(action =>
        action.id === actionId
          ? { ...action, status: action.status === 'completed' ? 'pending' : 'completed' as const }
          : action
      );
      
      // Save to localStorage
      const progress = updated.reduce((acc, action) => {
        if (action.status === 'completed') {
          acc[action.id] = true;
        }
        return acc;
      }, {} as Record<string, boolean>);
      
      localStorage.setItem('actionProgress', JSON.stringify(progress));
      
      return updated;
    });
  };

  const stats = {
    total: actions.length,
    completed: actions.filter(a => a.status === 'completed').length,
    percentage: actions.length > 0 
      ? Math.round((actions.filter(a => a.status === 'completed').length / actions.length) * 100)
      : 0
  };

  return {
    actions,
    isLoading,
    error,
    toggleAction,
    stats
  };
}
