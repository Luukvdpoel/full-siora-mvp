import * as React from "react";
import {
  Root as SelectPrimitiveRoot,
  Group as SelectPrimitiveGroup,
  Value as SelectPrimitiveValue,
  Trigger as SelectPrimitiveTrigger,
  Content as SelectPrimitiveContent,
  Item as SelectPrimitiveItem,
  ItemText as SelectPrimitiveItemText,
  ItemIndicator as SelectPrimitiveItemIndicator,
  Viewport as SelectPrimitiveViewport,
} from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitiveRoot;
const SelectGroup = SelectPrimitiveGroup;
const SelectValue = SelectPrimitiveValue;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitiveTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitiveTrigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitiveTrigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
  </SelectPrimitiveTrigger>
));
SelectTrigger.displayName = SelectPrimitiveTrigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitiveContent>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitiveContent>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitiveContent
    ref={ref}
    className={cn(
      "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
      className
    )}
    {...props}
  >
    <SelectPrimitiveViewport className="p-1">{children}</SelectPrimitiveViewport>
  </SelectPrimitiveContent>
));
SelectContent.displayName = SelectPrimitiveContent.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitiveItem>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitiveItem>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitiveItem
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <SelectPrimitiveItemText>{children}</SelectPrimitiveItemText>
    <SelectPrimitiveItemIndicator className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check className="h-4 w-4" />
    </SelectPrimitiveItemIndicator>
  </SelectPrimitiveItem>
));
SelectItem.displayName = SelectPrimitiveItem.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
};
