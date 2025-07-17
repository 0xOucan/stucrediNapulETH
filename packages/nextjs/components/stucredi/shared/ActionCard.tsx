import React from "react";
import { Card, CardContent } from "~~/components/ui/card";
import { cn } from "~~/lib/utils";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "primary" | "secondary" | "glow";
  priority?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  action,
  className = "",
  disabled = false,
  variant = "default",
  priority = false,
}) => {
  const getCardVariant = () => {
    if (disabled) return "glass";
    switch (variant) {
      case "primary":
        return "glow";
      case "secondary":
        return "glass";
      case "glow":
        return "glow";
      default:
        return "glass";
    }
  };

  const getHoverEffects = () => {
    if (disabled) return "";
    switch (variant) {
      case "primary":
        return "hover:border-pink-500/50 hover:shadow-pink-500/30 hover:shadow-2xl";
      case "secondary":
        return "hover:border-cyan-500/50 hover:shadow-cyan-500/30 hover:shadow-2xl";
      case "glow":
        return "hover:border-purple-500/50 hover:shadow-purple-500/30 hover:shadow-2xl";
      default:
        return "hover:border-white/30 hover:shadow-white/10 hover:shadow-xl";
    }
  };

  const getIconColor = () => {
    if (disabled) return "text-gray-500";
    switch (variant) {
      case "primary":
        return "text-pink-400 group-hover:text-pink-300";
      case "secondary":
        return "text-cyan-400 group-hover:text-cyan-300";
      case "glow":
        return "text-purple-400 group-hover:text-purple-300";
      default:
        return "text-cyan-400 group-hover:text-cyan-300";
    }
  };

  return (
    <Card
      variant={getCardVariant()}
      float
      className={cn(
        "group relative overflow-hidden transition-all duration-300 animate-slide-up",
        !disabled && "hover:scale-[1.02] cursor-pointer",
        getHoverEffects(),
        disabled && "opacity-50 cursor-not-allowed",
        priority && "ring-1 ring-purple-500/30 animate-shimmer",
        className,
      )}
    >
      {/* Priority indicator */}
      {priority && !disabled && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
      )}

      {/* Holographic background effect */}
      {!disabled && (
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            variant === "primary" && "bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-pink-500/10",
            variant === "secondary" && "bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-cyan-500/10",
            variant === "glow" && "bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10",
            variant === "default" && "bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-pink-500/10",
          )}
        />
      )}

      {/* Floating particles - only for non-disabled cards */}
      {!disabled && (
        <>
          <div
            className={cn(
              "absolute top-4 right-4 w-2 h-2 rounded-full opacity-0 group-hover:opacity-70 group-hover:animate-ping",
              variant === "primary" ? "bg-pink-400" : "bg-cyan-400",
            )}
          />
          <div
            className={cn(
              "absolute top-8 right-8 w-1 h-1 rounded-full opacity-0 group-hover:opacity-50 group-hover:animate-pulse",
              variant === "primary" ? "bg-purple-400" : "bg-blue-400",
            )}
          />
        </>
      )}

      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "mt-1 transition-all duration-300",
              !disabled && "group-hover:scale-110 group-hover:rotate-3",
              getIconColor(),
              variant === "primary" && !disabled && "group-hover:drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]",
              variant === "secondary" && !disabled && "group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]",
              variant === "glow" && !disabled && "group-hover:drop-shadow-[0_0_12px_rgba(147,51,234,0.6)]",
            )}
          >
            {icon}
          </div>
          <div className="flex-1 space-y-3">
            <h3
              className={cn(
                "font-semibold mb-2 font-orbitron transition-colors duration-300",
                !disabled ? "text-white/90 group-hover:text-white" : "text-gray-400",
                !disabled &&
                  variant === "primary" &&
                  "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text",
                !disabled &&
                  variant === "secondary" &&
                  "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-blue-400 group-hover:bg-clip-text",
                !disabled &&
                  variant === "glow" &&
                  "group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text",
              )}
            >
              {title}
            </h3>
            <p
              className={cn(
                "text-sm mb-4 leading-relaxed font-rajdhani transition-colors duration-300",
                !disabled ? "text-white/70 group-hover:text-white/90" : "text-gray-500",
              )}
            >
              {description}
            </p>
            <div className={cn("transition-transform duration-300", !disabled && "group-hover:translate-y-[-2px]")}>
              {action}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Scanning line effects - only for enabled cards */}
      {!disabled && (
        <>
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse",
              variant === "primary" ? "via-pink-400" : "via-cyan-400",
            )}
          />
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse",
              variant === "primary" ? "via-purple-400" : "via-blue-400",
            )}
          />
        </>
      )}
    </Card>
  );
};
