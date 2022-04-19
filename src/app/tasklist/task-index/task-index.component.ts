import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TaskListConstants as TLC } from '../constants/tasklist-constants';
import { TaskInterface, TaskListStateInterface } from '../interfaces/task.interface';
import { TasklistService } from '../services/tasklist.service';

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
    const task = this.tasks[0]
    this.taskListService.addTask(task);
  }

}
