import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, animate, style, query, stagger } from '@angular/animations';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TaskInterface } from '../interfaces/task.interface';
import { TaskListStateInterface } from '../interfaces/tasklist-state.interface';
import * as TaskListActions from '../store/tasklist.actions';
import { TasklistService } from '../services/tasklist.service';
import Swal from 'sweetalert2';

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
  tasksSubscription$ = new Subscription;
  editedTask?: string;

  activityTotal = -1;

  constructor(
    private store: Store<{ taskList: TaskListStateInterface }>,
    private taskListService: TasklistService
    ) { }

  ngOnInit(): void {
    // Nos suscribimos al reducer de las tareas para obtener el estado cada vez que haya un cambio
    this.tasksSubscription$ = this.store.select('taskList').subscribe(state => {
      if (state.firstLoad) return;

      this.editedTask = state.editedTask;

      this.tasks = state.tasks;
      this.loading = false;
      console.log('State',state);
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
      title: 'U sure mate?',
      text: 'Deleting it will be irreversible',
      showCancelButton: true,
      showConfirmButton: false,
      showDenyButton: true,
      denyButtonText: "Do it!",
      cancelButtonText: "Hell no!",
    }).then((result) => {
      // Si confirma, volvemos
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

}
