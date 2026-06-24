import { useEffect, useState } from "react";
import "@/App.css";
import axios from "axios";
import Shell from "@/components/Shell";
import FieldView from "@/components/FieldView";
import Dashboard from "@/components/Dashboard";
import TasksAdmin from "@/components/TasksAdmin";
import Onboarding from "@/components/Onboarding";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
export const apiClient = axios.create({ baseURL: API });

function App() {
  const [view, setView] = useState("field"); // field | dashboard | tasks
  const [role, setRole] = useState(localStorage.getItem("kreteops_role") || "");
  const [crewName, setCrewName] = useState(localStorage.getItem("kreteops_name") || "");
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // ensure seed exists
        let r = await apiClient.get("/jobs");
        if (r.data.length === 0) {
          await apiClient.post("/seed");
          r = await apiClient.get("/jobs");
        }
        setJob(r.data[0]);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleOnboarded = (r, n) => {
    setRole(r);
    setCrewName(n);
    localStorage.setItem("kreteops_role", r);
    localStorage.setItem("kreteops_name", n);
    setView(r === "manager" ? "dashboard" : "field");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090B] text-[#FAFAFA]">
        <div className="text-2xl font-bold uppercase tracking-tight" style={{ fontFamily: "Barlow Condensed" }}>
          Loading KreteOps…
        </div>
      </div>
    );
  }

  if (!role || !crewName) {
    return <Onboarding onDone={handleOnboarded} />;
  }

  return (
    <Shell
      view={view}
      onChangeView={setView}
      role={role}
      crewName={crewName}
      job={job}
      onLogout={() => {
        localStorage.clear();
        setRole("");
        setCrewName("");
      }}
    >
      {view === "field" && <FieldView job={job} crewName={crewName} role={role} />}
      {view === "dashboard" && <Dashboard job={job} />}
      {view === "tasks" && <TasksAdmin job={job} role={role} />}
    </Shell>
  );
}

export default App;
