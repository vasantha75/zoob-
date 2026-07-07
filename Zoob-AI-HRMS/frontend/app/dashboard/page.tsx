"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoleDashboardPath } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      router.replace(getRoleDashboardPath(payload.role || "employee"));
    } catch {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
