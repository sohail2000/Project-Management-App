import { TaskPriority, TaskStatus, Task } from "@prisma/client";

// export type TaskStatus = "To Do" | "In Progress" | "Completed";
// export type TaskPriority = "Low" | "Medium" | "High";
export type BoardView = "list" | "kanban";

export type SortBy = "title" | "priority" | "dueDate" | "none"
export type PriorityFilter = TaskPriority | "ALL"
export type StatusFilter = TaskStatus | "ALL"
export type SortOrder = "ASC" | "DESC"

// export type User = {
//   name: string;
//   email: string;
//   token: string;
// };

// export type Task = {
//   _id: string;
//   title: string;
//   description?: string;
//   status: TaskStatus;
//   priority: TaskPriority;
//   dueDate?: Date;
// };

