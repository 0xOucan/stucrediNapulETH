import React from "react";
import { Badge } from "~~/components/ui/badge";
import { Card, CardContent } from "~~/components/ui/card";
import { cn } from "~~/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
  loading?: boolean;
  variant?: "default" | "glow" | "success" | "warning";
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  className = "",
  loading = false,
  variant = "default",
}) => {
  const getIconColor = () => {
    switch (variant) {
      case "glow":
        return "text-pink-400 group-hover:text-pink-300 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]";
      case "success":
        return "text-green-400 group-hover:text-green-300 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]";
      case "warning":
        return "text-orange-400 group-hover:text-orange-300 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]";
      default:
        return "text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]";
    }
  };

  const getValueColor = () => {
    switch (variant) {
      case "glow":
        return "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-300 group-hover:to-purple-300 group-hover:bg-clip-text";
      case "success":
        return "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-green-300 group-hover:to-emerald-300 group-hover:bg-clip-text";
      case "warning":
        return "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-300 group-hover:to-red-300 group-hover:bg-clip-text";
      default:
        return "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-blue-300 group-hover:bg-clip-text";
    }
  };

  return (
    <Card
      variant="glass"
      float
      className={cn(
        "group hover:scale-105 cursor-pointer animate-bounce-in",
        variant === "glow" && "hover:border-pink-500/50 hover:shadow-pink-500/30",
        variant === "success" && "hover:border-green-500/50 hover:shadow-green-500/30",
        variant === "warning" && "hover:border-orange-500/50 hover:shadow-orange-500/30",
        className,
      )}
    >
      <CardContent className="p-6">
        {/* Header with icon and title */}
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("transition-all duration-300 group-hover:scale-110", getIconColor())}>{icon}</div>
          <h3 className="font-semibold text-white/90 group-hover:text-white transition-colors duration-300 font-orbitron tracking-wide">
            {title}
          </h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-8 bg-white/20 rounded-lg w-24 animate-pulse"></div>
            {description && <div className="h-4 bg-white/10 rounded-lg w-32 animate-pulse"></div>}
          </div>
        ) : (
          <div className="space-y-2">
            <div
              className={cn(
                "text-3xl font-bold text-white mb-1 font-orbitron transition-all duration-300",
                getValueColor(),
              )}
            >
              {value}
            </div>
            {description && (
              <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300 font-rajdhani leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Subtle indicator badge */}
        {variant !== "default" && (
          <Badge
            variant={variant === "glow" ? "glow" : variant === "success" ? "success" : "warning"}
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            {variant === "glow" ? "Featured" : variant === "success" ? "Active" : "Alert"}
          </Badge>
        )}

        {/* Animated accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </CardContent>
    </Card>
  );
};
