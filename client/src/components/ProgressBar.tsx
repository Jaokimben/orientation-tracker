import { cn } from "@/lib/utils";

interface ProgressBarProps {
  total: number;
  completed: number;
}

export function ProgressBar({ total, completed }: ProgressBarProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-end mb-2 font-display font-bold uppercase">
        <span className="text-2xl">Progression</span>
        <span className="text-4xl text-primary">{percentage}%</span>
      </div>
      
      <div className="h-8 w-full border-4 border-black bg-white p-1 neo-shadow">
        <div 
          className="h-full bg-secondary transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
          {/* Striped pattern overlay */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', 
                 backgroundSize: '20px 20px' 
               }} 
          />
        </div>
      </div>
      
      <div className="mt-2 text-right font-mono text-sm font-bold">
        {completed} / {total} étapes terminées
      </div>
    </div>
  );
}
