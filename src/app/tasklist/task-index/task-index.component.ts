import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, animate, style, query, stagger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { catchError, map, of, Subscription } from 'rxjs';
import { TaskInterface } from '../interfaces/task.interface';
import { TaskListStateInterface } from '../interfaces/tasklist-state.interface';
import * as TaskListActions from '../store/tasklist.actions';
import { TasklistService } from '../services/tasklist.service';
import Swal from 'sweetalert2';
import { TaskListConstants } from '../constants/tasklist-constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-index',
  templateUrl: './task-index.component.html',
  styleUrls: ['./task-index.component.scss'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        query('.activity-card', [
          style({opacity: 0, transform: 'translateY(-100px)'}),
          stagger(-30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: '0px' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 0, width: '0px' })),
          ]),
        ])
      ]),
    ]),
  ]
})
export class TaskIndexComponent implements OnInit, OnDestroy {

  loading = true;

  // Lista de tareas a obtener del Store
  tasks: TaskInterface[] = [];
  displayTasks: TaskInterface[] = [];
  tasksSubscription$ = new Subscription;
  editedTask?: string;
  createdTask?: string;

  // Filters
  filterStatus = 1; // 1 all, 2 done, 3 todo
  filterName: string = '';

  activityTotal = -1;

  constructor(
    private store: Store<{ taskList: TaskListStateInterface }>,
    private taskListService: TasklistService,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    // Nos suscribimos al reducer de las tareas para obtener el estado cada vez que haya un cambio
    this.tasksSubscription$ = this.store.select('taskList').subscribe(state => {
      if (state.firstLoad) return;

      this.editedTask = state.editedTask;
      this.createdTask = state.taskAdded;

      this.tasks = state.tasks;
      this.loading = false;

      this.filterTasks();
    });
  }

  ngOnDestroy(): void {
    // Eliminamos suscripciones para evitar pérdidas de memoria y rendimiento
    this.tasksSubscription$.unsubscribe();
  }

  onCreateTask(): void {
    this.store.dispatch(TaskListActions.taskCreateShow());
  }

  onEditTask(task: TaskInterface): void {
    this.store.dispatch(TaskListActions.taskUpdateShow({ taskKey : task.key }))
  }

  onDeleteTask(task: TaskInterface): void {
    // Si el usuario ha modificado el formulario, mostramos alerta para la confirmación
    Swal.fire({
      title: 'Are you sure?',
      html: 'Deleting it will be <b>irreversible</b>',
      // text: 'Deleting it will be irreversible',
      customClass: 'tasklist-swal',
      showCancelButton: true,
      showConfirmButton: false,
      showDenyButton: true,
      denyButtonText: "Do it!",
      cancelButtonText: "Hell no!",
    }).then((result) => {
      // Si confirma, eliminamos
      if (result.isDenied) this.taskListService.deleteTask(task);
    });

  }

  onCompleteTask(task: TaskInterface): void {
    // Actualizamos el estado de la tarea
    task = {
      ...task,
      completed: !task.completed
    };

    // Y llamamos al método del servicio que actualizará la tarea en la nube y ejecutará el dispatch
    this.taskListService.updateTask(task);
  }

  // ---------------------------------------------------------------------------------------------------
  onCreateRandomTask(): void {
    this.filterStatus = 1;
    this.filterName = '';

    this.http.get(TaskListConstants.BORED_API_URL)
      .pipe(
        catchError(err => of(null)),
        map<any, TaskInterface>(resp => {
          if (!resp) return null;

          return {
            ...resp,
            key: TaskListConstants.randomKey(),
            created_at: new Date().getTime(),
            completed: false,
          }
        })
      )
      .subscribe(task => {
        if (!task) {
          // TODO notificar error

          return;
        }

        this.taskListService.addTask(task);
      });
  }

  onRemoveTodayTasks(): void {
    const todayTasks = this.tasks.filter(task => {
      return new Date().toLocaleDateString("en-US") == new Date(task.created_at).toLocaleDateString("en-US");
    });

    if (todayTasks.length <= 0) return;

    // TODO Confirmación
    Swal.fire({
      title: 'Be careful!',
      html: `You're about to delete <b>${todayTasks.length}</b> task(s).<br>Deleting them will be <b>irreversible</b>`,
      // text: `You're about to delete <b>${todayTasks.length}</b> tasks. Deleting them will be irreversible`,
      customClass: 'tasklist-swal',
      showCancelButton: true,
      showConfirmButton: false,
      showDenyButton: true,
      denyButtonText: "Do it!",
      cancelButtonText: "Hell no!",
    }).then((result) => {
      // Si confirma, eliminamos
      if (result.isDenied) this.taskListService.deleteTodayTasks(todayTasks);
    });
  }

  // ---------------------------------------------------------------------------------------------------
  onFilterStatusChange(status: number): void {
    this.filterStatus = status;
    this.filterTasks();
  }

  filterTasks(): void {
    this.displayTasks
      = this.tasks
        .filter(task => {
          if (this.filterName) return task.activity.toLocaleLowerCase().includes(this.filterName.toLowerCase());
          return task;
        })
        .filter(task => {
          if (this.filterStatus == 2) return task.completed;
          else if (this.filterStatus == 3) return !task.completed;
          return task;
        });
  }

}
