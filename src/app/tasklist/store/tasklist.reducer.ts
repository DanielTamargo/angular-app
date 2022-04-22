import { createReducer, on } from '@ngrx/store';
import { TaskListStateInterface } from "../interfaces/tasklist-state.interface";
import * as TaskListActions from "./tasklist.actions";

// Estado inicial de la aplicación
const initialState: TaskListStateInterface = {
  tasks: [
    /* { accessibility: 0.8, activity: 'Test activity 1', completed: false, key: 'test-1', participants: 2, price: 25, type: 'recreational' },
    { accessibility: 1, activity: 'Test activity 2', completed: false, key: 'test-2', participants: 1, price: 10, type: 'recreational' },
    { accessibility: 0.2, activity: 'Test activity 3', completed: false, key: 'test-3', participants: 1, price: 150, type: 'recreational' }, */
  ],
  editedTask: null,
  taskAdded: null,
  taskUpdated: null,
  tasksLoaded: false,
  taskFormShow: false,
  taskToUpdate: null,
  firstLoad: true,
};

const resetOptions = {
  editedTask: null,
  taskAdded: null,
  taskUpdated: null,
  tasksLoaded: false,
  taskFormShow: false,
  taskToUpdate: null,
  firstLoad: false,
}

// TaskList Reducer que trabajará con la información
export const taskListReducer = createReducer(
  initialState,
  on(TaskListActions.userLogout, (state) => ({
    ...state,
    ...initialState,
  })),
  on(TaskListActions.tasksLoad, (state, { tasks }) => ({
    ...state,
    ...resetOptions,
    tasks: tasks,
    tasksLoaded: true,
  })),
  on(TaskListActions.taskAdd, (state, { task }) => ({
    ...state,
    ...resetOptions,
    tasks: [task, ...state.tasks],
    newTask: task.key,
  })),
  on(TaskListActions.taskCreateShow, (state) => ({
    ...state,
    ...resetOptions,
    taskFormShow: true,
  })),
  on(TaskListActions.taskUpdateShow, (state, { taskKey }) => ({
    ...state,
    ...resetOptions,
    taskToUpdate: taskKey,
    taskFormShow: true,
  })),
  on(TaskListActions.taskUpdate, (state, { task }) => {
    // Para respetar el readonly del state, obtenemos una copia de las tasks
    const tasks = [...state.tasks];

    // Encontramos el índice de la tarea a modificar
    let indexOfUpdatedTask = tasks.findIndex(t => t.key == task.key);

    // TODO si no encuentra la task, mostrar error
    if (indexOfUpdatedTask < 0) {
      return {
        ...state,
        ...resetOptions,
        // TODO: error: 'error al actualizar, w/e'
      };
    }

    // Modificamos la tarea
    tasks[indexOfUpdatedTask] = {
      ...tasks[indexOfUpdatedTask], // volcamos sus propiedades
      ...task // y sobrescribimos por las nuevas
    }

    // Devolvemos el nuevo estado
    return {
      ...state,
      ...resetOptions,
      tasks: tasks,
      editedTask: task.key,
    }
  }),
  on(TaskListActions.taskDelete, (state, { task }) => {
    // Devolvemos el estado filtrando para obviar la tarea eliminada
    return {
      ...state,
      ...resetOptions,
      tasks: state.tasks.filter(t => t.key !== task.key),
    }
  }),
);
