import React from "react";
import { apiClient } from "@/App";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { AlertTriangle, CheckCircle2, Camera, Activity, TrendingUp, Users } from "lucide-react";

export default function Dashboard({ job }) {
  const [data, setData] = React.useState(null);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const load = async () => {
      if (!job) return;
      const r = await apiClient.get(`/jobs/${job.id}/dashboard`);
      setData(r.data);
    };
    load();
    const id = setInterval(() => setTick(t => t + 1), 8000);
    return () => clearInterval(id);
  }, [job, tick]);

  if (!data) {
    return <div className="text-[#A1A1AA] text-sm">Loading dashboard…</div>;
  }

  const { totals, status_counts, daily_trend, validation_stats, category_breakdown, rework_tasks, active_crew } = data;

  const ratio = totals.ratio;
  const ratioTone = ratio >= 1 ? "text-[#CCFF00]" : ratio >= 0.85 ? "text-[#F59E0B]" : "text-[#FF5F15]";

  const catData = Object.entries(category_breakdown).map(([k, v]) => ({
    name: k,
    est: v.est_hours,
    actual: v.actual_hours,
  })).filter(d => d.est > 0 || d.actual > 0);

  const statusData = [
    { name: "Done", value: status_counts.validated, color: "#CCFF00" },
    { name: "Active", value: status_counts.in_progress, color: "#3B82F6" },
    { name: "Rework", value: status_counts.rework, color: "#FF5F15" },
    { name: "Queued", value: status_counts.not_started, color: "#52525B" },
  ];

  return (
    <div data-testid="dashboard-view" className="space-y-6">
      {/* Hero metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <MetricTile testid="metric-ratio" label="Earned / Spent Ratio" value={ratio.toFixed(2)} unit="" tone={ratioTone} icon={<TrendingUp className="w-4 h-4" />} />
        <MetricTile testid="metric-earned" label="Earned Hours" value={totals.earned_hours} unit="hrs" icon={<CheckCircle2 className="w-4 h-4" />} />
        <MetricTile testid="metric-actual" label="Actual Hours" value={totals.actual_hours} unit="hrs" icon={<Activity className="w-4 h-4" />} />
        <MetricTile testid="metric-variance" label="Variance" value={totals.variance_hours} unit="hrs" tone={totals.variance_hours >= 0 ? "text-[#CCFF00]" : "text-[#FF5F15]"} icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      {/* Status + Validation row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status pie -> using horizontal bars instead, more readable */}
        <div className="k-surface p-5 lg:col-span-1">
          <SectionTitle>Task Status</SectionTitle>
          <div className="space-y-3 mt-4">
            {statusData.map((s) => {
              const total = statusData.reduce((a, b) => a + b.value, 0) || 1;
              const pct = (s.value / total) * 100;
              return (
                <div key={s.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="uppercase tracking-widest text-[#A1A1AA]">{s.name}</span>
                    <span className="font-mono font-bold">{s.value}</span>
                  </div>
                  <div className="h-3 bg-[#27272A]"><div style={{ width: `${pct}%`, background: s.color, height: "100%" }} /></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Validation stats */}
        <div className="k-surface p-5 lg:col-span-2">
          <SectionTitle>Validation Layer · Live</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <MiniStat label="Checks Run" value={validation_stats.total} />
            <MiniStat label="Pass Rate" value={`${Math.round(validation_stats.pass_rate * 100)}%`} tone={validation_stats.pass_rate >= 0.95 ? "text-[#CCFF00]" : "text-[#F59E0B]"} />
            <MiniStat label="Failed" value={validation_stats.failed} tone={validation_stats.failed > 0 ? "text-[#FF5F15]" : ""} icon={<AlertTriangle className="w-3 h-3" />} />
            <MiniStat label="Photos Logged" value={validation_stats.photos_captured} icon={<Camera className="w-3 h-3" />} />
          </div>
        </div>
      </div>

      {/* Daily trend */}
      <div className="k-surface p-5">
        <SectionTitle>7-Day Production Trend</SectionTitle>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis dataKey="day_label" stroke="#71717A" />
              <YAxis stroke="#71717A" />
              <Tooltip contentStyle={{ background: "#18181B", border: "1px solid #3F3F46", borderRadius: 2 }} />
              <Line type="monotone" dataKey="hours" stroke="#FF5F15" strokeWidth={3} dot={{ fill: "#FF5F15", r: 4 }} name="Hours" />
              <Line type="monotone" dataKey="qty" stroke="#CCFF00" strokeWidth={3} dot={{ fill: "#CCFF00", r: 4 }} name="Production" />
              <Line type="monotone" dataKey="failed_checks" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6", r: 4 }} name="Failed Checks" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category breakdown */}
      {catData.length > 0 && (
        <div className="k-surface p-5">
          <SectionTitle>Hours by Phase — Est vs Actual</SectionTitle>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                <XAxis dataKey="name" stroke="#71717A" />
                <YAxis stroke="#71717A" />
                <Tooltip contentStyle={{ background: "#18181B", border: "1px solid #3F3F46", borderRadius: 2 }} />
                <Bar dataKey="est" fill="#27272A" name="Estimated" />
                <Bar dataKey="actual" fill="#FF5F15" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Rework + Crew */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="k-surface p-5">
          <SectionTitle><span className="text-[#FF5F15]">▲</span> Active Rework Flags</SectionTitle>
          {rework_tasks.length === 0 ? (
            <div className="text-sm text-[#A1A1AA] mt-4 py-6 text-center border border-dashed border-[#3F3F46]">
              No rework flagged. Crew is clean.
            </div>
          ) : (
            <ul data-testid="rework-list" className="mt-4 space-y-2">
              {rework_tasks.map((t) => (
                <li key={t.id} className="k-surface-2 p-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-display font-bold uppercase truncate">{t.name}</div>
                    <div className="text-xs text-[#A1A1AA] font-mono">{t.category} · {t.course} course</div>
                  </div>
                  <span className="k-pill k-pill-rework">FIX</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="k-surface p-5">
          <SectionTitle><Users className="inline w-4 h-4" /> Crew on Site Today</SectionTitle>
          {active_crew.length === 0 ? (
            <div className="text-sm text-[#A1A1AA] mt-4">No entries logged yet.</div>
          ) : (
            <div className="flex flex-wrap gap-2 mt-4">
              {active_crew.map((c) => (
                <div key={c} className="k-surface-2 px-3 py-2 text-sm font-medium">{c}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#A1A1AA] font-semibold border-b border-[#27272A] pb-2">
      {children}
    </div>
  );
}

function MetricTile({ testid, label, value, unit, tone, icon }) {
  return (
    <div data-testid={testid} className="k-surface k-metric">
      <div className="k-metric-label flex items-center gap-2">{icon}{label}</div>
      <div className={`k-metric-value ${tone || ""}`}>{value}{unit && <span className="k-metric-unit">{unit}</span>}</div>
    </div>
  );
}

function MiniStat({ label, value, tone, icon }) {
  return (
    <div className="border-l-2 border-[#3F3F46] pl-3">
      <div className="text-[10px] uppercase tracking-widest text-[#A1A1AA] flex items-center gap-1">{icon}{label}</div>
      <div className={`font-display font-black text-3xl mt-0.5 ${tone || ""}`}>{value}</div>
    </div>
  );
}
