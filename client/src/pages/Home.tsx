import { useState, useEffect } from "react";
import { ActionCard } from "@/components/ActionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { phases } from "@/lib/data";
import { Loader2 } from "lucide-react";
import StudentSetup from "@/components/StudentSetup";

export default function Home() {
  const [studentName, setStudentName] = useState<string | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load student name from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('studentName');
    if (savedName) {
      setStudentName(savedName);
      setShowSetup(false);
    } else {
      setShowSetup(true);
    }
    setIsInitializing(false);
  }, []);

  const handleSetupComplete = (name: string) => {
    setStudentName(name);
    setShowSetup(false);
  };

  const handleResetProfile = () => {
    localStorage.removeItem('studentName');
    setStudentName(null);
    setShowSetup(true);
  };

  // Fetch actions with user progress
  const { data: actions, isLoading: actionsLoading } = trpc.actions.list.useQuery();

  // Fetch progress stats
  const { data: stats } = trpc.actions.stats.useQuery();

  // Toggle action mutation with optimistic updates
  const utils = trpc.useUtils();
  const toggleMutation = trpc.actions.toggle.useMutation({
    onMutate: async ({ actionId }) => {
      // Cancel outgoing refetches
      await utils.actions.list.cancel();
      await utils.actions.stats.cancel();

      // Snapshot previous values
      const previousActions = utils.actions.list.getData();
      const previousStats = utils.actions.stats.getData();

      // Optimistically update actions
      if (previousActions) {
        utils.actions.list.setData(undefined, (old) =>
          old?.map((action) =>
            action.id === actionId
              ? {
                  ...action,
                  status: action.status === 'completed' ? ('pending' as const) : ('completed' as const),
                }
              : action
          )
        );
      }

      // Optimistically update stats
      if (previousStats) {
        const delta = previousActions?.find(a => a.id === actionId)?.status === 'completed' ? -1 : 1;
        utils.actions.stats.setData(undefined, {
          ...previousStats,
          completed: previousStats.completed + delta,
          percentage: Math.round(((previousStats.completed + delta) / previousStats.total) * 100),
        });
      }

      return { previousActions, previousStats };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousActions) {
        utils.actions.list.setData(undefined, context.previousActions);
      }
      if (context?.previousStats) {
        utils.actions.stats.setData(undefined, context.previousStats);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      utils.actions.list.invalidate();
      utils.actions.stats.invalidate();
    },
  });

  const handleToggle = (actionId: string) => {
    toggleMutation.mutate({ actionId });
  };

  // Show setup screen if no student name is configured
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="font-mono text-lg">Initialisation...</p>
        </div>
      </div>
    );
  }

  if (showSetup) {
    return <StudentSetup onSetupComplete={handleSetupComplete} initialName={studentName || ''} />;
  }

  // Show loading state while fetching actions
  if (actionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="font-mono text-lg">Chargement de ton parcours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Banner */}
      <div className="w-full h-64 md:h-80 bg-black relative overflow-hidden border-b-4 border-black">
        <img 
          src="/images/hero-banner.png" 
          alt="Banner" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <div className="bg-white border-4 border-black p-6 md:p-10 neo-shadow-lg transform -rotate-2 max-w-3xl mx-4 text-center">
            <h1 className="font-display text-4xl md:text-6xl font-black uppercase leading-none mb-2">
              Mon Parcours
            </h1>
            <h2 className="font-mono text-xl md:text-2xl font-bold bg-primary text-white inline-block px-4 py-1 transform rotate-1">
              {studentName} • Orientation 2026
            </h2>
          </div>
        </div>
        
        {/* Decorative Sticker */}
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-12 w-24 h-24 md:w-32 md:h-32 animate-pulse">
          <img src="/images/sticker-school.png" alt="School" className="w-full h-full drop-shadow-lg" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Progress Section */}
        <ProgressBar 
          total={stats?.total || 0} 
          completed={stats?.completed || 0} 
        />

        {/* Change Profile Button */}
        <div className="flex justify-end mt-6 mb-8">
          <Button
            onClick={handleResetProfile}
            variant="outline"
            className="border-2 border-black font-mono text-sm"
          >
            🔄 Changer de profil
          </Button>
        </div>

        {/* Phases Grid */}
        <div className="space-y-16 mt-12">
          {phases.map((phase) => {
            const phaseActions = actions?.filter(a => a.phase === phase.id) || [];
            if (phaseActions.length === 0) return null;

            return (
              <section key={phase.id} className="relative">
                {/* Phase Header */}
                <div className="flex items-center gap-4 mb-8 sticky top-4 z-20">
                  <div className={cn(
                    "font-display text-2xl md:text-3xl font-black uppercase px-6 py-3 border-4 border-black neo-shadow transform -rotate-1",
                    phase.color
                  )}>
                    {phase.title}
                  </div>
                  <div className="h-1 bg-black flex-1"></div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {phaseActions.map(action => (
                    <ActionCard 
                      key={action.id} 
                      action={action} 
                      onToggle={handleToggle} 
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-20 border-t-4 border-black">
        <div className="container mx-auto px-4 text-center font-mono">
          <p className="mb-4 text-lg">🚀 Tu as tout ce qu'il faut pour réussir !</p>
          <p className="text-sm text-gray-400">
            Parcours d'orientation personnalisé • Basé sur Parcoursup 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
