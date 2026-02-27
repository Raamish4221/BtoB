"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

interface AuthUser {
  full_name: string;
  role_name: string;
  email: string;
  company_name?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  logout: () => void;
  getInitials: (name: string) => string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user] = useState<AuthUser>({
    full_name: "Raamish Customer",
    role_name: "customer",
    email: "raamish@cardcove.com",
    company_name: "CardCove",
  });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      logout: () => {
        // Placeholder logout for local preview.
        window.alert("Logout clicked");
      },
      getInitials,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
