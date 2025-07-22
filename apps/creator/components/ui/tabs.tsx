"use client";
import { ReactNode } from "react";

interface TabsProps {
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}

export function Tabs({ value, onChange, children }: TabsProps) {
  return <div data-current={value}>{children}</div>;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}
export function TabsList({ children, className = "" }: TabsListProps) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  current: string;
  onChange: (v: string) => void;
  children: ReactNode;
  className?: string;
}
export function TabsTrigger({ value, current, onChange, children, className = "" }: TabsTriggerProps) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={`${active ? "bg-indigo-600" : "bg-gray-700"} px-3 py-1 text-sm rounded-md text-white ${className}`}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  current: string;
  children: ReactNode;
  className?: string;
}
export function TabsContent({ value, current, children, className = "" }: TabsContentProps) {
  if (value !== current) return null;
  return <div className={className}>{children}</div>;
}
