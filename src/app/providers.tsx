"use client";

import { AuthProvider } from "@/app/context/AuthContext";
import { ShopProvider } from "@/app/context/ShopContext";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ShopProvider>{children}</ShopProvider>
    </AuthProvider>
  );
}
