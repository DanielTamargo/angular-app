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
  newTask: null,
  tasksLoaded: false,
  taskToUpdate: null,
};

// TaskList Reducer que trabajará con la información
export const taskListReducer = createReducer(
  initialState,
  on(TaskListActions.userLogout, (state) => ({
    ...state,
    ...initialState,
  })),
  on(TaskListActions.tasksLoad, (state, { tasks }) => ({
    ...state,
    tasks: tasks,
    tasksLoaded: true,
    taskToUpdate: null
  })),
  on(TaskListActions.taskAdd, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    editedTask: null,
    newTask: task.key,
    taskToUpdate: null
  })),
  on(TaskListActions.taskUpdateShow, (state, { taskToUpdate }) => ({
    ...state,
    taskToUpdate: taskToUpdate
  })),
  on(TaskListActions.taskUpdate, (state, { task }) => {
    // Para respetar el readonly del state, obtenemos una copia de las tasks
    const tasks = [...state.tasks];

    // Encontramos el índice de la tarea a modificar
    let indexOfUpdatedTask = tasks.findIndex(t => t.key == task.key);

    // TODO si no encuentra la task, mostrar error
    if (indexOfUpdatedTask < 0) {
      return state;
    }

    // Modificamos la tarea
    tasks[indexOfUpdatedTask] = {
      ...tasks[indexOfUpdatedTask], // volcamos sus propiedades
      ...task // y sobrescribimos por las nuevas
    }

    // Devolvemos el nuevo estado
    return {
      ...state,
      tasks: tasks,
      editedTask: task.key,
      newTask: null,
      taskToUpdate: null
    }
  }),
  on(TaskListActions.taskDelete, (state, { task }) => {
    // Devolvemos el estado filtrando para obviar la tarea eliminada
    return {
      ...state,
      tasks: state.tasks.filter(t => t.key !== task.key),
      editedTask: null,
      newTask: null,
      taskToUpdate: null
    }
  }),
);
