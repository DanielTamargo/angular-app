import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TaskInterface } from '../interfaces/task.interface';
import { TaskListStateInterface } from '../interfaces/tasklist-state.interface';
import { TasklistService } from '../services/tasklist.service';
import * as TaskListActions from '../store/tasklist.actions';

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

  constructor(
    private taskListService: TasklistService,
    private store: Store<{ taskList: TaskListStateInterface }>,
    private http: HttpClient) { }

  ngOnInit(): void {
    // Nos suscribimos al reducer de las tareas para obtener el estado cada vez que haya un cambio
    this.tasksSubscription$ = this.store.select('taskList').subscribe(state => {
      if (!state.tasksLoaded) return;

      this.tasks = state.tasks;
      this.loading = false;
      console.log(state.tasks);
    });    
  }

  ngOnDestroy(): void {
    // Eliminamos suscripciones para evitar pérdidas de memoria y rendimiento
    this.tasksSubscription$.unsubscribe();
  }


  onCreateTask(): void {
    this.store.dispatch(TaskListActions.taskCreateShow());
  }

}
