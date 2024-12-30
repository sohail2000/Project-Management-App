import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Calendar } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import EditDeleteMenu from "./EditDeleteMenu";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { api } from "~/utils/api";
import LoadingTask from "./LoadingTask";
import type { ExtentedTask } from "~/types/types";
import type { TaskStatus } from "@prisma/client";

const Kanban = () => {
  const { toast } = useToast();
  const utils = api.useUtils();

  const changeTaskStatus = api.task.changeTaskStatus.useMutation({
    onSuccess: async () => {
      toast({
        title: "Task status updated successfully",
        variant: "default",
        className: "bg-green-400 text-black",
        duration: 2000,
      });
      await utils.task.getAllTask.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error updating task status",
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
    },
  });

  const { data: initialTasks, isLoading: taskLoading, error: taskError } =
    api.task.getAllTask.useQuery({
      status: "ALL",
      priority: "ALL",
      sortBy: "none",
      sortOrder: "ASC",
    });

  const [tasks, setTasks] = useState<ExtentedTask[]>(initialTasks ?? []);

  if (taskLoading) return <LoadingTask />;
  if (taskError)
    return <div>{`Error fetching tasks data. Details: ${taskError.message}`}</div>;

  // Function to update task status via API
  const updateTaskStatus = (task: ExtentedTask) => {
    changeTaskStatus.mutate({ taskId: task.id, status: task.status });
  };

  // Drag and drop logic for the Kanban board
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const draggedItemId = result.draggableId;
    const sourceColumn = result.source.droppableId as TaskStatus;
    const destinationColumn = result.destination.droppableId as TaskStatus;

    // If the task is moved within the same column
    if (sourceColumn === destinationColumn) {
      const newTasks = Array.from(tasks);
      const columnTasks = newTasks.filter((task) => task.status === sourceColumn);
      const [movedTask] = columnTasks.splice(result.source.index, 1);

      if (!movedTask) return;

      columnTasks.splice(result.destination.index, 0, movedTask);

      setTasks([
        ...newTasks.filter((task) => task.status !== sourceColumn),
        ...columnTasks,
      ]);
    } else {
      // Task moved to a different column
      const updatedTaskIndex = tasks.findIndex((task) => task.id === draggedItemId);

      if (updatedTaskIndex === -1) return;

      const originalTask = tasks[updatedTaskIndex];

      if (!originalTask) return;

      const updatedTask: ExtentedTask = {
        ...originalTask,
        status: destinationColumn,
      };

      const newTasks = [
        ...tasks.slice(0, updatedTaskIndex),
        updatedTask,
        ...tasks.slice(updatedTaskIndex + 1),
      ];

      setTasks(newTasks);
      updateTaskStatus(updatedTask);
    }
  };

  const STATUSES: TaskStatus[] = ["TODO", "INPROGRESS", "COMPLETED"];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 justify-evenly max-lg:flex-wrap">
        {STATUSES.map((status) => (
          <div key={status} className="dark:bg-secondary bg-gray-200 p-4 rounded-lg w-full">
            <h3 className="font-semibold mb-4">{status}</h3>
            <Droppable droppableId={status}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 min-h-[100px]"
                >
                  {tasks
                    .filter((task) => task.status === status)
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-background p-4 rounded shadow flex justify-between"
                          >
                            <div className="flex flex-col items-start">
                              <Badge className="bg-primary">{task.priority}</Badge>
                              <div className="capitalize">
                                <p className="font-semibold text-lg">{task.title}</p>
                                {task.description && (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 my-1">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1">
                                {task.dueDate && (
                                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {format(task.dueDate, "MMM d, yyyy")}
                                  </div>
                                )}
                              </div>
                              <div className="space-x-1 mt-2">
                                {task.assignees.map((u) => (
                                  <Badge key={`${task.id}-${u.name}`} variant="outline">
                                    {u.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <EditDeleteMenu task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Kanban;