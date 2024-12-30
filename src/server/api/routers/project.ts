import {
    createTRPCRouter,
    protectedProcedure,
} from "~/server/api/trpc";
import { createProjectInputSchema, updateProjectInputSchema } from "~/schemas/schemas";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@prisma/client";



export const projectRouter = createTRPCRouter({

    getAllProjects: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.db.project.findMany({
                where: {
                    OR: [
                        {
                            ownerId: ctx.session.user.id
                        },
                        {
                            members: {
                                some: {
                                    id: ctx.session.user.id
                                }
                            }
                        }
                    ]
                },
                select: {
                    id: true,
                    name: true
                },
                // include: {
                //     owner: {
                //         select: {
                //             id: true,
                //             name: true
                //         }
                //     },
                //     members: {
                //         select: {
                //             id: true,
                //             name: true
                //         }
                //     },
                //     tasks: {
                //         select: {
                //             id: true,
                //             status: true
                //         }
                //     },
                //     _count: {
                //         select: {
                //             tasks: true
                //         }
                //     }
                // },
                orderBy: {
                    updatedAt: 'desc'
                }
            });
        }),

    createPrject: protectedProcedure
        .input(createProjectInputSchema)
        .mutation(async ({ ctx, input }) => {
            const { name, description, members } = input;

            if (ctx.session.user.id === undefined) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Invalid userId",
                });
            }

            const project = await ctx.db.project.create({
                data: {
                    name,
                    description,
                    ownerId: ctx.session.user.id,
                    members: {
                        connect: members?.map((memberId) => ({ id: memberId })),
                    },
                },
            });

            return project;
        }),

    updateProject: protectedProcedure
        .input(updateProjectInputSchema)
        .mutation(async ({ ctx, input }) => {
            const { projectId, name, description, members } = input;

            // Check if the current user is the owner of the project
            const project = await ctx.db.project.findUnique({
                where: { id: projectId },
                // select: { ownerId: true },
            });

            if (!project) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Project with id: ${projectId} not found`,
                });
            }

            if (project.ownerId !== ctx.session.user.id) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "Only the project owner can update this project",
                });
            }

            const updateData: Prisma.ProjectUpdateInput = {};
            if (name !== project.name) updateData.name = name;
            if (description !== project.description) updateData.description = description;

            const updatedProject = await ctx.db.project.update({
                where: { id: projectId },
                data: {
                    ...updateData,
                    ...(members && {
                        members: {
                            set: members.map((memberId) => ({ id: memberId })),
                        },
                    }),
                },
                include: {
                    members: true,
                },
            });

            return updatedProject;
        })

});