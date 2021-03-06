import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskListConstants as TLC } from './constants/tasklist-constants';
import { TasklistService } from './services/tasklist.service';

const ANIMATION_STATES = {
  Login: "Login",
  Index: "Index",
  TaskForm: "TaskForm",
}

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss'],
  animations: [
    // Index
    trigger('taskIndexFadeInOut', [
      state('*', style({ opacity: 0 })),
      state(ANIMATION_STATES.Index, style({ opacity: 1 })),
      transition('* => ' + ANIMATION_STATES.Index, animate(`200ms ease-in-out`)),
      transition(ANIMATION_STATES.Index + ' => *',  animate(`200ms ease-in-out`)),
    ]),

    // TaskForm
    trigger('taskFormSlideInOut', [
      state('*', style({ left: '-110vw', opacity: 0, display: 'none' })),
      state(ANIMATION_STATES.TaskForm, style({ left: '0', opacity: 1, display: 'block' })),
      transition('* => ' + ANIMATION_STATES.TaskForm, 
        sequence([
          animate(`0ms`, style({ display: 'block' })), // <- Permite que se vea el deslice al entrar
          animate(`200ms ease-in-out`),
        ])
      ),
      transition(ANIMATION_STATES.TaskForm + ' => *', animate(`200ms ease-in-out`)),
    ]),
  ]
})
export class TasklistComponent implements OnInit, OnDestroy {

  user: any = null;
  userLoading = true;
  userLoadingSubscription$ = new Subscription;
  userSubscription$ = new Subscription;

  displayState: string = ANIMATION_STATES.Login;
  displayIndex: number = 1;
  displayIndexSubscription$ = new Subscription;

  constructor(private taskListService: TasklistService) { }

  ngOnInit(): void {
    // Inicializamos la suscripción a los cambios en el usuario
    this.taskListService.initializeAuthSubscription();

    // Comprobamos si ya existía el usuario cargado
    if (this.taskListService.userLoaded) {
      this.userLoading = false;
      this.user = this.taskListService.user;
    }

    // Nos suscribimos a los cambios en el loading del usuario
    this.userLoadingSubscription$ = this.taskListService.userLoadingSubject$.subscribe(loading => { this.userLoading = loading });
    
    // Y a los cambios en el usuario
    this.userSubscription$ = this.taskListService.userSubject$.subscribe(user => { this.user = user });
    
    // Y al cambio de display (para las animaciones)
    this.displayIndexSubscription$ = this.taskListService.displayIndexSubject$.subscribe(index => { 
      this.displayIndex = index;
      if (this.displayIndex == TLC.DISPLAY_LOGIN) this.displayState = ANIMATION_STATES.Login;
      if (this.displayIndex == TLC.DISPLAY_INDEX) this.displayState = ANIMATION_STATES.Index;
      if (this.displayIndex == TLC.DISPLAY_FORM) this.displayState = ANIMATION_STATES.TaskForm;
    });
  }

  onUserSignOut(): void {
    this.taskListService.userSignOut();
  }

  ngOnDestroy(): void {
    // Eliminamos suscripciones para evitar pérdidas de memoria o rendimiento
    this.userLoadingSubscription$.unsubscribe();
    this.userSubscription$.unsubscribe();
    this.displayIndexSubscription$.unsubscribe();
  }

}
