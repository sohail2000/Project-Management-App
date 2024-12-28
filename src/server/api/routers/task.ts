import {
  changeTaskStatusSchema,
  createTaskSchema,
  deleteTaskInputSchema,
  getAllTaskInputSchema,
  updateTaskSchema
} from "~/schemas/schemas";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getAllTask: protectedProcedure
    .input(getAllTaskInputSchema)
    .query(async ({ ctx, input }) => {
      const { status, priority, sortBy, sortOrder } = input;

      const whereClause: any = {};
      if (status !== "ALL") whereClause.status = status;
      if (priority !== "ALL") whereClause.priority = priority;

      const orderByClause =
        sortBy === "none"
          ? undefined
          : {
            [sortBy]: sortOrder.toLowerCase(),
          };

      return ctx.db.task.findMany({
        where: whereClause,
        orderBy: orderByClause,
        include: {
          assignees: {
            select: { id: true, name: true },
          },
          createdBy: {
            select: { id: true, name: true },
          },
        },
      });
    }),

  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
          assignees: {
            connect: input.assigneeIds.map(id => ({ id }))
          },
          createdBy: {
            connect: { id: ctx.session.user.id }
          }
        },
      });
    }),

  changeTaskStatus: protectedProcedure
    .input(changeTaskStatusSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.taskId },
        data: { status: input.status },
      });
    }),

  updateTask: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: {
          id: input.taskId,
          createdById: ctx.session.user.id
        },
        data: {
          ...(input.title && { title: input.title }),
          ...(input.description && { description: input.description }),
          ...(input.status && { status: input.status }),
          ...(input.priority && { priority: input.priority }),
          ...(input.dueDate && { dueDate: input.dueDate }),
          ...(input.assigneeIds && input.assigneeIds.length > 0 && {
            assignees: {
              set: [],
              connect: input.assigneeIds.map(id => ({ id }))
            }
          })
        }
      });
    }),

  deleteTask: protectedProcedure
    .input(deleteTaskInputSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if the task belongs to the user
      const task = await ctx.db.task.findUnique({
        where: { id: input.taskId },
        select: { createdById: true }
      });

      if (!task || task.createdById !== ctx.session.user.id) {
        throw new Error("Unauthorized or task not found.");
      }

      // Delete the task
      return ctx.db.task.delete({
        where: { id: input.taskId }
      });
    })
});
