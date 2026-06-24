import React from "react";
import { HardHat, Eye } from "lucide-react";

export default function Onboarding({ onDone }) {
  const [role, setRole] = React.useState("");
  const [name, setName] = React.useState("");

  const go = () => {
    if (!name.trim() || !role) return;
    onDone(role, name.trim());
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-3">
            <div className="text-[#FF5F15] font-display font-black text-5xl md:text-6xl uppercase">PLUMBLINE</div>
            <div className="text-[#A1A1AA] text-xs font-mono tracking-widest">v1.0 · FIELD-OPS</div>
          </div>
          <div className="text-[#FAFAFA] font-display text-xl md:text-2xl uppercase tracking-tight leading-tight">
            Build to the<br/>
            <span className="text-[#CCFF00]">plumbline. Zero rework.</span>
          </div>
          <div className="text-[#A1A1AA] mt-4 max-w-lg leading-relaxed">
            The 4,000-year-old standard of accuracy — now baked into your jobsite.
            Crew validates as they go. Manager sees live truth.
          </div>
        </div>

        {/* Name */}
        <div className="mb-8">
          <label className="block text-xs uppercase tracking-widest text-[#A1A1AA] mb-2 font-semibold">Your Name</label>
          <input
            data-testid="onboard-name-input"
            className="k-input"
            placeholder="e.g. Ryan Cantrell"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
          />
        </div>

        {/* Role */}
        <div className="mb-10">
          <label className="block text-xs uppercase tracking-widest text-[#A1A1AA] mb-3 font-semibold">Choose Your Role</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              data-testid="role-crew-btn"
              onClick={() => setRole("crew")}
              className={`k-surface p-6 text-left transition-all ${role === "crew" ? "border-[#FF5F15] shadow-[inset_0_0_0_1px_#FF5F15]" : "hover:border-zinc-600"}`}
            >
              <HardHat className="w-8 h-8 text-[#FF5F15] mb-3" />
              <div className="font-display font-bold text-2xl uppercase">Field Crew</div>
              <div className="text-sm text-[#A1A1AA] mt-1">Log production. Walk validations. Snap proof.</div>
            </button>
            <button
              data-testid="role-manager-btn"
              onClick={() => setRole("manager")}
              className={`k-surface p-6 text-left transition-all ${role === "manager" ? "border-[#FF5F15] shadow-[inset_0_0_0_1px_#FF5F15]" : "hover:border-zinc-600"}`}
            >
              <Eye className="w-8 h-8 text-[#CCFF00] mb-3" />
              <div className="font-display font-bold text-2xl uppercase">Manager</div>
              <div className="text-sm text-[#A1A1AA] mt-1">Approve rules. Watch ratios. Hunt rework.</div>
            </button>
          </div>
        </div>

        <button
          data-testid="onboard-continue-btn"
          onClick={go}
          disabled={!name.trim() || !role}
          className="k-btn k-btn-primary k-btn-lg w-full"
        >
          Enter Jobsite →
        </button>
      </div>
    </div>
  );
}
