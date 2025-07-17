import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden font-orbitron",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:shadow-xl hover:scale-105 border border-purple-500/20",
        destructive:
          "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:shadow-xl hover:scale-105 border border-red-500/20",
        outline:
          "border border-cyan-500/50 bg-transparent text-cyan-400 shadow-lg shadow-cyan-500/10 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-400 hover:shadow-cyan-500/25",
        secondary:
          "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:shadow-xl hover:scale-105 border border-cyan-500/20",
        ghost:
          "text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 border border-transparent hover:border-cyan-500/30",
        link: "text-cyan-400 underline-offset-4 hover:underline hover:text-pink-400",
        vaporwave:
          "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/50 hover:shadow-2xl hover:scale-105 border border-pink-500/30 bg-size-200 hover:bg-pos-0",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        xl: "h-12 rounded-xl px-10 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Add glow effect class
const glowEffect =
  "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  glow?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, glow = true, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), glow && glowEffect, className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
