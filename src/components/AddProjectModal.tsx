"use client";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { useModalStore } from "~/store/modalStore";

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

import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import type { CUser } from "~/types/types";
import { z } from "zod";
import SearchProjectBox from "./SearchProjectBox";

// Define the schema for project creation/update
const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  members: z.array(z.string()).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const AddProjectModal = () => {
  const { isProjectModalOpen, setIsProjectModalOpen: openProjectModal, projectToEdit } = useModalStore();
  const { toast } = useToast();
  const utils = api.useUtils();

  const [selectedMembers, setSelectedMembers] = useState<CUser[]>([]);

  const createProject = api.project.createProject.useMutation({
    onSuccess: async () => {
      toast({
        title: "Project created successfully",
        variant: "default",
        className: "bg-green-400 text-black",
        duration: 2000,
      });
      await utils.project.getAllProjects.invalidate();
      handleModalClose();
    },
    onError: (error) => {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
    },
  });

  const updateProject = api.project.updateProject.useMutation({
    onSuccess: async () => {
      toast({
        title: "Project updated successfully",
        variant: "default",
        className: "bg-green-400 text-black",
        duration: 2000,
      });
      await utils.project.getAllProjects.invalidate();
      handleModalClose();
    },
    onError: (error) => {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
    },
  });

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: projectToEdit?.name ?? "",
      description: projectToEdit?.description ?? "",
      members: projectToEdit?.members?.map(m => m.id) ?? [],
    },
  });

  useEffect(() => {
    if (projectToEdit) {
      setSelectedMembers(projectToEdit.members);
      form.reset({
        name: projectToEdit.name,
        description: projectToEdit.description ?? "",
        members: projectToEdit.members.map(m => m.id),
      });
    }
  }, [projectToEdit, form]);

  const handleModalClose = () => {
    form.reset();
    openProjectModal(false);
    setSelectedMembers([]);
  };

  const onSubmit: SubmitHandler<ProjectFormData> = async (values) => {
    try {
      if (projectToEdit) {
        const updatedMemberIds = selectedMembers.map(u => u.id).sort();
        const updatedProject = {
          projectId: projectToEdit.id,
          ...(values.name !== projectToEdit.name && { name: values.name }),
          ...(values.description !== projectToEdit.description && { description: values.description }),
          ...(JSON.stringify(updatedMemberIds) !== JSON.stringify(projectToEdit.members.map(u => u.id).sort()) && { members: updatedMemberIds })
        };

        await updateProject.mutateAsync(updatedProject);
        return;
      }

      await createProject.mutateAsync({
        ...values,
        members: selectedMembers.map((user) => user.id),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={isProjectModalOpen} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{projectToEdit ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Project Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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

            {/* Project Members */}
            <FormField
              control={form.control}
              name="members"
              render={() => (
                <FormItem>
                  <FormLabel>Project Members</FormLabel>
                  <FormControl>
                    <SearchProjectBox
                      onSelect={setSelectedMembers}
                      selectedUsers={selectedMembers}
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
                disabled={createProject.isLoading || updateProject.isLoading || form.formState.isSubmitting}
                className="w-full sm:w-auto"
              >
                {(createProject.isLoading || updateProject.isLoading) ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {projectToEdit ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  projectToEdit ? "Update Project" : "Create Project"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;