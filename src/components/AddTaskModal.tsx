"use client";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { useModalStore } from "~/store/modalStore";
import SearchBox from "./SearchBox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import type { CUser } from "~/types/types";
import { useRouter } from "next/router";
import { addTaskSchema, type AddTask } from "~/schemas/schemas";

const AddTaskModal = () => {
  const router = useRouter();
  const { id } = router.query;
  const projectId = Array.isArray(id) ? id[0] : id;

  const { isAddModalOpen, setIsAddModalOpen: openAddModal, taskToEdit } = useModalStore();
  const { toast } = useToast();
  const utils = api.useUtils();

  const [selectedAssignees, setSelectedAssignees] = useState<CUser[]>([]);

  const createTask = api.task.createTask.useMutation({
    onSuccess: async () => {
      toast({
        title: "Task added successfully",
        variant: "default",
        className: "bg-green-400 text-black",
        duration: 2000,
      });
      await utils.task.getAllTask.invalidate();
      handleAddModalClose();
    },
    onError: (error) => {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
    },
  });

  const updateTask = api.task.updateTask.useMutation({
    onSuccess: async () => {
      toast({
        title: "Task updated successfully",
        variant: "default",
        className: "bg-green-400 text-black",
        duration: 2000,
      });
      await utils.task.getAllTask.invalidate();
      handleAddModalClose();
    },
    onError: (error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
    },
  });

  const form = useForm<AddTask>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: taskToEdit?.title ?? "",
      description: taskToEdit?.description ?? "",
      status: taskToEdit?.status ?? "TODO",
      priority: taskToEdit?.priority ?? "MEDIUM",
      dueDate: taskToEdit?.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : "",
      assigneeIds: taskToEdit?.assignees?.map(a => a.id) ?? [],
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      setSelectedAssignees(taskToEdit.assignees);
      form.reset({
        title: taskToEdit.title,
        description: taskToEdit.description ?? "",
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : "",
        assigneeIds: taskToEdit.assignees.map(a => a.id),
      });
    }
  }, [taskToEdit, form]);

  const handleAddModalClose = () => {
    form.reset();
    openAddModal(false);
    setSelectedAssignees([]);
  };

  const onSubmit: SubmitHandler<AddTask> = async (values) => {
    try {
      if (taskToEdit) {
        const updatedDueDate = values.dueDate ? new Date(values.dueDate) : null;
        const updatedAssigneeIds = selectedAssignees.map(u => u.id).sort();
        const updatedTask = {
          taskId: taskToEdit.id,
          ...(values.title !== taskToEdit.title && { title: values.title }),
          ...(values.description !== taskToEdit.description && { description: values.description }),
          ...(values.status !== taskToEdit.status && { status: values.status }),
          ...(values.priority !== taskToEdit.priority && { priority: values.priority }),
          ...(updatedDueDate && updatedDueDate !== taskToEdit.dueDate && { dueDate: updatedDueDate }),
          ...(JSON.stringify(updatedAssigneeIds) !== JSON.stringify(taskToEdit.assignees.map(u => u.id).sort()) && { assigneeIds: updatedAssigneeIds })
        };

        await updateTask.mutateAsync(updatedTask);
        return;
      }
      await createTask.mutateAsync({
        ...values,
        dueDate: values.dueDate ? new Date(values.dueDate) : null,
        assigneeIds: selectedAssignees.map((user) => user.id),
        projectId: projectId ?? ''
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };



  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleAddModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> {taskToEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TODO">To Do</SelectItem>
                      <SelectItem value="INPROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Priority Field */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date Field */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Assign Users */}
            <FormField
              control={form.control}
              name="assigneeIds"
              render={() => (
                <FormItem>
                  <FormLabel>Assign Users</FormLabel>
                  <FormControl>
                    <SearchBox
                      onSelect={setSelectedAssignees}
                      selectedUsers={selectedAssignees}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <DialogFooter>
              <Button
                type="submit"
                disabled={createTask.isLoading || form.formState.isSubmitting}
                className="w-full sm:w-auto"
              >
                {createTask.isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Adding...
                  </span>
                ) : (
                  taskToEdit ? "Update Task" : "Add Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
