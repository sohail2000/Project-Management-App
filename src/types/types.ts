// import type { Task } from "@prisma/client";
import type { RouterOutputs } from "~/utils/api";

export type BoardView = "list" | "kanban";

// cleint user
export type CUser = {
    name: string;
    id: string;
}

// export type ExtentedTask = Task & {
//     assignees: {
//         name: string;
//         id: string;
//     }[];
//     createdBy: {
//         name: string;
//         id: string;
//     };
// }

export type ProjectWithStats = RouterOutputs["project"]["getAllProjects"][0];
export type ExtentedTask = RouterOutputs["task"]["getAllTask"][0];


