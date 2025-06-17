"use client";
import { SessionProvider } from "next-auth/react";
import { createContext, useContext, useEffect, useState, PropsWithChildren } from "react";

export const AuthContext = createContext<{ user: string | null; login: (name: string) => void; logout: () => void; }>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function Providers({ children }: PropsWithChildren) {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("brandUser");
    if (stored) setUser(stored);
  }, []);

  const login = (name: string) => {
    setUser(name);
    if (typeof window !== "undefined") {
      localStorage.setItem("brandUser", name);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("brandUser");
    }
  };

  return (
    <SessionProvider>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
}
