import { useState, useEffect } from 'react';

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
        const response = await fetch('/api-data.json');
        if (!response.ok) {
          throw new Error('Failed to load actions data');
        }
        const data = await response.json();
        
        // Load progress from localStorage
        const savedProgress = localStorage.getItem('actionProgress');
        const progress = savedProgress ? JSON.parse(savedProgress) : {};
        
        // Merge data with saved progress
        const actionsWithStatus = data.actions.map((action: Action) => ({
          ...action,
          status: progress[action.id] ? 'completed' : 'pending'
        }));
        
        setActions(actionsWithStatus);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Error loading actions:', err);
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
