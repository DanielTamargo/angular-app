import { TaskListStoreInterface } from "../interfaces/task.interface";
import * as TaskListActions from "./tasklist.actions";

// Estado inicial de la aplicación
const initialState: TaskListStoreInterface = {
  tasks: [
    { accessibility: 0.8, activity: 'Test activity 1', completed: false, key: 'test-1', participants: 2, price: 25, type: 'recreational' },
    { accessibility: 1, activity: 'Test activity 2', completed: false, key: 'test-2', participants: 1, price: 10, type: 'recreational' },
    { accessibility: 0.2, activity: 'Test activity 3', completed: false, key: 'test-3', participants: 1, price: 150, type: 'recreational' },
  ],
  editedTask: -1,
  newTask: -1
};

/**
 * Función del reducer que actualizará el estado de la aplicación cuando vayan ejecutándose acciones
 * 
 * @param state estado de la aplicación, por defecto se asigna initialState
 * @param action acción
 */
export function taskListReducer(
  state = initialState, 
  action: TaskListActions.TaskAdd
  ) 
{
  switch (action.type) {
    // Añadimos una nueva tarea
    case TaskListActions.TASK_ADD: 
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };

    // Por defecto devolvemos el propio estado
    default:
      return state;
  }
}