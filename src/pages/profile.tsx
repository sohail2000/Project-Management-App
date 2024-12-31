import React, { useState } from 'react';
import { api } from '~/utils/api';
import {
  UserIcon,
  ClipboardListIcon,
  FolderIcon,
  EditIcon,
  SaveIcon,
  XIcon} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '~/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Skeleton } from '~/components/ui/skeleton';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ScrollArea } from '~/components/ui/scroll-area';
import StatCard from '~/components/profile/StatCard';
import TaskList from '~/components/profile/TaskList';
import ProjectList from '~/components/profile/ProjectList';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const { toast } = useToast();

  const {
    data: userDetails,
    isLoading,
    error,
    refetch
  } = api.user.getUserDetails.useQuery();

  const updateUserMutation = api.user.updateUser.useMutation({
    onSuccess: async () => {
      toast({
        title: "Profile updated",
        description: "Your username has been successfully updated.",
        variant: "default",
      });
      setIsEditing(false);
      await refetch();
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleUpdateUsername = () => {
    if (!newName.trim()) {
      toast({
        title: "Invalid input",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }
    updateUserMutation.mutate({ name: newName.trim() });
  };

  const startEditing = () => {
    setNewName(userDetails?.name ?? '');
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-6">
          <div className="text-destructive text-center">
            <h3 className="text-lg font-semibold">Error Loading Profile</h3>
            <p>Unable to load user details. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10">
                <UserIcon className="h-10 w-10 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="max-w-[200px]"
                    placeholder="Enter new name"
                  />
                  <Button
                    onClick={handleUpdateUsername}
                    disabled={updateUserMutation.isLoading}
                    size="sm"
                    variant="default"
                  >
                    <SaveIcon className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    size="sm"
                    variant="outline"
                  >
                    <XIcon className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{userDetails?.name}</h1>
                  <Button
                    onClick={startEditing}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <p className="text-muted-foreground">
                Member since {format(new Date(userDetails?.createdAt ?? ''), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<ClipboardListIcon className="h-8 w-8 text-primary" />}
          title="Assigned Tasks"
          value={userDetails?.assignedTasks.length ?? 0}
        />
        <StatCard
          icon={<ClipboardListIcon className="h-8 w-8 text-primary" />}
          title="Created Tasks"
          value={userDetails?.createdTasks.length ?? 0}
        />
        <StatCard
          icon={<FolderIcon className="h-8 w-8 text-primary" />}
          title="Projects"
          value={(userDetails?.projects.length ?? 0) + (userDetails?.ownedProjects?.length ?? 0)}
        />
      </div>

      <Tabs defaultValue="assigned" className="space-y-4">
        <TabsList>
          <TabsTrigger value="assigned">Assigned Tasks</TabsTrigger>
          <TabsTrigger value="created">Created Tasks</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="owned">Owned Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <TaskList tasks={userDetails?.assignedTasks ?? []} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="created">
          <Card>
            <CardHeader>
              <CardTitle>Created Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <TaskList tasks={userDetails?.createdTasks ?? []} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <ProjectList projects={userDetails?.projects ?? []} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="owned">
          <Card>
            <CardHeader>
              <CardTitle>Owned Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <ProjectList projects={userDetails?.ownedProjects ?? []} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;