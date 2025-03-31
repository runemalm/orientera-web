
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const toggleButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "icon",
    },
  }
);

export interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof toggleButtonVariants>, "variant"> {
  active?: boolean;
  tooltip?: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
  badgeCount?: number;
}

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  ({ className, size, active = false, tooltip, tooltipSide = "bottom", badgeCount, children, ...props }, ref) => {
    const content = (
      <button
        className={cn(
          toggleButtonVariants({ 
            variant: active ? "default" : "outline", 
            size, 
            className 
          })
        )}
        ref={ref}
        data-state={active ? "on" : "off"}
        aria-pressed={active}
        {...props}
      >
        {children}
        {typeof badgeCount === 'number' && badgeCount > 0 && (
          <Badge 
            variant="secondary"
            className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
          >
            {badgeCount}
          </Badge>
        )}
      </button>
    );

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  }
);

ToggleButton.displayName = "ToggleButton";

export { ToggleButton, toggleButtonVariants };
