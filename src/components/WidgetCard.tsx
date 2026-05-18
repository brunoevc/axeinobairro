import * as LucideIcons from "lucide-react";
import { Widget } from "@/data/neighborhood";
import { useNavigate } from "@tanstack/react-router";

interface WidgetCardProps {
  widget: Widget;
}

export function WidgetCard({ widget }: WidgetCardProps) {
  const navigate = useNavigate();
  // @ts-ignore - Lucide icons are valid keys
  const Icon = LucideIcons[widget.iconName as keyof typeof LucideIcons] || LucideIcons.HelpCircle;

  return (
    <div 
      onClick={() => navigate({ to: widget.path })}
      className="flex flex-col justify-between p-4 bg-card rounded-3xl shadow-[var(--shadow-card)] hover:scale-[1.02] transition-transform cursor-pointer border border-border/50 aspect-square"
    >
      <div className="flex justify-between items-start">
        <div className="p-2 rounded-2xl bg-secondary/50">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      <div>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{widget.title}</h3>
        <p className="text-lg font-bold text-foreground leading-tight mt-0.5">{widget.value}</p>
        {widget.description && (
          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{widget.description}</p>
        )}
      </div>

      <div className="mt-2">
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">
          {widget.actionLabel}
        </span>
      </div>
    </div>
  );
}
