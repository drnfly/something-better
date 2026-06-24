import React from "react";
import { LogOut } from "lucide-react";

export default function Shell({ view, onChangeView, role, crewName, job, onLogout, children }) {
  const tabs = role === "manager"
    ? [
        { id: "dashboard", label: "Command" },
        { id: "tasks", label: "Tasks · AI Rules" },
        { id: "field", label: "Field View" },
      ]
    : [
        { id: "field", label: "Field" },
        { id: "dashboard", label: "Dashboard" },
        { id: "tasks", label: "Tasks" },
      ];

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
      {/* Top bar */}
      <header className="border-b border-[#3F3F46] bg-[#09090B]/95 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <div className="font-display font-black text-2xl uppercase text-[#FF5F15]">KreteOps</div>
            <div className="hidden md:block text-[10px] font-mono tracking-widest text-[#A1A1AA]">FIELD-OPS · v1</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs uppercase tracking-widest text-[#A1A1AA]">{role === "manager" ? "Manager" : "Crew"}</div>
              <div className="font-display font-bold uppercase text-sm">{crewName}</div>
            </div>
            <button data-testid="logout-btn" onClick={onLogout} className="k-btn p-3" title="Switch role">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Job banner */}
        {job && (
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 pb-3 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-[#CCFF00] rounded-full k-pulse" />
              <div className="font-display font-bold uppercase text-base md:text-lg">{job.name}</div>
            </div>
            <div className="text-xs font-mono text-[#A1A1AA]">{job.location} · {job.client}</div>
          </div>
        )}

        {/* Tabs */}
        <div className="max-w-[1600px] mx-auto px-2 md:px-4 flex overflow-x-auto">
          {tabs.map((t) => (
            <div
              key={t.id}
              data-testid={`tab-${t.id}`}
              onClick={() => onChangeView(t.id)}
              className={`k-tab ${view === t.id ? "active" : ""}`}
            >
              {t.label}
            </div>
          ))}
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-8">{children}</main>
    </div>
  );
}
