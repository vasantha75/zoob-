"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { UserCircle2, Mail, Phone, Briefcase, Building2 } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [empDetails, setEmpDetails] = useState<any>(null);
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

    fetchProfile(token);
    if (userRole !== "admin" && userRole !== "hr") {
      fetchEmployeeDetails(token);
    }
  }, []);

  const fetchProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeDetails = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setEmpDetails(data);
      }
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar role={role} onClose={() => setSidebarOpen(false)} />
      <TopNavbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        userName={role.toUpperCase()}
        userRole={role}
      />

      <main className="ml-64 pt-16 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Profile Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                  <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <UserCircle2 size={48} />
                  </div>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-semibold capitalize border border-indigo-100">
                  {profile.role} Role
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{profile.full_name}</h1>
                <p className="text-slate-500 mt-1">{empDetails?.designation || (role === 'admin' ? 'Administrator' : 'HR Manager')}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Mail className="text-slate-400" size={20} />
                Contact Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <p className="text-slate-900 font-medium mt-1">{profile.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                  <p className="text-slate-900 font-medium mt-1">{profile.phone || "Not provided"}</p>
                </div>
                {empDetails && (
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Residential Address</label>
                    <p className="text-slate-900 font-medium mt-1">{empDetails.address || "Not provided"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Employment Details (Only for employees) */}
            {empDetails ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Briefcase className="text-slate-400" size={20} />
                  Employment Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee ID</label>
                      <p className="text-slate-900 font-medium mt-1">{empDetails.employee_id}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</label>
                      <p className="text-slate-900 font-medium mt-1">{empDetails.department}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Joining</label>
                      <p className="text-slate-900 font-medium mt-1">{empDetails.date_of_joining}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base Salary</label>
                      <p className="text-slate-900 font-medium mt-1">${empDetails.salary?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Education</label>
                    <p className="text-slate-900 font-medium mt-1">{empDetails.educational_qualification}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
                <Building2 className="text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-slate-900">System Administrator</h3>
                <p className="text-sm text-slate-500 mt-2">
                  You are viewing an administrative profile. Employment specifics (salary, department) do not apply.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
