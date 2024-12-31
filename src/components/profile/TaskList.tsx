import { ClockIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import type { TaskType } from "~/types/types";

const TaskList = ({ tasks }: { tasks: TaskType[] }) => (
    <div className="space-y-4">
        {tasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No tasks found</p>
        ) : (
            tasks.map((task) => (
                <Card key={task.id}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-muted-foreground flex items-center mt-1">
                                    <ClockIcon className="h-4 w-4 mr-1" />
                                    {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                                </p>
                            </div>
                            <Badge variant={
                                task.status === 'COMPLETED'
                                    ? 'default'
                                    : task.status === 'INPROGRESS'
                                        ? 'secondary'
                                        : 'outline'
                            }>
                                {task.status}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            ))
        )}
    </div>
);

export default TaskList