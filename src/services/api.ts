import axios from "axios";
import type { User, Project, Task } from "../types";

const api = axios.create({ baseURL: "http://localhost:3001" });

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    const { data } = await api.get<User[]>("/users", {
      params: { email, password },
    });
    if (!data.length) throw new Error("Invalid credentials");
    return data[0];
  },
  register: async (payload: Omit<User, "id">): Promise<User> => {
    const existing = await api.get("/users", {
      params: { email: payload.email },
    });
    if (existing.data.length) throw new Error("Email already exists");
    const { data } = await api.post<User>("/users", payload);
    return data;
  },
};

export const projectApi = {
  getAll: () => api.get<Project[]>("/projects").then((r) => r.data),
  getById: (id: string) =>
    api.get<Project>(`/projects/${id}`).then((r) => r.data),
  create: (payload: Omit<Project, "id">) =>
    api.post<Project>("/projects", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Project>) =>
    api.patch<Project>(`/projects/${id}`, payload).then((r) => r.data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const taskApi = {
  getByProject: (projectId: string) =>
    api.get<Task[]>("/tasks", { params: { projectId } }).then((r) => r.data),
  create: (payload: Omit<Task, "id">) =>
    api.post<Task>("/tasks", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Task>) =>
    api.patch<Task>(`/tasks/${id}`, payload).then((r) => r.data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};
