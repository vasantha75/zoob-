"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { API_BASE_URL } from "@/services/api";
import { getAuthUser } from "@/lib/auth";

interface Employee {
  id: number;
  identity_id: number;
  employee_id: string;
  full_name: string;
  date_of_joining: string;
  date_of_birth: string;
  educational_qualification: string;
  parents_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  address: string;
  leaving_date: string | null;
}

export default function EmployeeDashboard() {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [payroll, setPayroll] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveRequest, setLeaveRequest] = useState({
    leave_type: "Casual",
    start_date: "",
    end_date: "",
    reason: ""
  });
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    phone: "",
    address: ""
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const user = getAuthUser();
    if (!storedToken || !user || user.role !== "employee") {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchEmployeeProfile(storedToken);
    fetchPayroll(storedToken);
  }, []);

  const fetchEmployeeProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployee(data);
      }
    } catch (error) {
      console.error("Error fetching employee profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayroll = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/my/payroll`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPayroll(data);
      }
    } catch (error) {
      console.error("Error fetching payroll:", error);
    }
  };

  const handleCheckIn = async () => {
    if (!employee) return;
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employee_id: employee.id }),
      });
      if (response.ok) alert("Checked in successfully for today!");
      else alert("Check-in failed or already checked in.");
    } catch (error) {
      console.error("Check-in error:", error);
    }
  };

  const handleCheckOut = async () => {
    if (!employee) return;
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employee_id: employee.id }),
      });
      if (response.ok) alert("Checked out successfully!");
      else {
        const err = await response.json();
        alert(`Checkout failed: ${err.detail}`);
      }
    } catch (error) {
      console.error("Check-out error:", error);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    try {
      const response = await fetch(`${API_BASE_URL}/leave/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...leaveRequest, employee_id: employee.id }),
      });
      if (response.ok) {
        alert("Leave request submitted successfully!");
        setShowLeaveModal(false);
      } else alert("Failed to submit leave request.");
    } catch (error) {
      console.error("Leave error:", error);
    }
  };

  const handleEditProfile = () => {
    if (!employee) return;
    setEditFormData({
      phone: employee.phone,
      address: employee.address
    });
    setShowEditProfileModal(true);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
    try {
      const response = await fetch(`${API_BASE_URL}/employees/${employee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });
      if (response.ok) {
        alert("Profile updated successfully!");
        setShowEditProfileModal(false);
        fetchEmployeeProfile(token!);
      } else alert("Failed to update profile.");
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#f0fdf4_100%)]">
      <Sidebar role="employee" onClose={() => setSidebarOpen(false)} />
      <TopNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        userName={employee?.full_name || "Employee"}
        userRole="employee"
      />

      <main className="ml-64 pt-16 p-6">
        <div className="mb-6 rounded-3xl border border-emerald-100 bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-emerald-950/20 flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">My workspace</p>
            <h1 className="mt-2 text-3xl font-semibold">Employee profile center</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Keep your personal and employment details close at hand.</p>
          </div>
          {employee && (
            <div className="flex gap-3">
              <button onClick={handleCheckIn} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition">Check In</button>
              <button onClick={handleCheckOut} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition">Check Out</button>
              <button onClick={() => setShowLeaveModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition">Apply Leave</button>
            </div>
          )}
        </div>

        {employee ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {employee.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{employee.full_name}</h2>
                  <p className="text-slate-600 font-medium">{employee.designation}</p>
                  <p className="text-sm text-slate-500 mt-1">{employee.department} Dept.</p>
                </div>
              </div>

              {payroll && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900">Current Payroll Snapshot</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-600">Base Salary:</span>
                      <span className="font-semibold text-slate-900">${payroll.salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-600">Days Present:</span>
                      <span className="font-medium text-slate-900">{payroll.attendance_days}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-600">Leaves Taken:</span>
                      <span className="font-medium text-slate-900">{payroll.approved_leaves}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-slate-800 font-bold">Estimated Payout:</span>
                      <span className="font-bold text-emerald-600">${payroll.final_salary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Details Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-full">
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                  <h3 className="text-xl font-bold text-slate-900">Personal & Contact Info</h3>
                  <button onClick={handleEditProfile} className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">Edit Profile</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500">Employee ID</p>
                    <p className="font-medium text-slate-900">{employee.employee_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Email Address</p>
                    <p className="font-medium text-slate-900">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Phone Number</p>
                    <p className="font-medium text-slate-900">{employee.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Date of Birth</p>
                    <p className="font-medium text-slate-900">{employee.date_of_birth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Parents Name</p>
                    <p className="font-medium text-slate-900">{employee.parents_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Education</p>
                    <p className="font-medium text-slate-900">{employee.educational_qualification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Joining Date</p>
                    <p className="font-medium text-slate-900">{employee.date_of_joining}</p>
                  </div>
                  <div className="md:col-span-2 mt-2">
                    <p className="text-sm text-slate-500">Address</p>
                    <p className="font-medium text-slate-900">{employee.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">No Profile Found</h2>
            <p className="mt-2 text-slate-600">
              Your employee profile has not been created yet. Please contact HR to complete your onboarding.
            </p>
          </div>
        )}
      </main>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Apply for Leave</h2>
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
                <select className="w-full rounded-lg border p-2" value={leaveRequest.leave_type} onChange={e => setLeaveRequest({...leaveRequest, leave_type: e.target.value})}>
                  <option value="Casual">Casual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Earned">Earned Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input required type="date" className="w-full rounded-lg border p-2" value={leaveRequest.start_date} onChange={e => setLeaveRequest({...leaveRequest, start_date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input required type="date" className="w-full rounded-lg border p-2" value={leaveRequest.end_date} onChange={e => setLeaveRequest({...leaveRequest, end_date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                <textarea required className="w-full rounded-lg border p-2" rows={3} value={leaveRequest.reason} onChange={e => setLeaveRequest({...leaveRequest, reason: e.target.value})} />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowLeaveModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Profile</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input required type="text" className="w-full rounded-lg border p-2" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea required className="w-full rounded-lg border p-2" rows={3} value={editFormData.address} onChange={e => setEditFormData({...editFormData, address: e.target.value})} />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditProfileModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Update Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
