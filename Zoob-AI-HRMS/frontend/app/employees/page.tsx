"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import EmployeeManagementPanel from "@/components/EmployeeManagementPanel";

export default function EmployeesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      if (payload.role !== "admin" && payload.role !== "hr") {
        router.replace("/profile");
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  return <EmployeeManagementPanel role="admin" title="Employee Management" />;
}
