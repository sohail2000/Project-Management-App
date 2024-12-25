import { format } from "date-fns";
import React, { useState } from "react";
import { useToast } from "~/hooks/use-toast";
import EditDeleteMenu from "./EditDeleteMenu";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { api } from "~/utils/api";
import { Task, TaskPriority, TaskStatus } from "@prisma/client";
import { PriorityFilter, SortBy, SortOrder, StatusFilter } from "~/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

import { Badge } from "~/components/ui/badge"



const Tasklist = () => {
  const { toast } = useToast();
  const { data: tasks, isLoading: taskLoading, error: taskError } = api.task.getAllTask.useQuery();
  const [sortOrder, setSortOrder] = useState<SortOrder>("ASC");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("none");

  if (taskLoading) return <div>Loading tasks...🚚 🚚</div>
  if (taskError) return <div>{`Error Loading Tasks. Details: ${taskError}`}</div>

  const filteredTasks = (tasks ?? []).filter(
    (task) =>
      (statusFilter === "ALL" || task.status === statusFilter) &&
      (priorityFilter === "ALL" || task.priority === priorityFilter)
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "title")
      return sortOrder === "ASC"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);

    if (sortBy === "priority") {
      const priorityOrder = { LOW: 0, MEDIUM: 1, HIGH: 2 };
      return sortOrder === "ASC"
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (sortBy === "dueDate") {
      if (!a.dueDate) return sortOrder === "ASC" ? 1 : -1;
      if (!b.dueDate) return sortOrder === "ASC" ? -1 : 1;

      return sortOrder === "ASC"
        ? a.dueDate.getTime() - b.dueDate.getTime()
        : b.dueDate.getTime() - a.dueDate.getTime();
    }

    return 0;
  });

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-4 justify-start">
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as TaskStatus | "ALL")}
        >
          <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="To Do">To Do</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={priorityFilter}
          onValueChange={(value) => setPriorityFilter(value as TaskPriority | "ALL")}
        >
          <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as SortBy)}
        >
          <SelectTrigger className="w-fit px-4 bg-background dark:bg-secondary">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Sorting</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="deadline">Due Date</SelectItem>
          </SelectContent>
        </Select>
        {sortBy !== "none" && (
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")}
          >
            {sortOrder === "ASC" ? "Ascending" : "Descending"}
          </Button>
        )}
      </div>

      {/* Tasks */}
      <div className="py-4 space-y-2">
        {sortedTasks.length == 0 ? (
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
              {sortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="space-y-2 text-nowrap w-1/2 capitalize">
                    <div>
                      <h3 className="font-semibold text-base">{task.title}</h3>
                      {task.description && (
                        <p className="text-xs md:text-s text-gray-500 dark:text-gray-400 mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={`text-nowrap ${!task.dueDate && "text-stone-500"}`}>
                    {task.dueDate ? format(task.dueDate, "MMM d, yyyy") : "No Due Date"}
                  </TableCell>
                  <TableCell className="text-nowrap">{task.priority}</TableCell>
                  <TableCell className="text-nowrap">
                    <Select
                      value={task.status}
                      onValueChange={async (value) => {
                        console.log(task.title, "onChangeTriggered- newvalue -", value);
                        toast({
                          title: "Task Updated",
                          variant: "default",
                          className: "bg-green-400 text-black",
                          duration: 2000,
                        });
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

                    {/* Assignee Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        {task.assignees.length === 0 ? (
                          <Badge variant="outline">No Assignee</Badge>
                        ) : task.assignees.length > 1 ? (
                          <>
                            <Badge variant="outline">{task.assignees[0]?.name}</Badge>
                            <Badge variant="outline">{`${task.assignees.length - 1} more...`}</Badge>
                          </>
                        ) : (
                          <Badge variant="outline">{task.assignees[0]?.name}</Badge>
                        )}


                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Assignees</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {task.assignees.map((assignee) => (
                          <DropdownMenuItem>
                            {assignee.name ?? "Unknown"}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>


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
                  Total Tasks: {sortedTasks.length}
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