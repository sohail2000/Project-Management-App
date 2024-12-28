"use client";


import { Button } from "./ui/button";
import { useToast } from "~/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { useModalStore } from "~/store/modalStore";
import { api } from "~/utils/api";

const DeleteModal = () => {

  const { toast } = useToast();
  const { taskToDelete, isDeleteModalOpen, setTaskToDelete, setIsDeleteModalOpen } = useModalStore();
  const utils = api.useUtils();

  const handleDeleteModalClose = () => {
    setTaskToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const deleteTask = api.task.deleteTask.useMutation({
    onSuccess: () => {
      toast({
        title: "Task deleted successfully",
        variant: "destructive",
        className: "bg-green-400 text-black",
        duration: 4000,
      });
      utils.task.getAllTask.invalidate();
      handleDeleteModalClose();
    },
    onError: (error) => {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
        duration: 4000,
      });
    },
  });

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTask.mutateAsync({ taskId: taskToDelete.id })
    }
  };

  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={handleDeleteModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this task? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteTask}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;

