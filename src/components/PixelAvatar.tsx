import { useState } from "react";

interface PixelAvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  rank?: number;
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const defaultAvatars = ["👾", "🤖", "🎮", "🕹️", "🎯", "⚡", "🔥", "💎", "🏆", "🌟"];

export function PixelAvatar({ src, alt = "Player Avatar", size = "md", rank, className = "", animated = false }: PixelAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const randomEmoji = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
  const baseClasses = `${sizeClasses[size]} rounded-sm border-2 flex items-center justify-center font-pixel text-xs relative overflow-hidden ${animated ? "animate-pixel-float" : ""} ${className}`;
  const getRankBorder = () => {
    if (rank === 1) return "border-neon-yellow shadow-[0_0_20px_hsl(var(--neon-yellow)/0.5)]";
    if (rank === 2) return "border-gray-400 shadow-[0_0_20px_hsl(0_0%_70%/0.5)]";
    if (rank === 3) return "border-orange-500 shadow-[0_0_20px_hsl(30_100%_50%/0.5)]";
    return "border-primary/50";
  };

  if (!src || imageError) {
    return (
      <div className={`${baseClasses} ${getRankBorder()} bg-gradient-to-br from-primary/20 to-accent/20`}>
        <span className="text-lg">{randomEmoji}</span>
        {rank && rank <= 3 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-yellow border border-background flex items-center justify-center">
            <span className="text-[8px] text-background font-bold">{rank}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${getRankBorder()}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setImageError(true)} />
      {rank && rank <= 3 && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-yellow border border-background flex items-center justify-center">
          <span className="text-[8px] text-background font-bold">{rank}</span>
        </div>
      )}
    </div>
  );
}