import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~~/lib/utils";

const cardVariants = cva("rounded-xl border text-card-foreground shadow-lg transition-all duration-300", {
  variants: {
    variant: {
      default: "bg-card",
      glass: "glass-card border-white/20 hover:border-pink-500/30 hover:shadow-pink-500/20 hover:shadow-xl",
      solid: "bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50",
      glow: "glass-card border-cyan-500/30 shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:border-cyan-400/50",
    },
  },
  defaultVariants: {
    variant: "glass",
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  float?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, float, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ variant }), float && "float-element", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-2xl font-semibold leading-none tracking-tight font-orbitron text-white", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-white/70 font-rajdhani", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
