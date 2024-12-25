// import z from "zod"; 

// export const addTaskSchema = z.object({
//     title: z.string().min(1, "Title is required"),
//     description: z.string().min(1, "Description is required"),
//     status: z.enum(["TODO", "INPROGRESS", "COMPLETED"]).default("TODO"),
//     priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
//     deadline: z.date(),
//     assigneeIds: z.array(z.string())
//   });
  
//   export type AddTask = z.infer<typeof addTaskSchema>;