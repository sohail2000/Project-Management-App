import { ClockIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { format } from "date-fns";
import type { ProjectsType } from "~/types/types";



const ProjectList = ({ projects }: { projects: ProjectsType[] }) => (
    <div className="space-y-4">
        {projects.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No projects found</p>
        ) : (
            projects.map((project) => (
                <Card key={project.id}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{project.name}</p>
                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    Created {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))
        )}
    </div>
);

export default ProjectList