import { Action } from '@ngrx/store';
import { TaskInterface } from '../interfaces/task.interface';

// CLAVES DE ACCIONES
export const TASK_ADD    = 'TASK_ADD';
export const TASK_UPDATE = 'TASK_UPDATE';
export const TASK_DELETE = 'TASK_DELETE';

// ACCIONES
export class TaskAdd implements Action {
  readonly type: string = TASK_ADD;

  constructor(public payload: TaskInterface) {}
}

export class TaskUpdate implements Action {
  readonly type: string = TASK_UPDATE;

  constructor(public payload: TaskInterface) {}
}

export class TaskDelete implements Action {
  readonly type: string = TASK_DELETE;

  constructor(public payload: string) {}
}

// TIPOS DE ACCIONES
export type TaskListActionTypes = 
  | TaskAdd 
  | TaskUpdate 
  | TaskDelete;