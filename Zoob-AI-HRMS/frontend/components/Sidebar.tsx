"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UserCircle2,
  Users,
  Wallet2,
} from "lucide-react";

interface SidebarProps {
  role: string;
  onClose?: () => void;
}

export default function Sidebar({ role, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", href: `/${role}/dashboard`, icon: LayoutDashboard, roles: ["admin", "hr", "manager", "employee"] },
    { name: "Employees", href: "/employees", icon: Users, roles: ["admin", "hr"] },
    { name: "Attendance", href: "/attendance", icon: CalendarDays, roles: ["admin", "hr", "manager", "employee"] },
    { name: "Leave", href: "/leave", icon: ShieldCheck, roles: ["admin", "hr", "manager", "employee"] },
    { name: "Payroll", href: "/payroll", icon: Wallet2, roles: ["admin", "hr"] },
    { name: "Documents", href: "/documents", icon: FileText, roles: ["admin", "hr"] },
    { name: "Profile", href: "/profile", icon: UserCircle2, roles: ["admin", "hr", "manager", "employee"] },
    { name: "Settings", href: "/settings", icon: Settings, roles: ["admin", "hr", "manager", "employee"] },
  ];

  const filteredItems = menuItems.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="fixed left-0 top-0 z-40 min-h-screen w-64 border-r border-slate-800 bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-600/20 p-2 text-indigo-400">
            <BriefcaseBusiness size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Zoob HRMS</h1>
            <p className="text-sm text-slate-400">People-first operations</p>
          </div>
        </div>
      </div>

      <nav className="px-4 py-5">
        <ul className="space-y-1.5">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/40"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold">
            {role.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold capitalize">{role}</div>
            <div className="text-xs text-slate-400">Signed in</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
