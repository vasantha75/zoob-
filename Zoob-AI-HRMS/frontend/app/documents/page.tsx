"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { FileText, Plus, Trash2 } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>("employee");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("Contract");
  const [docUrl, setDocUrl] = useState("");
  
  // Current user's emp id (for employee role viewing their own)
  const [myEmpId, setMyEmpId] = useState<number | null>(null);

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

    fetchInitialData(userRole);
  }, []);

  const fetchInitialData = async (userRole: string) => {
    try {
      if (userRole === "admin" || userRole === "hr") {
        const emps = await apiRequest("/employees");
        setEmployees(emps);
        // By default, just fetch for the first employee if exists, or require selection
        if (emps.length > 0) {
          fetchDocuments(emps[0].id);
          setSelectedEmpId(emps[0].id.toString());
        }
      } else {
        const myData = await apiRequest("/employees/me");
        setMyEmpId((myData as any).id);
        fetchDocuments((myData as any).id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async (empId: number) => {
    try {
      setLoading(true);
      const docs = await apiRequest(`/employee-documents/${empId}`);
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmpChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedEmpId(id);
    if (id) {
      fetchDocuments(parseInt(id));
    } else {
      setDocuments([]);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpId) return;

    try {
      const emp = employees.find(e => e.id.toString() === selectedEmpId);
      if (!emp) return;

      await apiRequest("/employee-documents", {
        method: "POST",
        body: JSON.stringify({
          employee_id: emp.id,
          identity_id: emp.identity_id,
          document_name: docName,
          document_type: docType,
          file_path: docUrl
        }),
      });
      setShowAddModal(false);
      setDocName("");
      setDocUrl("");
      fetchDocuments(emp.id);
    } catch (error) {
      console.error("Error adding document", error);
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    try {
      await apiRequest(`/employee-documents/${docId}`, { method: "DELETE" });
      if (role === "admin" || role === "hr") {
        fetchDocuments(parseInt(selectedEmpId));
      } else if (myEmpId) {
        fetchDocuments(myEmpId);
      }
    } catch (error) {
      console.error("Error deleting document", error);
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
            <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Document Manager</h1>
              <p className="text-sm text-slate-600">
                {role === "admin" || role === "hr" ? "Manage compliance files and records" : "View your official documents"}
              </p>
            </div>
          </div>
          {(role === "admin" || role === "hr") && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus size={18} /> Add Document
            </button>
          )}
        </div>

        {(role === "admin" || role === "hr") && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <label className="mr-4 text-sm font-medium text-slate-700">Select Employee:</label>
            <select 
              value={selectedEmpId} 
              onChange={handleEmpChange}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">-- Choose Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.full_name} (ID: {emp.employee_id})</option>
              ))}
            </select>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Document Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Uploaded</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Link</th>
                  {(role === "admin" || role === "hr") && (
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {documents.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{d.document_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {d.document_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(d.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a href={d.file_path} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        View File
                      </a>
                    </td>
                    {(role === "admin" || role === "hr") && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button onClick={() => handleDeleteDocument(d.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {documents.length === 0 && !loading && (
                  <tr>
                    <td colSpan={(role === "admin" || role === "hr") ? 5 : 4} className="px-6 py-8 text-center text-slate-500">
                      No documents found for this employee.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={(role === "admin" || role === "hr") ? 5 : 4} className="px-6 py-8 text-center text-slate-500">
                      Loading documents...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Document Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Add Document</h2>
              <form onSubmit={handleAddDocument} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Document Name</label>
                  <input 
                    type="text" required 
                    value={docName} onChange={e => setDocName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. Identity Proof"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Document Type</label>
                  <select 
                    value={docType} 
                    onChange={e => setDocType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option>Contract</option>
                    <option>ID Proof</option>
                    <option>Offer Letter</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Document URL (Mock)</label>
                  <input 
                    type="url" required 
                    value={docUrl} onChange={e => setDocUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="https://example.com/file.pdf"
                  />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
                  <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Save Document</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
