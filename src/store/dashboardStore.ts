import { create } from "zustand";
import type { BoardView } from "~/types/types";

export type State = {
  boardView: BoardView;
  currProjectId: string | undefined;
};

export type Actions = {
  setBoardView: (boardView: BoardView) => void;
  setCurrProjectId: (id: string | undefined) => void;
};
export const useDashboardStore = create<State & Actions>((set) => ({
  boardView: "list",
  currProjectId: undefined,
  setBoardView: (boardView: BoardView) => set({ boardView }),
  setCurrProjectId: (id) => set({ currProjectId: id }),
}));
