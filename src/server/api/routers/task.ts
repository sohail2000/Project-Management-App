import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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
} from "~/server/api/trpc";
import { verifyProjectAccessUsingTaskId, verifyUserAccessToProject } from "~/utils/taskRouterUtils";

export const taskRouter = createTRPCRouter({

  getAllTask: protectedProcedure
    .input(getAllTaskInputSchema)
    .query(async ({ ctx, input }) => {
      const { projectId, status, priority, sortBy, sortOrder } = input;

      const whereClause: Prisma.TaskWhereInput = {};
      const orderByClause =
        sortBy === "none"
          ? undefined
          : {
            [sortBy]: sortOrder.toLowerCase(),
          };


      if (projectId) {
        const [hasAccess, reason] = await verifyUserAccessToProject(
          projectId,
          ctx.session.user.id,
          ctx.db
        );

        if (!hasAccess) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: reason ?? "Access denied",
          });
        }

        whereClause.projectId = projectId;
      } else {

        whereClause.OR = [
          { createdById: ctx.session.user.id },
          { assignees: { some: { id: ctx.session.user.id } } },
        ];
      }


      if (status !== "ALL") whereClause.status = status;
      if (priority !== "ALL") whereClause.priority = priority;


      const tasks = await ctx.db.task.findMany({
        where: whereClause,
        orderBy: orderByClause,
        include: {
          assignees: {
            select: { id: true, name: true },
          },
          createdBy: {
            select: { id: true, name: true },
          },
          project: projectId
            ? {
              select: { id: true, name: true },
            }
            : undefined,
        },
      });

      return tasks;
    }),

  createTask: protectedProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {

      const [hasAccess, reason] = await verifyUserAccessToProject(
        input.projectId,
        ctx.session.user.id,
        ctx.db
      );

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: reason ?? "Access denied",
        });
      }

      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
          project: {
            connect: { id: input.projectId }
          },
          assignees: {
            connect: input.assigneeIds.map(id => ({ id }))
          },
          createdBy: {
            connect: { id: ctx.session.user.id }
          }
        },
        include: {
          project: true,
          assignees: true,
          createdBy: true
        }
      });
    }),

  changeTaskStatus: protectedProcedure
    .input(changeTaskStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const [hasAccess, reason] = await verifyProjectAccessUsingTaskId(
        input.taskId,
        ctx.session.user.id,
        ctx.db
      );

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: reason ?? "Access denied",
        });
      }

      return ctx.db.task.update({
        where: { id: input.taskId },
        data: { status: input.status },
        include: {
          project: true,
          assignees: true,
          createdBy: true
        }
      });
    }),

  updateTask: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {

      const [hasAccess, reason] = await verifyProjectAccessUsingTaskId(
        input.taskId,
        ctx.session.user.id,
        ctx.db
      );

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: reason ?? "Access denied",
        });
      }

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
      const [hasAccess, reason] = await verifyProjectAccessUsingTaskId(
        input.taskId,
        ctx.session.user.id,
        ctx.db
      );

      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: reason ?? "Access denied",
        });
      }

      return ctx.db.task.delete({
        where: { id: input.taskId }
      });
    })
});
