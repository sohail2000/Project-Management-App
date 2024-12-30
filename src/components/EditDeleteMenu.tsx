"use client"

import React from "react";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { useModalStore } from "~/store/modalStore";
import type { ExtentedTask } from "~/types/types";

interface EditDeleteMenuProp {
  task: ExtentedTask
}

const EditDeleteMenu = ({ task }: EditDeleteMenuProp) => {

  const { setIsAddModalOpen, setIsDeleteModalOpen, setTaskToEdit, setTaskToDelete } = useModalStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            setTaskToEdit(task);
            setIsAddModalOpen(true);

          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setTaskToDelete(task);
            setIsDeleteModalOpen(true);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EditDeleteMenu;
