import * as z from "zod";

//getAllTaskInputSchema
export const getAllTaskInputSchema = z.object({
    projectId: z.string().optional(),
    status: z.enum(["TODO", "INPROGRESS", "COMPLETED", "ALL"]).default("ALL"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "ALL"]).default("ALL"),
    sortBy: z.enum(["title", "priority", "dueDate", "none"]).default("none"),
    sortOrder: z.enum(["ASC", "DESC"]).default("ASC"),
});

export type getAllTaskInputType = z.infer<typeof getAllTaskInputSchema>;


//createTaskSchema
export const createTaskSchema = z.object({
    projectId: z.string(),
    title: z.string().min(1, "Title is required").max(50, "Title must be 50 characters or less"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["TODO", "INPROGRESS", "COMPLETED"]).default("TODO"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    dueDate: z.date().nullable().default(null),
    assigneeIds: z.array(z.string()).default([])
});

//updateTaskSchema
export const updateTaskSchema = z.object({
    taskId: z.string().min(1, "taskId is required"),
    title: z.string().min(1, "Title is required").max(50, "Title must be 50 characters or less").optional(),
    description: z.string().min(1, "Description is required").optional(),
    status: z.enum(["TODO", "INPROGRESS", "COMPLETED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    dueDate: z.date().optional(),
    assigneeIds: z.array(z.string()).optional()
});

//changeTaskStatusSchema
export const changeTaskStatusSchema = z.object({
    // projectId: z.string(),
    taskId: z.string().min(1, "Task ID is required"),
    status: z.enum(["TODO", "INPROGRESS", "COMPLETED"]),
})


//addTaskSchema
export const addTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(50, "Title must be 50 characters or less"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["TODO", "INPROGRESS", "COMPLETED"]),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
    dueDate: z.string().optional(),
    assigneeIds: z.array(z.string()).default([]),
});

export type AddTask = z.infer<typeof addTaskSchema>;

//deleteTaskInputSchema
export const deleteTaskInputSchema = z.object({
    taskId: z.string()
})

//searchByNameInputSchema
export const searchByNameInputSchema = z.object({
    searchTerm: z.string(),
    projectId: z.string(),
    limit: z.number().min(1).max(20).optional().default(10),
})

//createProjectInputSchema
export const createProjectInputSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    members: z.array(z.string()).optional(),
});

//updateProjectInputSchema
export const updateProjectInputSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    name: z.string().optional(),
    description: z.string().optional(),
    members: z.array(z.string()).optional(),
});

//updateUserInputSchema
export const updateUserInputSchema = z.object({
    name: z.string(),
  })
