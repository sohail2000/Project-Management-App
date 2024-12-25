"use client";

import Header from "./Header";
import Kanban from "./Kanban";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import Tasklist from "./Tasklist";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useDashboardStore } from "~/store/dashboardStore";

export function DashboardComponent() {
  const { boardView } = useDashboardStore();
  // const sessionData = useSession();
  // const router = useRouter();
  // if(!sessionData) return null;
 

  


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
