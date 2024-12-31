import { create } from "zustand";
import type { ExtentedProject, ExtentedTask } from "~/types/types";

export type State = {
    isDeleteModalOpen: boolean;
    isAddModalOpen: boolean;
    taskToEdit: ExtentedTask | null;
    taskToDelete: ExtentedTask | null;
    projectToEdit: ExtentedProject | null;
    isProjectModalOpen: boolean;
};

export type Actions = {
    setIsDeleteModalOpen: (open: boolean) => void;
    setIsAddModalOpen: (open: boolean) => void;
    setTaskToEdit: (task: ExtentedTask | null) => void;
    setTaskToDelete: (task: ExtentedTask | null) => void;
    setIsProjectModalOpen: (isOpen: boolean) => void;
    setProjectToEdit: (projectToEdit: ExtentedProject | null) => void;

};
export const useModalStore = create<State & Actions>((set) => ({
    isDeleteModalOpen: false,
    isAddModalOpen: false,
    taskToEdit: null,
    taskToDelete: null,
    projectToEdit: null,
    isProjectModalOpen: false,

    setIsDeleteModalOpen: (open) => set({ isDeleteModalOpen: open }),
    setIsAddModalOpen: (open) => set({ isAddModalOpen: open }),
    setTaskToEdit: (task) => set({ taskToEdit: task }),
    setTaskToDelete: (task) => set({ taskToDelete: task }),
    setProjectToEdit: (projectToEdit) => set({ projectToEdit }),
    setIsProjectModalOpen: (isProjectModalOpen) => set({ isProjectModalOpen })
}));
