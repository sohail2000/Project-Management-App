"use client";

import Header from "./Header";
import Kanban from "./Kanban";
import Sidebar from "./Sidebar";
import Tasklist from "./Tasklist";
import { useDashboardStore } from "~/store/dashboardStore";

export function DashboardComponent() {
  const { boardView } = useDashboardStore();

  return (
    <div className="flex max-sm:flex-col h-screen bg-secondary dark:bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto ">
        <Header />
        {boardView === "list" ? <Tasklist/> : <Kanban />}
      </div>
    </div>
  );
    
}
