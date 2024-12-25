import { z } from "zod";
// import { addTaskSchema } from "~/schemas/addTaskSchema";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // create: protectedProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.post.create({
  //       data: {
  //         name: input.name,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });
  //   }),

  // getLatest: protectedProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //     where: { createdBy: { id: ctx.session.user.id } },
  //   });
  // }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  // tasks related to users only -
  // getAllTask: protectedProcedure.query(async ({ ctx }) => {
  //   return ctx.db.task.findMany({
  //     where: {
  //       OR: [
  //         // Get tasks where user is an assignee
  //         { assignees: { some: { id: ctx.session.user.id } } },
  //         // Get tasks created by the user
  //         { createdById: ctx.session.user.id }
  //       ]
  //     },
  //     include: {
  //       assignees: {
  //         select: {
  //           id: true,
  //           name: true,
  //           email: true,
  //           image: true
  //         }
  //       },
  //       createdBy: {
  //         select: {
  //           id: true,
  //           name: true,
  //           email: true,
  //           image: true
  //         }
  //       }
  //     },
  //     orderBy: {
  //       deadline: 'asc'
  //     }
  //   });
  // })

  // get All tasks 
  getAllTask: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.task.findMany(
        {
        include: {
          assignees: {
            select: {
              id: true,
              name: true,
              // image: true,
            }
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              // image: true,
            }
          }
        },
        orderBy: {
          dueDate: 'asc'
        }
      }
    );
    }),
  createTask: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Title is required"),
        status: z.enum(["TODO", "INPROGRESS", "COMPLETED"]).default("TODO"),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
        dueDate: z.date().nullable().default(null),
        assigneeIds: z.array(z.string()).default([])
      })
    )
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
        // include: {
        //   assignees: {
        //     select: {
        //       id: true,
        //       name: true,
        //       image: true,
        //     }
        //   },
        //   createdBy: {
        //     select: {
        //       id: true,
        //       name: true,
        //       image: true,
        //     }
        //   }
        // }
      });
    }),
});
