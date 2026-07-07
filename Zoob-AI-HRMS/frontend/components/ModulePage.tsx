import type { ReactNode } from "react";

interface Stat {
  label: string;
  value: string;
}

interface ModulePageProps {
  title: string;
  description: string;
  stats?: Stat[];
  children?: ReactNode;
  action?: ReactNode;
}

export default function ModulePage({ title, description, stats = [], children, action }: ModulePageProps) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
        {action}
      </div>

      {stats.length > 0 && (
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
