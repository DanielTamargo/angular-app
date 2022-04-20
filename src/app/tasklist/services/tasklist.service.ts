import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map } from 'rxjs';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';

import { TaskInterface, TaskListStateInterface } from '../interfaces/task.interface';
import * as TaskListActions from '../store/tasklist.actions';

@Injectable({
  providedIn: 'root'
})
export class TasklistService {

  user: any;
  userAccessToken: string

  displayIndex = 1;
  displaySubject$ = new BehaviorSubject<number>(this.displayIndex);

  tasksDB$: AngularFireList<TaskInterface>;

  constructor(
    private store: Store<{ taskList: TaskListStateInterface }>,
    private db: AngularFireDatabase ) { }

  userLoggedIn(user: any) {
    this.user = user;
    if (!user) return;

    this.tasksDB$ = this.db.list("/" + user.uid + "/tasks", (ref) =>
      ref.orderByChild('price')
    );

    this.tasksDB$.snapshotChanges()
    .pipe(
      map<any, TaskInterface[]>((changes) => {
        return changes.map((c: any) => ({
          ...c.payload.val(),
          id: c.payload.key,
        }));
      })
    )
    .subscribe(resp => {
      this.store.dispatch(TaskListActions.tasksLoad({
        tasks: resp
      }));
    })
  }

  /**
   * Ejecutará la acción (dispatch) taskAdd del reducer taskListReducer
   *
   * @param task tarea a añadir
   */
  addTask(task: TaskInterface) {
    task = { accessibility: 0.8, activity: 'Test activity 1', completed: false, key: 'test-1', participants: 2, price: 25, type: 'recreational' };
    // Comprobamos que estamos recibiendo una tarea
    if (!task) return;

    // Registramos en la BBDD
    task.id = this.tasksDB$.push(task).key;

    /* this.store.dispatch(TaskListActions.taskAdd({
      task: task
    })); */
  }

  /**
   * Ejecutará la acción (dispatch) taskUpdate del reducer taskListReducer
   *
   * @param task tarea a actualizar
   */
  updateTask(task: TaskInterface) {
    // Comprobamos que estamos recibiendo una tarea
    if (!task) return;

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
    // Comprobamos que estamos recibiendo una tarea
    if (!task) return;

    this.store.dispatch(TaskListActions.taskDelete({
      task: task
    }));
  }

  /**
   * Recibe de cualquier componente un índice y lo emite para que el padre lo reciba
   * El padre utilizará el índice para mostrar u ocultar los componentes hijos
   */
  displayComponents(displayIndex: number = 1): void {
    this.displayIndex = displayIndex;
    this.displaySubject$.next(this.displayIndex);
  }


}
