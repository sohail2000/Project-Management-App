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
});
