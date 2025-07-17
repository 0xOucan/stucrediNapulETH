import React from "react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  action,
  className = "",
  disabled = false,
}) => {
  return (
    <div
      className={`glass-card p-6 rounded-2xl shadow-lg border border-white/20 backdrop-blur-lg 
                  hover:border-cyan-500/50 hover:shadow-cyan-500/20 hover:shadow-2xl
                  transition-all duration-300 float-delayed group relative overflow-hidden
                  ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"} ${className}`}
    >
      {/* Holographic background effect */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-pink-500/10 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Animated particles */}
      <div
        className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full 
                      opacity-0 group-hover:opacity-70 group-hover:animate-ping"
      />
      <div
        className="absolute top-8 right-8 w-1 h-1 bg-pink-400 rounded-full 
                      opacity-0 group-hover:opacity-50 group-hover:animate-pulse"
      />

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div
            className="text-cyan-400 mt-1 group-hover:text-pink-400 
                          transition-all duration-300 group-hover:scale-110
                          group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]
                          group-hover:rotate-3"
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3
              className="font-semibold text-white/90 mb-2 font-orbitron 
                           group-hover:text-white transition-colors duration-300
                           group-hover:text-transparent group-hover:bg-gradient-to-r 
                           group-hover:from-cyan-400 group-hover:to-pink-400 
                           group-hover:bg-clip-text"
            >
              {title}
            </h3>
            <p
              className="text-sm text-white/70 mb-4 group-hover:text-white/90 
                          transition-colors duration-300 leading-relaxed"
            >
              {description}
            </p>
            <div
              className="group-hover:transform group-hover:translate-y-[-2px] 
                           transition-transform duration-300"
            >
              {action}
            </div>
          </div>
        </div>
      </div>

      {/* Scanning line effect */}
      <div
        className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent 
                      opacity-0 group-hover:opacity-100 group-hover:animate-pulse"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-pink-400 to-transparent 
                      opacity-0 group-hover:opacity-100 group-hover:animate-pulse"
      />
    </div>
  );
};
