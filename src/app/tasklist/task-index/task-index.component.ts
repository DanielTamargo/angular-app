import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { TaskInterface, TaskListStoreInterface } from '../interfaces/task.interface';

@Component({
  selector: 'app-task-index',
  templateUrl: './task-index.component.html',
  styleUrls: ['./task-index.component.scss']
})
export class TaskIndexComponent implements OnInit, OnDestroy {

  loading = true;

  // Lista de tareas a obtener del Store
  tasks: TaskInterface[] = [];
  tasksSubscription$ = new Subscription;

  constructor(private store: Store<{ taskList: TaskListStoreInterface }>) { }

  ngOnInit(): void {
    // Nos suscribimos al estado para obtener la lista de tareas
    this.tasksSubscription$ = this.store.select('taskList').subscribe(state => {
      this.tasks = state.tasks;
      this.loading = false;
    });

    
  }

  ngOnDestroy(): void {
    // Eliminamos suscripciones para evitar pérdidas de memoria y rendimiento
    this.tasksSubscription$.unsubscribe();
  }

}
