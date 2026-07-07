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

interface Leave {
  id: number;
  employee_id: number;
  employee_name?: string;
  employee_email?: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  applied_on: string;
}

interface Attendance {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_email?: string;
  attendance_date: string;
  check_in: string;
  check_out: string | null;
  status: string;
}

interface EmployeeDocument {
  id: number;
  employee_id: number;
  identity_id: number;
  document_type: string;
  document_name: string;
  file_path: string;
  uploaded_at: string;
}

interface Payroll {
  employee_id: number;
  employee_name: string;
  salary: number;
  attendance_days: number;
  approved_leaves: number;
  deduction: number;
  final_salary: number;
}

export default function HRDashboard() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditAttendanceModal, setShowEditAttendanceModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);
  const [editAttendanceForm, setEditAttendanceForm] = useState({
    check_in: "",
    check_out: "",
    status: "Present"
  });
  const [documentForm, setDocumentForm] = useState({
    employee_id: 0,
    identity_id: 0,
    document_type: "",
    document_name: "",
    file_path: ""
  });
  const [newEmployee, setNewEmployee] = useState({
    employee_id: "",
    full_name: "",
    date_of_joining: "",
    date_of_birth: "",
    educational_qualification: "",
    parents_name: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    salary: 0,
    address: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const user = getAuthUser();
    if (!storedToken || !user || user.role !== "hr") {
      router.push("/login");
      return;
    }
    setToken(storedToken);
    fetchEmployees(storedToken);
    fetchLeaves(storedToken);
    fetchAttendance(storedToken);
    fetchDocuments(storedToken);
    fetchPayroll(storedToken);
  }, []);

  const fetchEmployees = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaves = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leave`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLeaves(data);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchAttendance = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const fetchDocuments = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employee-documents`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const fetchPayroll = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/payroll/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPayroll(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching payroll:", error);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });
      if (response.ok) {
        const data = await response.json();
        alert(`Employee created! Temporary login password: ${data.temporary_password}`);
        setShowAddModal(false);
        fetchEmployees(token!);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || "Failed to create employee"}`);
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Failed to create employee.");
    }
  };

  const handleLeaveAction = async (leaveId: number, action: "approve" | "reject") => {
    try {
      const response = await fetch(`${API_BASE_URL}/leave/${leaveId}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchLeaves(token!);
      }
    } catch (error) {
      console.error(`Error ${action} leave:`, error);
    }
  };

  const handleEditAttendance = (att: Attendance) => {
    setEditingAttendance(att);
    setEditAttendanceForm({
      check_in: att.check_in,
      check_out: att.check_out || "",
      status: att.status
    });
    setShowEditAttendanceModal(true);
  };

  const handleUpdateAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAttendance) return;
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${editingAttendance.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editAttendanceForm),
      });
      if (response.ok) {
        alert("Attendance updated successfully!");
        setShowEditAttendanceModal(false);
        fetchAttendance(token!);
      } else {
        alert("Failed to update attendance.");
      }
    } catch (error) {
      console.error("Attendance update error:", error);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/employee-documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(documentForm),
      });
      if (response.ok) {
        alert("Document added successfully!");
        setShowDocumentModal(false);
        setDocumentForm({
          employee_id: 0,
          identity_id: 0,
          document_type: "",
          document_name: "",
          file_path: ""
        });
        fetchDocuments(token!);
      } else {
        alert("Failed to add document.");
      }
    } catch (error) {
      console.error("Document add error:", error);
    }
  };

  const handleDeleteDocument = async (documentId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/employee-documents/${documentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchDocuments(token!);
      } else {
        alert("Failed to delete document.");
      }
    } catch (error) {
      console.error("Document delete error:", error);
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(6,182,212,0.16),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#ecfeff_100%)]">
      <Sidebar role="hr" onClose={() => setSidebarOpen(false)} />
      <TopNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        userName="HR Manager"
        userRole="hr"
      />

      <main className="ml-64 pt-16 p-6">
        <div className="mb-6 rounded-3xl border border-cyan-100 bg-slate-950 px-6 py-6 text-white shadow-2xl shadow-cyan-950/20">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">People operations</p>
          <h1 className="mt-2 text-3xl font-semibold">HR coordination hub</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">Guide employee records, monitor staffing, and keep the organization aligned.</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total employees</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{employees.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Engineering</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{employees.filter((e) => e.department === "Engineering").length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">HR team</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{employees.filter((e) => e.department === "HR").length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Sales</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{employees.filter((e) => e.department === "Sales").length}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm mb-8">
          <div className="border-b border-slate-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Employee directory</h2>
              <p className="text-sm text-slate-600">A focused view for onboarding and employee information.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              + Add Employee
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Designation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{employee.employee_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{employee.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{employee.designation}</td>
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm mb-8">
          <div className="border-b border-slate-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Leave Requests</h2>
              <p className="text-sm text-slate-600">Review and approve employee leave requests.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {leaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{leave.employee_name || `Emp #${leave.employee_id}`}</div>
                      <div className="text-sm text-slate-500">{leave.employee_email || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">{leave.leave_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{leave.start_date} to {leave.end_date}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{leave.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        leave.status === "Approved" ? "bg-green-100 text-green-700" :
                        leave.status === "Rejected" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {leave.status === "Pending" && (
                        <div className="flex gap-2">
                          <button onClick={() => handleLeaveAction(leave.id, "approve")} className="text-green-600 hover:text-green-900">Approve</button>
                          <button onClick={() => handleLeaveAction(leave.id, "reject")} className="text-red-600 hover:text-red-900">Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No leave requests found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm mb-8">
          <div className="border-b border-slate-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Attendance Records</h2>
              <p className="text-sm text-slate-600">View and edit employee attendance records.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{att.employee_name}</div>
                      <div className="text-sm text-slate-500">{att.employee_email || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{att.attendance_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{att.check_in}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{att.check_out || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        att.status === "Present" ? "bg-green-100 text-green-700" :
                        att.status === "Absent" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {att.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleEditAttendance(att)} className="text-blue-600 hover:text-blue-900">Edit</button>
                    </td>
                  </tr>
                ))}
                {attendance.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No attendance records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm mb-8">
          <div className="border-b border-slate-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Employee Documents</h2>
              <p className="text-sm text-slate-600">Manage employee documents and files.</p>
            </div>
            <button
              onClick={() => setShowDocumentModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              + Add Document
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Document Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Document Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doc.employee_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{doc.document_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{doc.document_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No documents found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm mb-8">
          <div className="border-b border-slate-200 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Payroll Overview</h2>
              <p className="text-sm text-slate-600">View salary calculations and deductions for all employees.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Base Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Days Present</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Leaves</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Deduction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Final Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payroll.map((pay) => (
                  <tr key={pay.employee_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{pay.employee_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">${pay.salary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{pay.attendance_days}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{pay.approved_leaves}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-${pay.deduction.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">${pay.final_salary.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  </tr>
                ))}
                {payroll.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No payroll data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Employee</h2>
            <form onSubmit={handleAddEmployee} className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
                <input required type="text" className="w-full rounded-lg border p-2" value={newEmployee.employee_id} onChange={e => setNewEmployee({...newEmployee, employee_id: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" className="w-full rounded-lg border p-2" value={newEmployee.full_name} onChange={e => setNewEmployee({...newEmployee, full_name: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input required type="email" className="w-full rounded-lg border p-2" value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input required type="text" className="w-full rounded-lg border p-2" value={newEmployee.phone} onChange={e => setNewEmployee({...newEmployee, phone: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Joining</label>
                <input required type="date" className="w-full rounded-lg border p-2" value={newEmployee.date_of_joining} onChange={e => setNewEmployee({...newEmployee, date_of_joining: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                <input required type="date" className="w-full rounded-lg border p-2" value={newEmployee.date_of_birth} onChange={e => setNewEmployee({...newEmployee, date_of_birth: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <input required type="text" className="w-full rounded-lg border p-2" value={newEmployee.department} onChange={e => setNewEmployee({...newEmployee, department: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                <input required type="text" className="w-full rounded-lg border p-2" value={newEmployee.designation} onChange={e => setNewEmployee({...newEmployee, designation: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Salary</label>
                <input required type="number" className="w-full rounded-lg border p-2" value={newEmployee.salary} onChange={e => setNewEmployee({...newEmployee, salary: Number(e.target.value)})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Qualification</label>
                <input required type="text" className="w-full rounded-lg border p-2" value={newEmployee.educational_qualification} onChange={e => setNewEmployee({...newEmployee, educational_qualification: e.target.value})} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Parents Name</label>
                <input required type="text" className="w-full rounded-lg border p-2" value={newEmployee.parents_name} onChange={e => setNewEmployee({...newEmployee, parents_name: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea required className="w-full rounded-lg border p-2" rows={2} value={newEmployee.address} onChange={e => setNewEmployee({...newEmployee, address: e.target.value})} />
              </div>
              
              <div className="col-span-2 mt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Attendance Modal */}
      {showEditAttendanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Attendance</h2>
            <form onSubmit={handleUpdateAttendance} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Check In Time</label>
                <input required type="datetime-local" className="w-full rounded-lg border p-2" value={editAttendanceForm.check_in} onChange={e => setEditAttendanceForm({...editAttendanceForm, check_in: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Check Out Time</label>
                <input type="datetime-local" className="w-full rounded-lg border p-2" value={editAttendanceForm.check_out} onChange={e => setEditAttendanceForm({...editAttendanceForm, check_out: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select required className="w-full rounded-lg border p-2" value={editAttendanceForm.status} onChange={e => setEditAttendanceForm({...editAttendanceForm, status: e.target.value})}>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowEditAttendanceModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Update Attendance</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Add Document</h2>
            <form onSubmit={handleAddDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
                <input required type="number" className="w-full rounded-lg border p-2" value={documentForm.employee_id} onChange={e => setDocumentForm({...documentForm, employee_id: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Identity ID</label>
                <input required type="number" className="w-full rounded-lg border p-2" value={documentForm.identity_id} onChange={e => setDocumentForm({...documentForm, identity_id: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
                <select required className="w-full rounded-lg border p-2" value={documentForm.document_type} onChange={e => setDocumentForm({...documentForm, document_type: e.target.value})}>
                  <option value="">Select Type</option>
                  <option value="Resume">Resume</option>
                  <option value="ID Proof">ID Proof</option>
                  <option value="Education Certificate">Education Certificate</option>
                  <option value="Experience Letter">Experience Letter</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Name</label>
                <input required type="text" className="w-full rounded-lg border p-2" value={documentForm.document_name} onChange={e => setDocumentForm({...documentForm, document_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File Path</label>
                <input required type="text" className="w-full rounded-lg border p-2" value={documentForm.file_path} onChange={e => setDocumentForm({...documentForm, file_path: e.target.value})} placeholder="/path/to/document.pdf" />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowDocumentModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
