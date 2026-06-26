export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "member";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: number;
  createdAt: string;
}

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  assigneeId: number;
  dueDate: string;
  attachment: string | null;
}
