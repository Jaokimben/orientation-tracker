import { Action } from "@/lib/data";
import { Check, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  action: Action;
  onToggle: (id: string) => void;
}

export function ActionCard({ action, onToggle }: ActionCardProps) {
  const isCompleted = action.status === 'completed';
  const isUrgent = action.status === 'urgent';
  
  // Calculate days remaining
  const today = new Date();
  const deadline = new Date(action.deadline);
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isOverdue = diffDays < 0 && !isCompleted;

  return (
    <div className={cn(
      "neo-card relative group transition-all duration-200",
      isCompleted ? "bg-green-100 border-green-900" : "bg-white",
      isUrgent && !isCompleted ? "border-red-600 border-4" : ""
    )}>
      {/* Sticker for Urgent/Overdue */}
      {(isUrgent || isOverdue) && !isCompleted && (
        <div className="absolute -top-3 -right-3 w-12 h-12 z-10 animate-bounce">
          <img src="/images/sticker-urgent.png" alt="Urgent" className="w-full h-full drop-shadow-md" />
        </div>
      )}
      
      {/* Sticker for Completed */}
      {isCompleted && (
        <div className="absolute -top-4 -right-4 w-16 h-16 z-10 rotate-12 transition-transform hover:rotate-0">
          <img src="/images/sticker-done.png" alt="Done" className="w-full h-full drop-shadow-md" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Giant Checkbox */}
        <button 
          onClick={() => onToggle(action.id)}
          className={cn(
            "flex-shrink-0 w-12 h-12 border-4 border-black flex items-center justify-center transition-all active:scale-90 neo-shadow-sm hover:neo-shadow",
            isCompleted ? "bg-black" : "bg-white hover:bg-gray-100"
          )}
        >
          {isCompleted && <Check className="w-8 h-8 text-white stroke-[4]" />}
        </button>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className={cn(
              "font-display text-xl font-bold leading-tight",
              isCompleted ? "line-through text-gray-500" : "text-black"
            )}>
              {action.title}
            </h3>
          </div>
          
          <p className={cn(
            "font-mono text-sm mb-4",
            isCompleted ? "text-gray-400" : "text-gray-700"
          )}>
            {action.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold font-mono uppercase">
            <div className={cn(
              "px-2 py-1 border-2 border-black flex items-center gap-1",
              isOverdue ? "bg-red-500 text-white" : 
              diffDays <= 7 ? "bg-orange-400" : "bg-blue-200"
            )}>
              <Clock className="w-3 h-3" />
              {isOverdue ? "À faire" : `Dans ${diffDays} jours`}
            </div>
            
            <div className="px-2 py-1 border-2 border-black bg-white">
              {new Date(action.deadline).toLocaleDateString('fr-FR')}
            </div>

            {action.link && (
              <a 
                href={action.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-2 py-1 border-2 border-black bg-yellow-300 hover:bg-yellow-400 flex items-center gap-1 transition-colors"
              >
                Lien <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
