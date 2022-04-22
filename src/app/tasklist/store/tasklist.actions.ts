// Documentación oficial NgRx Actions: https://ngrx.io/guide/store/actions
import { createAction, props } from '@ngrx/store';
import { TaskInterface } from '../interfaces/task.interface';

// CLAVES DE ACCIONES
export const USER_LOGOUT = '[User] Logout';
export const TASK_LOAD   = '[TaskList] Load Tasks';
export const TASK_ADD    = '[TaskList] Add Task';
export const TASK_UPDATE = '[TaskList] Update Task';
export const TASK_DELETE = '[TaskList] Delete Task';

export const TASK_FORM_GO_BACK = '[TaskList] Task Form Go Back';
export const TASK_CREATE_SHOW  = '[TaskList] Show Create Task Form';
export const TASK_UPDATE_SHOW  = '[TaskList] Show Update Task Form';

// ACCIONES
export const userLogout = createAction(
  USER_LOGOUT
);

export const tasksLoad = createAction(
  TASK_LOAD,
  props<{ tasks: TaskInterface[] }>()
);

export const taskAdd = createAction(
  TASK_ADD,
  props<{ task: TaskInterface }>()
);

export const taskFormGoBack = createAction(
  TASK_FORM_GO_BACK,
)

export const taskCreateShow = createAction(
  TASK_CREATE_SHOW,
);

export const taskUpdateShow = createAction(
  TASK_UPDATE_SHOW,
  props<{ taskKey: string }>()
);

export const taskUpdate = createAction(
  TASK_UPDATE,
  props<{ task: TaskInterface }>()
);

export const taskDelete = createAction(
  TASK_DELETE,
  props<{ task: TaskInterface }>()
);

