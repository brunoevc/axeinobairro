import type { ReactNode } from "react";

type SectionHeaderProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

export function SectionHeader({ icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="flex items-center gap-1.5">
          {icon}
          <h3 className="text-base font-bold text-foreground">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
