import React from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface TransactionStatusProps {
  status: "idle" | "pending" | "success" | "error";
  message?: string;
  txHash?: string;
  className?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({ status, message, txHash, className = "" }) => {
  if (status === "idle") return null;

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: <ClockIcon className="h-5 w-5" />,
          bgColor: "bg-orange-500/20",
          borderColor: "border-warning",
          textColor: "text-warning",
          title: "Transaction Pending",
          defaultMessage: "Transaction is being processed...",
        };
      case "success":
        return {
          icon: <CheckCircleIcon className="h-5 w-5" />,
          bgColor: "bg-success/20",
          borderColor: "border-success",
          textColor: "text-success",
          title: "Transaction Successful",
          defaultMessage: "Transaction completed successfully!",
        };
      case "error":
        return {
          icon: <ExclamationTriangleIcon className="h-5 w-5" />,
          bgColor: "bg-error/20",
          borderColor: "border-error",
          textColor: "text-error",
          title: "Transaction Failed",
          defaultMessage: "Transaction failed. Please try again.",
        };
      default:
        return {
          icon: <InformationCircleIcon className="h-5 w-5" />,
          bgColor: "bg-info/20",
          borderColor: "border-info",
          textColor: "text-info",
          title: "Information",
          defaultMessage: "Transaction status unknown.",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`${config.textColor} mt-0.5`}>
          {status === "pending" && <div className="loading loading-spinner loading-sm"></div>}
          {status !== "pending" && config.icon}
        </div>
        <div className="flex-1">
          <h4 className={`font-medium ${config.textColor} mb-1`}>{config.title}</h4>
          <p className={`text-sm ${config.textColor}/80`}>{message || config.defaultMessage}</p>
          {txHash && (
            <a
              href={`https://testnet.snowtrace.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs ${config.textColor} underline mt-1 inline-block`}
            >
              View on Snowtrace
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
