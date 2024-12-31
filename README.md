# Task Management System

A full-stack task management application built with Next.js, tRPC, Prisma, and TypeScript. The system allows users to create projects, manage tasks, and collaborate with team members.

## Features

- **User Authentication**
  - Secure login and registration
  - Protected routes and API endpoints
  - Session management

- **Project Management**
  - Create and edit projects
  - Add project members
  - Project overview with task statistics
  - Role-based access control (Project owner vs members)

- **Task Management**
  - Create, edit, and delete tasks
  - Task status tracking (TODO, INPROGRESS, COMPLETED)
  - Priority levels (LOW, MEDIUM, HIGH)
  - Due date assignment
  - Task assignment to multiple users
  - Task filtering and sorting

## Tech Stack

### Frontend
- Next.js (React framework)
- TailwindCSS for styling
- shadcn/ui components
- React Hook Form for form management
- Zod for schema validation
- Zustand for state management

### Backend
- tRPC for type-safe API
- Prisma as ORM
- PostgreSQL database
- NextAuth.js for authentication

## Project Structure

```
├── src
│   ├── .DS_Store
│   ├── components
│   │   ├── .DS_Store
│   │   ├── AddProjectModal.tsx
│   │   ├── AddTaskModal.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DeleteModal.tsx
│   │   ├── EditDeleteMenu.tsx
│   │   ├── Header.tsx
│   │   ├── Kanban.tsx
│   │   ├── LoadingTask.tsx
│   │   ├── SearchBox.tsx
│   │   ├── SelectProjectBox.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Tasklist.tsx
│   │   ├── form
│   │   ├── profile
│   │   ├── theme-provider.tsx
│   │   └── ui
│   ├── env.js
│   ├── hooks
│   │   ├── use-toast.ts
│   │   └── useDebounce.ts
│   ├── lib
│   │   └── utils.ts
│   ├── middleware.ts
│   ├── pages
│   │   ├── _app.tsx
│   │   ├── api
│   │   ├── index.tsx
│   │   ├── profile.tsx
│   │   ├── project
│   │   └── signin.tsx
│   ├── schemas
│   │   └── schemas.ts
│   ├── server
│   │   ├── api
│   │   ├── auth.ts
│   │   └── db.ts
│   ├── store
│   │   ├── dashboardStore.ts
│   │   └── modalStore.ts
│   ├── styles
│   │   └── globals.css
│   ├── types
│   │   ├── next-auth.d.ts
│   │   └── types.ts
│   └── utils
│       ├── api.ts
│       └── taskRouterUtils.ts
```

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  password      String
  assignedTasks Task[]    @relation("TaskAssignees")
  createdTasks  Task[]    @relation("TaskCreator")
  projects      Project[] @relation("ProjectMembers")
  ownedProjects Project[] @relation("ProjectOwner")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Project {
  id          String    @id @default(uuid())
  name        String
  description String?
  tasks       Task[]
  members     User[]    @relation("ProjectMembers")
  owner       User      @relation("ProjectOwner", fields: [ownerId], references: [id])
  ownerId     String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Task {
  id          String      @id @default(uuid())
  title       String
  description String?
  status      TaskStatus  @default(TODO)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?
  project     Project     @relation(fields: [projectId], references: [id])
  projectId   String
  assignees   User[]      @relation("TaskAssignees")
  createdBy   User        @relation("TaskCreator", fields: [createdById], references: [id])
  createdById String
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum TaskStatus {
  INPROGRESS
  TODO
  COMPLETED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}
```

## API Endpoints (tRPC Procedures)

### Project Router

#### getAllProjects
- **Description**: Fetches all projects that the user owns or is a member of.
- **Returns**: An array of projects with their details including id, name, description, owner, and members.

#### createProject
- **Description**: Creates a new project with the specified name, description, and members.
- **Input**: Requires the project name, description, and an array of member IDs.
- **Returns**: The created project object.

#### updateProject
- **Description**: Updates an existing project. Only the owner can update the project.
- **Input**: Requires project ID, name, description, and an array of member IDs.
- **Returns**: The updated project object.

```typescript
// Project Router
const projectRouter = createTRPCRouter({
    getAllProjects: protectedProcedure
        .query(async ({ ctx }) => {
            //...
        }),

    createProject: protectedProcedure
        .input(createProjectInputSchema)
        .mutation(async ({ ctx, input }) => {
            //...
        }),

    updateProject: protectedProcedure
        .input(updateProjectInputSchema)
        .mutation(async ({ ctx, input }) => {
            //..
        })
});
```

### Task Router

#### getAllTask
- **Description**: Fetches all tasks for a specific project or tasks assigned to the user.
- **Input**: Requires project ID, status, priority, sortBy, and sortOrder.
- **Returns**: An array of tasks with their details including id, title, status, priority, and assignees.

#### createTask
- **Description**: Creates a new task within a specified project.
- **Input**: Requires title, description, status, priority, due date, project ID, and an array of assignee IDs.
- **Returns**: The created task object.

#### updateTask
- **Description**: Updates an existing task. Only the creator can update the task.
- **Input**: Requires task ID and any fields to update (title, description, status, priority, due date, assignee IDs).
- **Returns**: The updated task object.

#### deleteTask
- **Description**: Deletes a task by its ID. Access is verified based on project permissions.
- **Input**: Requires task ID.
- **Returns**: The deleted task object.

```typescript
// Task Router
const taskRouter = createTRPCRouter({
    getAllTask: protectedProcedure
        .input(getAllTaskInputSchema)
        .query(async ({ ctx, input }) => {
            // ...
        }),

    createTask: protectedProcedure
        .input(createTaskSchema)
        .mutation(async ({ ctx, input }) => {
            // ...
        }),

    updateTask: protectedProcedure
        .input(updateTaskSchema)
        .mutation(async ({ ctx, input }) => {
            // ...
        }),

    deleteTask: protectedProcedure
        .input(deleteTaskInputSchema)
        .mutation(async ({ ctx, input }) => {
            // ...
        })
});
```

### User Router

#### searchByName
- **Description**: Searches for users by name within a specific project.
- **Input**: Requires a search term and project ID.
- **Returns**: An array of users matching the search criteria.

#### updateUser
- **Description**: Updates the user's name.
- **Returns**: The updated user object.

#### getUserDetails
- **Description**: Fetches detailed information about the current user, including tasks and projects.
- **Returns**: User details object.

#### getUserStats
- **Description**: Retrieves statistics about the user's tasks and projects.
- **Returns**: An object containing counts of assigned tasks, created tasks, and projects.

```typescript
// User Router
const userRouter = createTRPCRouter({
    searchByName: protectedProcedure
        .input(searchByNameInputSchema)
        .query(async ({ ctx, input }) => {
            // ...
        }),

    updateUser: protectedProcedure
        .input(updateUserInputSchema)
        .mutation(async ({ ctx, input }) => {
            // ...
        }),

    getUserDetails: protectedProcedure
        .query(async ({ ctx }) => {
            // ...
        }),

    getUserStats: protectedProcedure
        .query(async ({ ctx }) => {
            // ...
        }),
});
```

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Set up your environment variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

## Key Components

### AddProjectModal
- Handles project creation and editing
- Manages project members
- Form validation using Zod
- Real-time updates using tRPC mutations

### AddTaskModal
- Task creation and editing
- Status and priority management
- Due date assignment
- Multiple assignee selection
- Form validation using Zod

### SearchBox
- User search functionality
- Multi-select user interface
- Used in both project and task management

## State Management

The application uses Zustand for state management, particularly for modal states and dashboard views. Zustand is a small, fast, and scalable bearbones state-management solution that provides a simple API for managing global state in React applications.

### Modal Store

The **Modal Store** is responsible for managing the state of various modal dialogs within the application. It includes the following state properties and actions:

- **State Properties:**
  - `isDeleteModalOpen`: A boolean indicating whether the delete confirmation modal is open.
  - `isAddModalOpen`: A boolean indicating whether the add task or project modal is open.
  - `taskToEdit`: Holds the task object that is currently being edited, or `null` if no task is being edited.
  - `taskToDelete`: Holds the task object that is currently selected for deletion, or `null` if no task is selected.
  - `projectToEdit`: Holds the project object that is currently being edited, or `null` if no project is being edited.
  - `isProjectModalOpen`: A boolean indicating whether the project modal is open.

- **Actions:**
  - `setIsDeleteModalOpen`: A function to update the state of the delete modal.
  - `setIsAddModalOpen`: A function to update the state of the add modal.
  - `setTaskToEdit`: A function to set the task that is being edited.
  - `setTaskToDelete`: A function to set the task that is selected for deletion.
  - `setProjectToEdit`: A function to set the project that is being edited.
  - `setIsProjectModalOpen`: A function to update the state of the project modal.

### Dashboard Store

The **Dashboard Store** manages the state related to the dashboard view of the application. It includes properties and actions that help in controlling the current view and the selected project:

- **State Properties:**
  - `boardView`: Represents the current view of the dashboard, which can be in different formats (e.g., list, board).
  - `currProjectId`: Holds the ID of the currently selected project, or `undefined` if no project is selected.

- **Actions:**
  - `setBoardView`: A function to update the current board view.
  - `setCurrProjectId`: A function to set the ID of the currently selected project.

By utilizing these stores, the application can efficiently manage the state of modals and dashboard views, ensuring a smooth user experience and easy state updates across components.
