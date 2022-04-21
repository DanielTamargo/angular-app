import { TaskInterface } from "./task.interface";

export interface TaskListStateInterface {
  tasks: TaskInterface[];
  editedTask: string | null;
  newTask?: string;
  tasksLoaded: boolean;
  taskToUpdate?: TaskInterface;
}