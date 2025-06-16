"use client";
import { SessionProvider } from "next-auth/react";
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

export const ThemeContext = createContext({
  theme: "light",
  toggle: () => {},
});

export default function Providers({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
      return;
    }
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    document.documentElement.classList.toggle("dark", system === "dark");
    setTheme(system);
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      return next;
    });
  };

  return (
    <SessionProvider>
      <ThemeContext.Provider value={{ theme, toggle }}>
        {children}
      </ThemeContext.Provider>
    </SessionProvider>
  );
}
