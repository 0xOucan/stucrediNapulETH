import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~~/lib/utils";

const inputVariants = cva(
  "flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-base transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-white/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 font-rajdhani md:text-sm",
  {
    variants: {
      variant: {
        default:
          "border-white/20 text-white bg-white/5 focus-visible:border-cyan-400 focus-visible:ring-1 focus-visible:ring-cyan-400 focus-visible:shadow-lg focus-visible:shadow-cyan-500/20",
        ghost: "border-transparent bg-transparent focus-visible:border-cyan-400 focus-visible:bg-white/5",
        glow: "border-pink-500/30 bg-white/5 text-white focus-visible:border-pink-400 focus-visible:ring-1 focus-visible:ring-pink-400 focus-visible:shadow-lg focus-visible:shadow-pink-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, type, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ variant }), className)} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input };
