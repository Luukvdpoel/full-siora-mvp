"use client";
import { Switch } from "@headlessui/react";
import { useTheme } from "@/app/theme-provider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const enabled = theme === "dark";
  return (
    <Switch
      checked={enabled}
      onChange={toggle}
      className={`${enabled ? "bg-zinc-700" : "bg-zinc-200"} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        className={`${enabled ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </Switch>
  );
}
