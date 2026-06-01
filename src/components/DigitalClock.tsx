import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DigitalClockProps {
  className?: string;
  showIcon?: boolean;
}

export function DigitalClock({ className, showIcon = true }: DigitalClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {showIcon && <Clock className="w-3 h-3 text-orange-500" />}
      {time.toLocaleTimeString('pt-BR')}
    </div>
  );
}

export function DigitalDate({ className }: { className?: string }) {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Update date only once an hour, it's enough
    const timer = setInterval(() => setDate(new Date()), 3600000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={className}>
      {date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
  );
}
