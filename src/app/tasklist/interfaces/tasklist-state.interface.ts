import { TaskInterface } from "./task.interface";

export interface TaskListStateInterface {
  tasks: TaskInterface[];
  editedTask: string | null;

  taskAdded?: string;
  taskUpdated?: string;
  taskToUpdate?: string;

  tasksLoaded: boolean;
  taskFormShow: boolean,

  firstLoad: boolean;
}