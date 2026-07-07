"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { CalendarDays } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

export default function AttendancePage() {
  const router = useRouter();
  const [attendances, setAttendances] = useState<any[]>([]);
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

    if (userRole === "admin" || userRole === "hr" || userRole === "manager") {
      fetchAttendance(token, "admin");
    } else {
      fetchAttendance(token, "employee");
    }
  }, []);

  const fetchAttendance = async (authToken: string, fetchRole: string) => {
    try {
      let endpoint = `${API_BASE_URL}/attendance`;
      if (fetchRole === "employee") {
        endpoint = `${API_BASE_URL}/my/attendance`;
      }

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAttendances(data);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/attendance/checkin`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      fetchAttendance(token!, role);
    } catch (error) {
      console.error("Error checking in:", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/attendance/checkout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      fetchAttendance(token!, role);
    } catch (error) {
      console.error("Error checking out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar role={role} onClose={() => setSidebarOpen(false)} />
      <TopNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        userName={role.toUpperCase()}
        userRole={role}
      />

      <main className="ml-64 pt-16 p-6">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
              <CalendarDays size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Attendance Log</h1>
              <p className="text-sm text-slate-600">
                {role === "admin" || role === "hr" || role === "manager" ? "Company-wide attendance records" : "Your personal attendance history"}
              </p>
            </div>
          </div>
          {role === "employee" && (
            <div className="flex gap-4">
              <button
                onClick={handleCheckIn}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                Check In
              </button>
              <button
                onClick={handleCheckOut}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Check Out
              </button>
            </div>
          )}
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{attendances.length}</div>
            <div className="mt-1 text-sm text-slate-600">Total Records</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{attendances.filter(a => a.status === 'Present').length}</div>
            <div className="mt-1 text-sm text-slate-600">Present Days</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Date</th>
                  {(role === "admin" || role === "hr" || role === "manager") && (
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Employee</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {attendances.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{a.attendance_date}</td>
                    {(role === "admin" || role === "hr" || role === "manager") && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{a.employee_name || `Emp #${a.employee_id}`}</div>
                        <div className="text-sm text-slate-500">{a.employee_email || 'Unknown'}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{a.check_in ? new Date(a.check_in).toLocaleTimeString() : "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{a.check_out ? new Date(a.check_out).toLocaleTimeString() : "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {attendances.length === 0 && !loading && (
                  <tr>
                    <td colSpan={(role === "admin" || role === "hr" || role === "manager") ? 5 : 4} className="px-6 py-8 text-center text-slate-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={(role === "admin" || role === "hr" || role === "manager") ? 5 : 4} className="px-6 py-8 text-center text-slate-500">
                      Loading attendance...
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
