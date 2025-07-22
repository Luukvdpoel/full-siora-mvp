"use client";
import React from 'react';
import { createContext, useContext, useEffect, useState } from "react";
import * as React from 'react'


export type BrandUser = { email: string } | null;

interface BrandUserContextType {
  user: BrandUser;
  setUser: (u: BrandUser) => void;
}

const BrandUserContext = createContext<BrandUserContextType>({
  user: null,
  setUser: () => {},
});

export function BrandUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BrandUser>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("brandUser");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) localStorage.setItem("brandUser", JSON.stringify(user));
    else localStorage.removeItem("brandUser");
  }, [user]);

  return (
    <BrandUserContext.Provider value={{ user, setUser }}>
      {children}
    </BrandUserContext.Provider>
  );
}

export function useBrandUser() {
  return useContext(BrandUserContext);
}
