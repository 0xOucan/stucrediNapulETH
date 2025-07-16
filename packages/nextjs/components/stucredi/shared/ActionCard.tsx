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
      className={`bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 ${disabled ? "opacity-50" : ""} ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="text-primary mt-1">{icon}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-base-content mb-2">{title}</h3>
          <p className="text-sm text-base-content/70 mb-4">{description}</p>
          {action}
        </div>
      </div>
    </div>
  );
};
