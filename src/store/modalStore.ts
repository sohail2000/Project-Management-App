import { create } from "zustand";

export type State = {
    isDeleteModalOpen: boolean;
    isAddModalOpen: boolean;
};

export type Actions = {
    toggleDeleteModal: () => void;
    toggleAddModal: () => void;
};
export const useModalStore = create<State & Actions>((set) => ({
    isDeleteModalOpen: false,
    isAddModalOpen: false,

    toggleDeleteModal: () => { set((state) => ({ isDeleteModalOpen: !state.isDeleteModalOpen })) },
    toggleAddModal: () => set((state) => ({ isAddModalOpen: !state.isAddModalOpen })),
}));
