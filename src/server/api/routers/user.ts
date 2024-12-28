import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  searchByName: protectedProcedure
    .input(z.object({
      searchTerm: z.string(),
      limit: z.number().min(1).max(20).optional().default(10),
    }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        where: {
          name: {
            contains: input.searchTerm,
            mode: 'insensitive',
          },
        },
        select: {
          id: true,
          name: true,
        },
        take: input.limit,
      });

      return users;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});