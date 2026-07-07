"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { Settings, Bell, Shield, Palette, Globe } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("employee");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Settings state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyDigest: true,
  });

  const [appearance, setAppearance] = useState({
    theme: "Light",
    compactMode: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      setRole(payload.role);
    } catch {
      router.push("/login");
      return;
    }

    // Load settings from local storage if any
    const savedNotifs = localStorage.getItem("zoob_settings_notifs");
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
    
    const savedApp = localStorage.getItem("zoob_settings_app");
    if (savedApp) setAppearance(JSON.parse(savedApp));

  }, [router]);

  const saveSettings = () => {
    localStorage.setItem("zoob_settings_notifs", JSON.stringify(notifications));
    localStorage.setItem("zoob_settings_app", JSON.stringify(appearance));
    alert("Settings saved successfully!");
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                <Settings size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-600">Manage your account preferences and configurations</p>
              </div>
            </div>
            <button
              onClick={saveSettings}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notifications Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="text-slate-400" size={20} />
                  Notifications
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Email Alerts</h3>
                    <p className="text-xs text-slate-500 mt-1">Receive important updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notifications.emailAlerts} onChange={() => setNotifications({...notifications, emailAlerts: !notifications.emailAlerts})} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Push Notifications</h3>
                    <p className="text-xs text-slate-500 mt-1">Get desktop alerts for direct messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notifications.pushNotifications} onChange={() => setNotifications({...notifications, pushNotifications: !notifications.pushNotifications})} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Weekly Digest</h3>
                    <p className="text-xs text-slate-500 mt-1">A weekly email summarizing team activity</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={notifications.weeklyDigest} onChange={() => setNotifications({...notifications, weeklyDigest: !notifications.weeklyDigest})} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Appearance & Preference */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Palette className="text-slate-400" size={20} />
                  Appearance & Preferences
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Theme</label>
                  <select 
                    className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-600 outline-none bg-slate-50"
                    value={appearance.theme}
                    onChange={(e) => setAppearance({...appearance, theme: e.target.value})}
                  >
                    <option value="Light">Light (Default)</option>
                    <option value="Dark">Dark Mode</option>
                    <option value="System">System Default</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Compact Mode</h3>
                    <p className="text-xs text-slate-500 mt-1">Reduce spacing in tables and lists</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={appearance.compactMode} onChange={() => setAppearance({...appearance, compactMode: !appearance.compactMode})} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                    <Globe className="text-slate-400" size={16} />
                    Language
                  </h3>
                  <select className="w-full rounded-lg border-slate-300 border p-2.5 text-sm bg-slate-50 outline-none">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="md:col-span-2 bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex gap-4">
              <Shield className="text-indigo-600 shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-indigo-900">Security & Privacy</h3>
                <p className="text-sm text-indigo-700 mt-1">
                  Your password and core identity settings are managed centrally. To change your password or security questions, please contact your HR administrator or IT department.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
