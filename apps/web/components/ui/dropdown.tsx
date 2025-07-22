import * as React from "react";

export type DropdownProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Dropdown = React.forwardRef<HTMLSelectElement, DropdownProps>(
  ({ className = "", children, ...props }, ref) => (
    <select
      ref={ref}
      className={`p-2 rounded-lg bg-Siora-light text-white border border-Siora-border ${className}`}
      {...props}
    >
      {children}
    </select>
  )
);
Dropdown.displayName = "Dropdown";

export default Dropdown;
