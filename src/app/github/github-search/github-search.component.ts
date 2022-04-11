import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounceTime, filter, fromEvent, map, merge, Observable, pluck, startWith, Subject, Subscription, tap } from 'rxjs';

import { GitHubService } from 'src/app/shared/services/github.service';
import { GitHubConstants as GHC } from 'src/app/shared/constants/github-constants';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
@Component({
  selector: 'app-github-search',
  templateUrl: './github-search.component.html',
  styleUrls: ['./github-search.component.scss']
})
export class GitHubSearchComponent implements OnInit, OnDestroy {
  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;

  typing: boolean = false;
  usernameChange$: Observable<any>;
  usernameFocus$: Observable<any>;
  username: string;
  inputDisabled: boolean = false;

  typingSubscription$ = new Subscription;

  suggedstedUsernamesSubscription = new Subscription;
  suggestedUsernames: string[] = [];
  recentUsernames$: Observable<string[]>;
  filteredSuggestedUsernames$ = new Subject<string[]>(); 

  constructor(private gitHubService: GitHubService) { }

  ngOnInit(): void {
    // Comprobamos si ya ha buscado algún usuario
    this.username = this.gitHubService.username;

    // También nos suscribimos para comprobar si el usuario está escribiendo y se está buscando
    this.typingSubscription$ = this.gitHubService.typingSubject$.subscribe(typing => {
      this.typing = typing;
      // if (!typing) this.trigger.closePanel();
    });

    // Obtenemos lista de usuarios recientes
    this.suggedstedUsernamesSubscription = this.gitHubService.suggedUsernamesSubject$.subscribe(
      suggestedUsernames => {
        this.suggestedUsernames = suggestedUsernames;
      }
    );

    // Obtenemos el input y creamos un observable con su evento 'keyup' y otro con el evento 'focus'
    const inputUsername = document.getElementById('username');
    this.usernameChange$ = fromEvent<KeyboardEvent>(inputUsername, 'keyup');
    this.usernameFocus$ = fromEvent<FocusEvent>(inputUsername, 'focus');

    // Nos suscribimos al observable con un debouncetime para descartar spam y pluck para obtener el valor
    this.usernameChange$.pipe(
      pluck<KeyboardEvent>('target', 'value'), // Obtenemos el valor
      tap<string>((value) => { // Mostramos el typing y las opciones del autocomplete
        this.typing = true;
        this.filterSuggestedUsernames(value);
      }),
      debounceTime<string>(700),
      filter<string>(value => value.length >= 0),
      tap((value) => {
        if (value.length == 0) this.typing = false;
      })
    ).subscribe(value => {
      this.gitHubService.onUserSearch(value.trim());
    });

    // Preparamos el Observable para las opciones del autocomplete
    // Utilizamos merge para combinar los eventos keyup y focus
    this.recentUsernames$ = merge(
      this.usernameChange$,
      this.usernameFocus$
    ).pipe(
      pluck<KeyboardEvent>('target', 'value'),
      startWith(''),
      map<string, string[]>(value => {
        return this.suggestedUsernames.filter(username => username.toLowerCase().includes(value.toLowerCase()));
      })
    );
  }

  /**
   * Listener de la selección del MatAutoComplete
   * 
   * @param username username seleccionado
   */
  onAutoCompleteOptionSelected(username: string): void {
    this.inputDisabled = true;
    // Para evitar que cargue el usuario que coincida con el texto introducido antes de seleccionar, generamos este mini timeout
    setTimeout(() => {
      this.gitHubService.onUserSearch(username.trim());
      this.inputDisabled = false;
    }, 250);
  }

  ngOnDestroy(): void {
    // Quitamos las suscripciones para evitar leaks de memoria y rendimiento
    this.typingSubscription$.unsubscribe();
    this.suggedstedUsernamesSubscription.unsubscribe();
  }

  /**
   * Filtra la lista de usuarios sugeridos según el valor que se vaya introduciendo
   * 
   * @param value valor utilizado para filtrar
   */
  filterSuggestedUsernames(value: string) {
    this.suggestedUsernames.filter(username => username.toLowerCase().includes(value.toLowerCase()));
  }

  /**
   * Limpia la lista de usuarios recientes
   */
  clearRecentUsernames(): void {
    localStorage.removeItem(GHC.LS_GITHUB_RECENT_USERNAMES);
    this.suggestedUsernames = [];
    this.gitHubService.suggestedUsernames = [];
    this.trigger.closePanel();
  }
}
