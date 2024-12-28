import { TaskPriority, TaskStatus, Task, User } from "@prisma/client";

export type BoardView = "list" | "kanban";

// export type SortBy = "title" | "priority" | "dueDate" | "none"
// export type PriorityFilter = TaskPriority | "ALL"
// export type StatusFilter = TaskStatus | "ALL"
// export type SortOrder = "ASC" | "DESC"

// cleint user
export type CUser = Omit<User, "password">

export type ExtentedTask = Task & {
    assignees: {
        name: string;
        id: string;
    }[];
    createdBy: {
        name: string;
        id: string;
    };
}



