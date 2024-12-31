import type { RouterOutputs } from "~/utils/api";

export type BoardView = "list" | "kanban";

// cleint user
export type CUser = {
    name: string;
    id: string;
}

export type ProjectWithStats = RouterOutputs["project"]["getAllProjects"][number];
export type ExtentedTask = RouterOutputs["task"]["getAllTask"][number];
export type ExtentedProject = RouterOutputs["project"]["getAllProjects"][number];
export type ProjectFromUser = RouterOutputs["user"]["getUserDetails"];

export type ProjectsType = NonNullable<ProjectFromUser>['projects'][number];
export type TaskType = NonNullable<ProjectFromUser>['assignedTasks'][number];

