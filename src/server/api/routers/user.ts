import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { searchByNameInputSchema, updateUserInputSchema } from "~/schemas/schemas";

export const userRouter = createTRPCRouter({

  searchByName: protectedProcedure
    .input(searchByNameInputSchema)
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        where: {
          AND: [
            {
              name: {
                contains: input.searchTerm,
                mode: 'insensitive',
              }
            },
            {
              projects: {
                some: {
                  id: input.projectId
                }
              }
            }
          ]
        },
        select: {
          id: true,
          name: true,
        },
        take: input.limit,
      });

      return users;
    }),


  updateUser: protectedProcedure
    .input(updateUserInputSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: { name: input.name },
        select: {
          id: true,
          name: true,
        },
      });

      return updatedUser
    }),


  getUserDetails: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const userDetails = await ctx.db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          assignedTasks: {
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true,
            },
          },
          createdTasks: {
            select: {
              id: true,
              title: true,
              status: true,
              createdAt: true,
            },
          },
          projects: {
            select: {
              id: true,
              name: true,
              createdAt: true,
            },
          },
          ownedProjects: {
            select: {
              id: true,
              name: true,
              createdAt: true,
            },
          }
        },
      });

      return userDetails;
    }),
  getUserStats: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const totalAssignedTasks = await ctx.db.task.count({
        where: {
          assignees: {
            some: {
              id: userId,
            },
          },
        },
      });

      const totalCreatedTasks = await ctx.db.task.count({
        where: {
          createdById: userId,
        },
      });

      const totalProjects = await ctx.db.project.count({
        where: {
          members: {
            some: {
              id: userId,
            },
          },
        },
      });

      return {
        totalAssignedTasks,
        totalCreatedTasks,
        totalProjects,
      };
    }),
});
