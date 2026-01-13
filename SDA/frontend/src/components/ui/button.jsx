import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70",
    outline: "border border-purple-500/50 hover:bg-purple-500/10 text-white hover:border-purple-500",
    ghost: "hover:bg-purple-500/10 text-white",
  };

  const sizes = {
    default: "h-10 px-6 py-2",
    sm: "h-9 px-4 text-sm",
    lg: "h-11 px-8 text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
