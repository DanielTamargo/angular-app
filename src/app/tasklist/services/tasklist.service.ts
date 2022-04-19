import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TaskInterface, TaskListStateInterface } from '../interfaces/task.interface';
import * as TaskListActions from '../store/tasklist.actions';

@Injectable({
  providedIn: 'root'
})
export class TasklistService {

  constructor(private store: Store<{ taskList: TaskListStateInterface }>) { 
    // TODO petición GET a Firebase para obtener todas las tareas del usuario loggeado
  }

  /**
   * Ejecutará la acción (dispatch) taskAdd del reducer taskListReducer
   * 
   * @param task tarea a añadir
   */
  addTask(task: TaskInterface) {
    // TODO petición POST a Firebase para almacenar la nueva tarea y guardar como key el id de la tarea


    this.store.dispatch(TaskListActions.taskAdd({
      task: task
    }));
  }

  /**
   * Ejecutará la acción (dispatch) taskUpdate del reducer taskListReducer
   * 
   * @param task tarea a actualizar
   */
  updateTask(task: TaskInterface) {
    this.store.dispatch(TaskListActions.taskUpdate({
      task: task
    }));
  }

  /**
   * Ejecutará la acción (dispatch) taskDelete del reducer taskListReducer
   * 
   * @param task tarea a eliminar
   */
  deleteTask(task: TaskInterface) {
    this.store.dispatch(TaskListActions.taskDelete({
      task: task
    }));
  }


}
