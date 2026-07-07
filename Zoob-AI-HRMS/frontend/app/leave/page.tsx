"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function LeavePage() {
  const router = useRouter();
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>("employee");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // For Employee apply leave
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState("Sick");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

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

    fetchLeaves(userRole);
  }, []);

  const fetchLeaves = async (userRole: string) => {
    try {
      const endpoint = userRole === "admin" || userRole === "hr" || userRole === "manager" ? "/leave" : "/my/leave";
      const data = await apiRequest(endpoint);
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      const employeeId = payload.user_id; // In main.py, it uses employee_id. Assuming token has user_id, which maps to employee in backend. 
      // Wait, in main.py, `/leave/apply` takes `employee_id`. However, employees/me returns the employee.
      // A better way is to fetch `/employees/me` to get the employee_id.
      
      const empData = await apiRequest("/employees/me");
      
      await apiRequest("/leave/apply", {
        method: "POST",
        body: JSON.stringify({
          employee_id: (empData as any).id,
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason: reason
        }),
      });
      setShowApplyModal(false);
      fetchLeaves(role);
    } catch (error) {
      console.error("Error applying leave", error);
    }
  };

  const updateLeaveStatus = async (leaveId: number, action: "approve" | "reject") => {
    try {
      await apiRequest(`/leave/${leaveId}/${action}`, { method: "PUT" });
      fetchLeaves(role);
    } catch (error) {
      console.error("Error updating leave", error);
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

      <main className={`p-6 pt-20 transition-all ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-100 p-2 text-orange-600">
              <Calendar size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
              <p className="text-sm text-slate-600">
                {role === "admin" || role === "hr" || role === "manager" ? "Review and manage leave requests" : "View your leave history and apply"}
              </p>
            </div>
          </div>
          {role === "employee" && (
            <button 
              onClick={() => setShowApplyModal(true)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              Apply Leave
            </button>
          )}
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-bold text-slate-800">{leaves.length}</div>
            <div className="mt-1 text-sm text-slate-600">Total Requests</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-bold text-orange-600">{leaves.filter(l => l.status === 'Pending').length}</div>
            <div className="mt-1 text-sm text-slate-600">Pending</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">{leaves.filter(l => l.status === 'Approved').length}</div>
            <div className="mt-1 text-sm text-slate-600">Approved</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {(role === "admin" || role === "hr" || role === "manager") && (
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Employee</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Status</th>
                  {(role === "admin" || role === "hr" || role === "manager") && (
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {leaves.map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    {(role === "admin" || role === "hr" || role === "manager") && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{l.employee_name || `Emp #${l.employee_id}`}</div>
                        <div className="text-sm text-slate-500">{l.employee_email || 'Unknown'}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{l.leave_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{l.start_date} to {l.end_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 truncate max-w-[200px]">{l.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        l.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                        l.status === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    {(role === "admin" || role === "hr" || role === "manager") && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        {l.status === "Pending" && (
                          <div className="flex justify-end gap-2">
                            <button onClick={() => updateLeaveStatus(l.id, "approve")} className="text-emerald-600 hover:text-emerald-900"><CheckCircle size={18} /></button>
                            <button onClick={() => updateLeaveStatus(l.id, "reject")} className="text-red-600 hover:text-red-900"><XCircle size={18} /></button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
                {leaves.length === 0 && !loading && (
                  <tr>
                    <td colSpan={(role === "admin" || role === "hr" || role === "manager") ? 6 : 4} className="px-6 py-8 text-center text-slate-500">
                      No leave requests found.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={(role === "admin" || role === "hr" || role === "manager") ? 6 : 4} className="px-6 py-8 text-center text-slate-500">
                      Loading leaves...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Apply Leave Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Apply for Leave</h2>
              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Leave Type</label>
                  <select 
                    value={leaveType} 
                    onChange={e => setLeaveType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option>Sick</option>
                    <option>Casual</option>
                    <option>Vacation</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Start Date</label>
                    <input 
                      type="date" required 
                      value={startDate} onChange={e => setStartDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">End Date</label>
                    <input 
                      type="date" required 
                      value={endDate} onChange={e => setEndDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Reason</label>
                  <textarea 
                    required 
                    value={reason} onChange={e => setReason(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowApplyModal(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
                  <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
