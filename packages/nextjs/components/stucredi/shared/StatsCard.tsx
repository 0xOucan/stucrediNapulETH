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
    <div className={`bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className="text-primary">{icon}</div>
        <h3 className="font-semibold text-base-content">{title}</h3>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 bg-base-300 rounded w-20 mb-2"></div>
          {description && <div className="h-4 bg-base-300 rounded w-32"></div>}
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-base-content mb-1">{value}</div>
          {description && <p className="text-sm text-base-content/70">{description}</p>}
        </>
      )}
    </div>
  );
};
