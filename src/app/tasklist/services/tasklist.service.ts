import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, map, Subject, Subscription, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';

import { TaskInterface } from '../interfaces/task.interface';
import { TaskListStateInterface } from '../interfaces/tasklist-state.interface';
import * as TaskListActions from '../store/tasklist.actions';

@Injectable({
  providedIn: 'root'
})
export class TasklistService {

  listInitialized = false;

  userSubject$ = new Subject<any>();
  userLoadingSubject$ = new Subject<boolean>();

  user: any;
  userAccessToken: string

  displayIndex = 1;
  displaySubject$ = new BehaviorSubject<number>(this.displayIndex);

  tasksDB$: AngularFireList<TaskInterface>;
  tasksSubscription$ = new Subscription;

  constructor(
    private store: Store<{ taskList: TaskListStateInterface }>,
    private afDB: AngularFireDatabase,
    public afAuth: AngularFireAuth ) { }

  /**
   * Inicializa el listener al observable usuario del servicio AngularFireAuth
   */
  initializeAuthSubscription() {
    // Inicializamos sólo una vez
    if (this.listInitialized) return;

    this.listInitialized = true;

    // Nos suscribimos a los cambios en el usuario
    this.afAuth.user.subscribe((user) => {
      // Emitimos actualizaciones
      this.userLoadingSubject$.next(false);
      this.userSubject$.next(user);
      
      this.user = user;
      this.userLoggedIn(user);

      if (!user) {
        this.userAccessToken = null;
        return; 
      }

      // Obtenemos el token: https://firebase.google.com/docs/reference/js/v8/firebase.User#getidtoken
      user.getIdToken().then(token => {
        this.userAccessToken = token;
      });
    });
  }

  /**
   * Recibe un usuario de firebase y obtiene los posts asociados a él
   * 
   * @param user usuario obtenido del login de firebase
   * @returns saldrá de la función si el usuario es falsy
   */
  userLoggedIn(user: any) {
    // Si no tenemos usuario obviamos
    this.user = user;
    if (!user) return;

    // Eliminamos la suscripción previa
    this.tasksSubscription$.unsubscribe();
    
    /* Obtener la lista solo una única vez */
    /*
    this.afDB.list("/" + user.uid + "/tasks").query.once('value').then(val => {
      const tasks = [];
      val.forEach(task => {
        tasks.push({
          ...task.val(),
          key: task.key
        });
      });
      
      this.store.dispatch(TaskListActions.tasksLoad({
        tasks: tasks
      }));
    });
    */

    /* Obtener la lista cada vez que ocurra algún cambio en la BBDD */
    // Utilizando @angular/fire podemos acceder a la instancia de la BBDD y obtenemos la referencia al conjunto de datos
    this.tasksDB$ = this.afDB.list<TaskInterface>("/" + user.uid + "/tasks", (ref) =>
      // Podemos ordenar los resultados
      ref.orderByChild('price')
    );

    // A través de la referencia escuchamos los cambios que surjan en el conjunto
    this.tasksSubscription$ = this.tasksDB$.snapshotChanges()
    .pipe(
      // Como Firebase nos proporciona más información de la que necesitamos, 
      // mapeamos el resultado para recoger únicamente lo que deseamos
      map<any, TaskInterface[]>((changes) => {
        return changes.map((c: any) => ({
          ...c.payload.val(),
          id: c.payload.key,
        }));
      })
    )
    .subscribe(tasks => {
      console.log('[Firebase] Obteniendo tareas');
      
      this.store.dispatch(TaskListActions.tasksLoad({
        tasks: tasks
      }));
    });
  }

  /**
   * Procesa el logout del usuario y lo actualiza en el Store
   */
  userSignOut() {
    this.afAuth.signOut().then(() => {
      this.store.dispatch(TaskListActions.userLogout());
    });
  }

  /**
   * Ejecutará la acción (dispatch) taskAdd del reducer taskListReducer
   *
   * @param task tarea a añadir
   */
  addTask(task: TaskInterface) {
    // Comprobamos que estamos recibiendo una tarea
    if (!task) return;

    // Registramos en la BBDD
    const newTaskId = this.tasksDB$.push(task).key;
    task = {
      ...task,
      id: newTaskId
    };

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
