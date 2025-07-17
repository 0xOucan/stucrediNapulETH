import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
  loading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  className = "",
  loading = false,
}) => {
  return (
    <div
      className={`glass-card p-6 rounded-2xl shadow-lg border border-white/20 backdrop-blur-lg 
                    hover:border-pink-500/50 hover:shadow-pink-500/20 hover:shadow-2xl
                    transition-all duration-300 float-element group ${className}`}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="text-cyan-400 group-hover:text-pink-400 transition-colors duration-300 
                          group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]"
          >
            {icon}
          </div>
          <h3
            className="font-semibold text-white/90 group-hover:text-white transition-colors duration-300 
                         font-rajdhani tracking-wide"
          >
            {title}
          </h3>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded-lg w-20 mb-2 animate-pulse"></div>
            {description && <div className="h-4 bg-white/10 rounded-lg w-32 animate-pulse"></div>}
          </div>
        ) : (
          <>
            <div
              className="text-3xl font-bold text-white mb-1 font-orbitron 
                           group-hover:text-transparent group-hover:bg-gradient-to-r 
                           group-hover:from-pink-400 group-hover:to-cyan-400 
                           group-hover:bg-clip-text transition-all duration-300
                           group-hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"
            >
              {value}
            </div>
            {description && (
              <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                {description}
              </p>
            )}
          </>
        )}
      </div>

      {/* Animated border effect */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 
                      opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"
        style={{ clipPath: "inset(0 round 1rem)" }}
      />
    </div>
  );
};
