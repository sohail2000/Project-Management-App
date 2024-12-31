"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/utils/api";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { ProjectWithStats } from "~/types/types";

export function SelectProjectBox() {
  const router = useRouter();
  const { id } = router.query;
  const projectId = Array.isArray(id) ? id[0] : id;

  const { data: projects, isLoading, isError, error } = api.project.getAllProjects.useQuery();

  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectWithStats | undefined>(undefined);

  // Set initial selected project when data is available
  useEffect(() => {
    if (projects && projectId) {
      const currProject = projects.find((p) => p.id === projectId);
      setSelectedProject(currProject);
    }
  }, [projects, projectId]);

  function handleOpenChange(open: boolean) {
    if (!(isLoading && isError)) {
      setOpen(open);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {isLoading ? (
            "Loading projects..."
          ) : isError ? (
            <span>Error loading projects: {error.message}</span>
          ) : (
            selectedProject
              ? selectedProject.name
              : "Select a project..."
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search project..." className="h-9" />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              {projects?.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={async () => {
                    if (selectedProject?.id === project.id) {
                      await router.push(`/project`);
                      setSelectedProject(undefined);
                    } else {
                      setSelectedProject(project);
                      await router.push(`/project/${project.id}`);
                    }
                    setOpen(false);
                  }}
                >
                  {project.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedProject?.id === project.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
