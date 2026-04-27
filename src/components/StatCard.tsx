import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "cyan" | "green" | "pink" | "yellow";
  animated?: boolean;
}

const colorClasses = {
  cyan: "neon-border-cyan text-primary",
  green: "neon-border-green text-accent", 
  pink: "neon-border-pink text-neon-pink",
  yellow: "neon-border-yellow text-neon-yellow"
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "cyan",
  animated = false 
}: StatCardProps) {
  return (
    <div className={`
      pixel-card ${colorClasses[color]} 
      ${animated ? "animate-glow" : ""}
      hover:scale-105 transition-transform duration-200
    `}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-6 h-6" />
        <div className="text-right">
          <div className="text-2xl font-pixel">{value}</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground font-retro">{subtitle}</div>
          )}
        </div>
      </div>
      <div className="text-xs font-retro opacity-80">{title}</div>
    </div>
  );
}