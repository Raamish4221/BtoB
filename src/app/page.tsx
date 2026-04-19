"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect all traffic from root to login
    router.replace("/login");
  }, [router]);

  return null;
}
