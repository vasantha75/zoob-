"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  BriefcaseBusiness,
  PencilLine,
  Search,
  Trash2,
  UserPlus,
  Users2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { apiRequest } from "@/services/api";

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

interface EmployeeManagementPanelProps {
  role?: "admin" | "hr" | "manager" | "employee";
  title?: string;
}

const initialFormData = {
  identity_id: 1,
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
  leaving_date: "",
};

export default function EmployeeManagementPanel({
  role = "admin",
  title = "Employee Management",
}: EmployeeManagementPanelProps) {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }

    fetchEmployees();
  }, [router]);

  const fetchEmployees = async () => {
    try {
      setError(null);
      const data = await apiRequest("/employees");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load employees at the moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        ...formData,
        leaving_date: formData.leaving_date ? formData.leaving_date : null,
        ...(formData.identity_id ? { identity_id: formData.identity_id } : {}),
      };

      const method = editingEmployee ? "PUT" : "POST";
      const path = editingEmployee ? `/employees/${editingEmployee.id}` : "/employees";

      const response = await apiRequest(path, {
        method,
        body: JSON.stringify(payload),
      });

      if (!editingEmployee && typeof response === "object" && response && "temporary_password" in response) {
        const tempPassword = (response as { temporary_password?: string }).temporary_password;
        setSuccessMessage(
          tempPassword
            ? `Employee created successfully. Temporary password: ${tempPassword}`
            : "Employee created successfully."
        );
      }

      setShowModal(false);
      setEditingEmployee(null);
      setFormData(initialFormData);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setError("Unable to save the employee record.");
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      identity_id: employee.identity_id || 1,
      employee_id: employee.employee_id || "",
      full_name: employee.full_name || "",
      date_of_joining: employee.date_of_joining || "",
      date_of_birth: employee.date_of_birth || "",
      educational_qualification: employee.educational_qualification || "",
      parents_name: employee.parents_name || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
      salary: employee.salary || 0,
      address: employee.address || "",
      leaving_date: employee.leaving_date || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this employee record?")) return;

    try {
      await apiRequest(`/employees/${id}`, { method: "DELETE" });
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setError("Unable to delete the employee record.");
    }
  };

  const filteredEmployees = useMemo(() => {
    let result = employees;

    if (filterDepartment === "Engineering") {
      result = result.filter(e => e.department === "Engineering");
    } else if (filterDepartment === "HR") {
      result = result.filter(e => e.department === "HR");
    } else if (filterDepartment === "Active") {
      result = result.filter(e => !e.leaving_date);
    }

    const term = searchTerm.toLowerCase();
    if (term) {
      result = result.filter((employee) =>
        [employee.full_name, employee.email, employee.department, employee.designation]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }
    return result;
  }, [employees, searchTerm, filterDepartment]);

  const stats = useMemo(() => {
    return {
      total: employees.length,
      engineering: employees.filter((employee) => employee.department === "Engineering").length,
      hr: employees.filter((employee) => employee.department === "HR").length,
      active: employees.filter((employee) => !employee.leaving_date).length,
    };
  }, [employees]);

  const canManageEmployees = role === "admin" || role === "hr";

  return (
    <div className="min-h-screen bg-slate-100">
      {sidebarOpen && <Sidebar role={role} onClose={() => setSidebarOpen(false)} />}
      <TopNavbar
        onMenuClick={() => setSidebarOpen((value) => !value)}
        userName={role === "admin" ? "Admin" : role.charAt(0).toUpperCase() + role.slice(1)}
        userRole={role}
      />

      <main className={`pt-16 p-6 transition-all ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-indigo-600">Zoob HRMS</p>
            <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Register, review, update, and remove employee records from a single streamlined workspace.
            </p>
          </div>
          {canManageEmployees && (
            <button
              onClick={() => {
                setEditingEmployee(null);
                setFormData(initialFormData);
                setShowModal(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <UserPlus size={16} />
              Register Employee
            </button>
          )}
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div 
            onClick={() => setFilterDepartment(null)}
            className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition-all ${filterDepartment === null ? "border-indigo-400 bg-indigo-50/50 ring-2 ring-indigo-400/20" : "border-slate-200 bg-white hover:border-indigo-300"}`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                <Users2 size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total employees</p>
                <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div 
            onClick={() => setFilterDepartment("Engineering")}
            className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition-all ${filterDepartment === "Engineering" ? "border-emerald-400 bg-emerald-50/50 ring-2 ring-emerald-400/20" : "border-slate-200 bg-white hover:border-emerald-300"}`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                <BriefcaseBusiness size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Engineering</p>
                <p className="text-2xl font-semibold text-slate-900">{stats.engineering}</p>
              </div>
            </div>
          </div>
          <div 
            onClick={() => setFilterDepartment("HR")}
            className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition-all ${filterDepartment === "HR" ? "border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/20" : "border-slate-200 bg-white hover:border-amber-300"}`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-2 text-amber-600">
                <BadgeCheck size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">HR team</p>
                <p className="text-2xl font-semibold text-slate-900">{stats.hr}</p>
              </div>
            </div>
          </div>
          <div 
            onClick={() => setFilterDepartment("Active")}
            className={`cursor-pointer rounded-2xl border p-5 shadow-sm transition-all ${filterDepartment === "Active" ? "border-sky-400 bg-sky-50/50 ring-2 ring-sky-400/20" : "border-slate-200 bg-white hover:border-sky-300"}`}
          >
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-sky-100 p-2 text-sky-600">
                <Users2 size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active records</p>
                <p className="text-2xl font-semibold text-slate-900">{stats.active}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Employee directory</h2>
              <p className="text-sm text-slate-600">Manage every employee profile from one place.</p>
            </div>
            <div className="relative md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search employees"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none ring-0"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">Loading employee records...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No employees found. Use the register button to add the first record.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Contact</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredEmployees.map((employee) => (
                    <tr 
                      key={employee.id} 
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => setViewingEmployee(employee)}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">{employee.employee_id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-900">{employee.full_name}</div>
                        <div className="text-xs text-slate-500">{employee.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{employee.department}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{employee.designation}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{employee.phone}</td>
                      <td className="px-6 py-4 text-right text-sm">
                        {canManageEmployees ? (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleEdit(employee); }} 
                              className="mr-3 inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                            >
                              <PencilLine size={14} />
                              Edit
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(employee.id); }} 
                              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </>
                        ) : (
                          <span className="text-slate-400">View only</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-indigo-600">Employee details</p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  {editingEmployee ? "Update employee" : "Register employee"}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-2xl text-slate-400 hover:text-slate-600">×</button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Linked account ID (optional)</label>
                <input value={formData.identity_id} onChange={(event) => setFormData({ ...formData, identity_id: Number(event.target.value) || 0 })} type="number" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Employee ID</label>
                <input value={formData.employee_id} onChange={(event) => setFormData({ ...formData, employee_id: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                <input value={formData.full_name} onChange={(event) => setFormData({ ...formData, full_name: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                <input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Date of joining</label>
                <input type="date" value={formData.date_of_joining} onChange={(event) => setFormData({ ...formData, date_of_joining: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Date of birth</label>
                <input type="date" value={formData.date_of_birth} onChange={(event) => setFormData({ ...formData, date_of_birth: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Qualification</label>
                <input value={formData.educational_qualification} onChange={(event) => setFormData({ ...formData, educational_qualification: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Parent / guardian</label>
                <input value={formData.parents_name} onChange={(event) => setFormData({ ...formData, parents_name: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
                <select value={formData.department} onChange={(event) => setFormData({ ...formData, department: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none">
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Designation</label>
                <input value={formData.designation} onChange={(event) => setFormData({ ...formData, designation: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Salary</label>
                <input type="number" value={formData.salary} onChange={(event) => setFormData({ ...formData, salary: Number(event.target.value) })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">Address</label>
                <textarea rows={3} value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} required className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Save employee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-xl font-semibold text-white shadow-md">
                  {viewingEmployee.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">{viewingEmployee.full_name}</h2>
                  <p className="text-sm font-medium text-indigo-600">{viewingEmployee.designation} • {viewingEmployee.department}</p>
                </div>
              </div>
              <button onClick={() => setViewingEmployee(null)} className="text-2xl text-slate-400 hover:text-slate-600 transition-colors">×</button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Employee ID</span>
                  <span className="mt-1 block font-semibold text-slate-900">{viewingEmployee.employee_id}</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Email</span>
                  <span className="mt-1 block font-semibold text-slate-900">{viewingEmployee.email}</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Phone</span>
                  <span className="mt-1 block font-semibold text-slate-900">{viewingEmployee.phone}</span>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Salary</span>
                  <span className="mt-1 block font-semibold text-slate-900">${viewingEmployee.salary?.toLocaleString() || "0"}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-600">Joined</span>
                  <span className="font-semibold text-slate-900">{viewingEmployee.date_of_joining}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-600">Date of Birth</span>
                  <span className="font-semibold text-slate-900">{viewingEmployee.date_of_birth}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-600">Qualification</span>
                  <span className="font-semibold text-slate-900">{viewingEmployee.educational_qualification}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-600">Guardian</span>
                  <span className="font-semibold text-slate-900">{viewingEmployee.parents_name}</span>
                </div>
                <div className="rounded-xl bg-slate-50 px-4 py-3">
                  <span className="block text-xs uppercase tracking-[0.2em] text-slate-400">Address</span>
                  <span className="mt-1 block text-sm font-semibold text-slate-900">{viewingEmployee.address}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setViewingEmployee(null)} 
                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
