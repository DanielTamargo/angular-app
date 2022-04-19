import { TaskListStoreInterface } from "../interfaces/task.interface";
import * as TaskListActions from "./tasklist.actions";

// Estado inicial de la aplicación
const initialState: TaskListStoreInterface = {
  tasks: [
    { accessibility: 0.8, activity: 'Test activity 1', completed: false, key: 'test-1', participants: 2, price: 25, type: 'recreational' },
    { accessibility: 1, activity: 'Test activity 2', completed: false, key: 'test-2', participants: 1, price: 10, type: 'recreational' },
    { accessibility: 0.2, activity: 'Test activity 3', completed: false, key: 'test-3', participants: 1, price: 150, type: 'recreational' },
  ],
  editedTask: null,
  newTask: null
};

/**
 * Función del reducer que actualizará el estado de la aplicación cuando vayan ejecutándose acciones
 * 
 * @param state estado de la aplicación, por defecto se asigna initialState
 * @param action acción
 */
export function taskListReducer(
  state: TaskListStoreInterface = initialState, 
  action: TaskListActions.TaskListActionTypes
  )
{
  switch (action.type) {
    // Añadimos una nueva tarea
    case TaskListActions.TASK_ADD: 
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        editedTask: null,
        newTask: null
      };

    // Modificamos una tarea existente
    case TaskListActions.TASK_UPDATE:
      const tasks = state.tasks;
      let updatedTask = tasks.find(task => task.key == (action as any).payload.key);

      if (!updatedTask) {
        // TODO si no encuentra la task, cómo notificar el error? qué hacer?
        return state;
      }

      updatedTask = {
        ...updatedTask, // volcamos sus propiedades
        ...(action as any).payload // y sobrescribimos por las nuevas
      }
      return {
        ...state,
        tasks: [ ...tasks ],
        editedTask: updatedTask.key,
        newTask: null
      }

    // Eliminamos una tarea existente
    case TaskListActions.TASK_DELETE:
      //const deletedTask = state.tasks.find(t => t.key == action.payload);


      return {
        ...state,
        tasks: state.tasks.filter(task => task.key !== action.payload),
        editedTask: null,
        newTask: null
      }

    // Por defecto devolvemos el propio estado
    default:
      return state;
  }
}