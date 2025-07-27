import * as React from "react";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={`h-4 w-4 rounded border border-Siora-border bg-Siora-light text-Siora-accent ${className}`}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";

export default Checkbox;
