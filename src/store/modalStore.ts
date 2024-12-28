import { create } from "zustand";
import { ExtentedTask } from "~/types/types";

export type State = {
    isDeleteModalOpen: boolean;
    isAddModalOpen: boolean;
    taskToEdit: ExtentedTask | null;
    taskToDelete: ExtentedTask | null;
};

export type Actions = {
    setIsDeleteModalOpen: (open: boolean) => void;
    setIsAddModalOpen: (open: boolean) => void;
    setTaskToEdit: (task: ExtentedTask | null) => void;
    setTaskToDelete: (task: ExtentedTask | null) => void;
};
export const useModalStore = create<State & Actions>((set) => ({
    isDeleteModalOpen: false,
    isAddModalOpen: false,
    taskToEdit: null,
    taskToDelete: null,

    setIsDeleteModalOpen: (open) => set({ isDeleteModalOpen: open }),
    setIsAddModalOpen: (open) => set({ isAddModalOpen: open }),
    setTaskToEdit: (task) => set({ taskToEdit: task }),
    setTaskToDelete: (task) => set({ taskToDelete: task }),
}));
