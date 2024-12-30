import { format } from "date-fns";
import React, { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import EditDeleteMenu from "./EditDeleteMenu";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/utils/api";
import type { TaskStatus } from "@prisma/client";
import { Badge } from "~/components/ui/badge"
import type { getAllTaskInputType } from "~/schemas/schemas";
import LoadingTask from "./LoadingTask";
import { useRouter } from "next/router";



const Tasklist = () => {
  const router = useRouter();
  const { id } = router.query;
  const projectId = Array.isArray(id) ? id[0] : id;
  console.log("project Id from TaskList", projectId);

  const { toast } = useToast();
  const utils = api.useUtils();

  const [filters, setFilters] = useState<getAllTaskInputType>({
    status: "ALL",
    priority: "ALL",
    sortBy: "none",
    sortOrder: "ASC",
  });

  const updateFilters = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const { data: tasks, isLoading: taskLoading, error: taskError } = api.task.getAllTask.useQuery({ projectId, ...filters });

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

  if (taskLoading) return <LoadingTask />

  if (taskError) return <div>{`Error feteching tasks data. Details: ${taskError.message}`}</div>

  return (
    <div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 justify-start">
        {/* status filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => updateFilters("status", value)}
        >
          <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="INPROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* priority filter */}
        <Select
          value={filters.priority}
          onValueChange={(value) => updateFilters("priority", value)}
        >
          <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priorities</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>

        {/* sortBy filter */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilters("sortBy", value)}
        >
          <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Sorting</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="dueDate">Due Date</SelectItem>
          </SelectContent>
        </Select>

        {/* change sorting order */}
        {filters.sortBy !== "none" && (
          <Button
            variant="outline"
            onClick={() => updateFilters("sortOrder", filters.sortOrder === "ASC" ? "DESC" : "ASC")}
          >
            {filters.sortOrder === "ASC" ? "Ascending" : "Descending"}
          </Button>
        )}

        {/* clear filter button */}
        {JSON.stringify(filters) !== JSON.stringify({
          status: "ALL",
          priority: "ALL",
          sortBy: "none",
          sortOrder: "ASC"
        }) && (
            <Button
              variant="outline"
              onClick={() => setFilters({
                status: "ALL",
                priority: "ALL",
                sortBy: "none",
                sortOrder: "ASC"
              })}
            >
              Clear Filters
            </Button>
          )}
      </div>

      {/* Tasks */}
      <div className="py-4 space-y-2">
        {tasks.length == 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
            No tasks found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tasks</TableHead>
                <TableHead className="text-nowrap">Due Date</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignees</TableHead>
                <TableHead className="text-right">Menu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="space-y-2 text-nowrap w-1/2 capitalize">
                    <>
                      <h3 className="font-semibold text-base">{task.title}</h3>
                      {task.description && (
                        <p className="text-xs md:text-s text-gray-500 dark:text-gray-400 mt-1 max-w-[100ch] overflow-hidden overflow-ellipsis whitespace-normal">
                          {task.description}
                        </p>
                      )}
                    </>
                  </TableCell>
                  <TableCell className={`text-nowrap ${!task.dueDate && "text-stone-500"}`}>
                    {task.dueDate ? format(task.dueDate, "MMM d, yyyy") : "No Due Date"}
                  </TableCell>
                  <TableCell className="text-nowrap">{task.priority}</TableCell>
                  <TableCell className="text-nowrap">
                    <Select
                      value={task.status}
                      onValueChange={async (value) => {
                        await changeTaskStatus.mutateAsync({ taskId: task.id, status: value as TaskStatus });

                      }}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="TODO">To Do</SelectItem>
                          <SelectItem value="INPROGRESS">In Progress</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-nowrap">

                    <div className="space-x-1">
                      {task.assignees.length === 0 ? (
                        <Badge variant="outline">No Assignee</Badge>
                      ) : (
                        task.assignees.map((assignee) => (
                          <Badge variant="outline" key={assignee.id}>{assignee.name}</Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <EditDeleteMenu task={task} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell className="text-left text-sm" colSpan={6}>
                  Total Tasks: {tasks.length}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}
      </div>
    </div>
  );
};

export default Tasklist;