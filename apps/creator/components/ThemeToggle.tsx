"use client";
import { Switch } from "@headlessui/react";
import { useContext } from "react";
import { ThemeContext } from "@/app/providers";

export default function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);
  const enabled = theme === "dark";

  return (
    <Switch
      checked={enabled}
      onChange={toggle}
      className={`${enabled ? "bg-indigo-600" : "bg-gray-200"} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
    >
      <span
        className={`${enabled ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}
