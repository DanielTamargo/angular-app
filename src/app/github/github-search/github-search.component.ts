import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, filter, fromEvent, Observable, pluck, Subscription, tap } from 'rxjs';

import { GitHubService } from 'src/app/shared/services/github.service';

@Component({
  selector: 'app-github-search',
  templateUrl: './github-search.component.html',
  styleUrls: ['./github-search.component.css']
})
export class GitHubSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  usernameChange$: Observable<any>;
  username: string;

  evtSubscription$ = new Subscription;

  constructor(private githubService: GitHubService) { }

  ngOnInit(): void {
    // Comprobamos si ya ha buscado algún usuario
    this.username = this.githubService.username;
  }

  ngAfterViewInit(): void {
    // Obtenemos el input y creamos un observable con su evento 'keyup'
    const inputUsername = document.getElementById('username');
    this.usernameChange$ = fromEvent<KeyboardEvent>(inputUsername, 'keyup');

    // Nos suscribimos al observable con un debouncetime para descartar spam y pluck para obtener el valor
    this.evtSubscription$ = this.usernameChange$.pipe(
      debounceTime<KeyboardEvent>(700),
      pluck<KeyboardEvent>('target', 'value'),
      filter<string>(value => value.length > 2)
    ).subscribe(value => {
      this.githubService.onUserSearch(value);
    });
  }

  ngOnDestroy(): void {
    // Quitamos las suscripciones para evitar leaks de memoria y rendimiento
    this.evtSubscription$.unsubscribe();
  }

}
