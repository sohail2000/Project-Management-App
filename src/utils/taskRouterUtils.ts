import type { PrismaClient } from "@prisma/client";

export const verifyUserAccessToProject = async (
    projectId: string,
    userId: string | undefined,
    db: PrismaClient
): Promise<[boolean, string | undefined]> => {
    if (userId === undefined) return [false, `Invalid userId`]
    const project = await db.project.findFirst({
        where: {
            id: projectId,
            OR: [
                {
                    ownerId: userId,
                },
                {
                    members: {
                        some: {
                            id: userId,
                        },
                    },
                }
            ],
        },
    });

    if (!project) {
        return [false, `User does not have access to project with id:${projectId}`];
    }

    return [true, undefined];
};

export const verifyProjectAccessUsingTaskId = async (
    taskId: string,
    userId: string | undefined,
    db: PrismaClient
): Promise<[boolean, string | undefined]> => {
    if (userId === undefined) return [false, `Invalid userId`];

    const task = await db.task.findUnique({
        where: { id: taskId },
        select: { projectId: true },
    });

    if (!task?.projectId) {
        return [false, `Task with id: ${taskId} does not exist or has no associated project`];
    }

    return verifyUserAccessToProject(task.projectId, userId, db);
};
