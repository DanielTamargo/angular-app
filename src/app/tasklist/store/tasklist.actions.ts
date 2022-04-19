import { Action } from '@ngrx/store';
import { TaskInterface } from '../interfaces/task.interface';

export const TASK_ADD = 'TASK_ADD';

export class TaskAdd implements Action {
  readonly type: string = TASK_ADD;
  payload: TaskInterface;
}