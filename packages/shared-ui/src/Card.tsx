import * as React from 'react';
import { cn } from './utils';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border border-zinc-800 bg-Siora-light/70 dark:bg-Siora-mid hover:shadow-lg transition-shadow',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';
