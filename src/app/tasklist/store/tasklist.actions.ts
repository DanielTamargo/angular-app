// Documentación oficial NgRx Actions: https://ngrx.io/guide/store/actions
import { createAction, props } from '@ngrx/store';
import { TaskInterface } from '../interfaces/task.interface';

// CLAVES DE ACCIONES
export const TASK_LOAD   = '[TaskList] Load Tasks';
export const TASK_ADD    = '[TaskList] Add Task';
export const TASK_UPDATE = '[TaskList] Update Task';
export const TASK_DELETE = '[TaskList] Delete Task';

// ACCIONES
export const tasksLoad = createAction(
  TASK_LOAD,
  props<{ tasks: TaskInterface[] }>()
);

export const taskAdd = createAction(
  TASK_ADD,
  props<{ task: TaskInterface }>()
);

export const taskUpdate = createAction(
  TASK_UPDATE,
  props<{ task: TaskInterface }>()
);

export const taskDelete = createAction(
  TASK_DELETE,
  props<{ task: TaskInterface }>()
);

