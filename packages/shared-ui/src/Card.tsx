import * as React from 'react';
import { cn } from './utils';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-Siora-border bg-white dark:bg-Siora-mid shadow-Siora-hover',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';
