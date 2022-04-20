import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TasklistService } from './services/tasklist.service';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss']
})
export class TasklistComponent implements OnInit, OnDestroy {

  userLoading = true;
  userLoadingSubscription$ = new Subscription;
  userSubscription$ = new Subscription;

  user: any = null;

  constructor(private taskListService: TasklistService) { }

  ngOnInit(): void {
    // Inicializamos la suscripción a los cambios en el usuario
    this.taskListService.initializeAuthSubscription();

    // Nos suscribimos a los cambios en el loading del usuario
    this.userLoadingSubscription$ = this.taskListService.userLoadingSubject$.subscribe(loading => { this.userLoading = loading });
    // Y a los cambios en el usuario
    this.userSubscription$ = this.taskListService.userSubject$.subscribe(user => { this.user = user });
  }

  onUserSignOut(): void {
    this.taskListService.userSignOut();
  }

  ngOnDestroy(): void {
    // Eliminamos suscripciones para evitar pérdidas de memoria o rendimiento
    this.userLoadingSubscription$.unsubscribe();
    this.userSubscription$.unsubscribe();
  }

}
