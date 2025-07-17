import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~~/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-orbitron",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25",
        secondary:
          "border-transparent bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25",
        destructive:
          "border-transparent bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25",
        outline: "border-cyan-500/50 text-cyan-400 bg-transparent",
        success:
          "border-transparent bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25",
        warning:
          "border-transparent bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg shadow-orange-500/25",
        ghost: "border-white/20 text-white bg-white/10 backdrop-blur-sm",
        glow: "border-pink-500/30 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 shadow-lg shadow-pink-500/20 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
