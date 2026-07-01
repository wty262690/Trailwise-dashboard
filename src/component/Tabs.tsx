import {
  BookOpen,
  LayoutDashboard,
  Route,
} from "lucide-react";
const icon18 = { size: 18, strokeWidth: 1.75 };

export default function Tabs() {

  return (
    <div className="tabs">
    <button className={activePanel === "overview" ? "active" : ""} onClick={() => jumpTo("overview")}>
        <LayoutDashboard {...icon18} aria-hidden="true" />
        <span>Overview</span>
    </button>
    <button className={activePanel === "trace" ? "active" : ""} onClick={() => jumpTo("trace")}>
        <Route {...icon18} aria-hidden="true" />
        <span>Trace</span>
    </button>
    <button className={activePanel === "runbook" ? "active" : ""} onClick={() => jumpTo("runbook")}>
        <BookOpen {...icon18} aria-hidden="true" />
        <span>Runbook</span>
    </button>
    </div>
  );
}