"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { Banknote } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function PayrollPage() {
  const router = useRouter();
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>("employee");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    let userRole = "employee";
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      userRole = payload.role;
      setRole(userRole);
    } catch {
      router.push("/login");
      return;
    }

    fetchPayroll(userRole);
  }, []);

  const fetchPayroll = async (userRole: string) => {
    try {
      const endpoint = userRole === "admin" || userRole === "hr" ? "/payroll/all" : "/my/payroll";
      const data = await apiRequest(endpoint);
      // /my/payroll returns a single object, while /payroll/all returns an array
      if (Array.isArray(data)) {
        setPayrollData(data);
      } else {
        setPayrollData([data]);
      }
    } catch (error) {
      console.error("Error fetching payroll:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPayroll = payrollData.reduce((acc, curr) => acc + (curr.final_salary || 0), 0);
  const totalDeductions = payrollData.reduce((acc, curr) => acc + (curr.deduction || 0), 0);

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar role={role} onClose={() => setSidebarOpen(false)} />
      <TopNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        userName={role.toUpperCase()}
        userRole={role}
      />

      <main className={`p-6 pt-20 transition-all ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-2 text-green-600">
              <Banknote size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Payroll Dashboard</h1>
              <p className="text-sm text-slate-600">
                {role === "admin" || role === "hr" ? "Manage and view all employee salaries" : "View your salary and deductions"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-bold text-green-600">${totalPayroll.toFixed(2)}</div>
            <div className="mt-1 text-sm text-slate-600">Total Processed Salaries</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-bold text-red-600">${totalDeductions.toFixed(2)}</div>
            <div className="mt-1 text-sm text-slate-600">Total Deductions (Leaves)</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-bold text-slate-800">{payrollData.length}</div>
            <div className="mt-1 text-sm text-slate-600">Employees Processed</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {(role === "admin" || role === "hr") && (
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Emp ID</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Base Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Days Present</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Leaves</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Deduction</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Final Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {payrollData.map((p, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    {(role === "admin" || role === "hr") && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{p.employee_id}</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{p.employee_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">${p.salary?.toFixed(2) || "0.00"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{p.attendance_days}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{p.approved_leaves}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-${p.deduction?.toFixed(2) || "0.00"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">${p.final_salary?.toFixed(2) || "0.00"}</td>
                  </tr>
                ))}
                {payrollData.length === 0 && !loading && (
                  <tr>
                    <td colSpan={(role === "admin" || role === "hr") ? 7 : 6} className="px-6 py-8 text-center text-slate-500">
                      No payroll data found.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={(role === "admin" || role === "hr") ? 7 : 6} className="px-6 py-8 text-center text-slate-500">
                      Loading payroll...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
