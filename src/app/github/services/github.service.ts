import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, Observable, pluck, Subject, tap } from 'rxjs';
import { ajax, AjaxError } from 'rxjs/ajax';

import { GitHubRepoInterface } from 'src/app/github/interfaces/github-repo.interface';
import { GitHubUserInterface } from 'src/app/github/interfaces/github-user.interface';

import { GitHubConstants as GHC } from 'src/app/github/constants/github-constants';
import { SortDirection } from '@angular/material/sort';
import { GitHubGistInterface } from '../interfaces/github-gist.interface';
import { GitHubBasicUserInterface } from '../interfaces/github-basicuser.interface';
import { GitHubContributorInterface } from '../interfaces/github-contributor.interface';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {

  // Usuarios buscados anteriormente
  suggestedUsernames: string[]
    = localStorage.getItem(GHC.LS_GITHUB_RECENT_USERNAMES)
      ? JSON.parse(localStorage.getItem(GHC.LS_GITHUB_RECENT_USERNAMES))
      : [];
  suggedUsernamesSubject$ = new BehaviorSubject<string[]>(this.suggestedUsernames);

  // Usuario ya buscado
  username: string = '';
  // Selección ya realizada
  selectedSection: number = 0;
  // Configuración paginator
  pageIndex: number = 0;
  // Configuración orden
  filtro_active: string = 'updated_at';
  filtro_direction: SortDirection = 'desc';
  // Repositorio seleccionado para mostrar su info en el diálogo
  selectedRepository: GitHubRepoInterface = null;
  selectedRepositoryContributors: GitHubContributorInterface[] = null;

  user?: GitHubUserInterface = null;
  repos: GitHubRepoInterface[] = [];
  gists: GitHubGistInterface[] = [];
  follows: GitHubBasicUserInterface[] = [];

  typingSubject$ = new Subject<boolean>();
  rateLimitExceededSubject$ = new Subject<boolean>();

  loadingSubject$ = new Subject<boolean>();
  userSubject$ = new BehaviorSubject<GitHubUserInterface>(this.user);
  userReposSubject$ = new BehaviorSubject<GitHubRepoInterface[]>(this.repos);
  userGistsSubject$ = new BehaviorSubject<GitHubGistInterface[]>(this.gists);
  userFollowsSubject$ = new BehaviorSubject<GitHubBasicUserInterface[]>(this.follows);
  usernameSubject$ = new BehaviorSubject(this.username);

  userSearchError$ = new Subject<string>();

  constructor() { }

  /**
   * Método reutilizado en cada catch de las peticiones a la API.
   *
   * Si encuentra el error 403 y si se debe al límite excedido emite un valor true para que se genere un modal donde sea necesario
   * @emits boolean cuando surge la casuística
   *
   * Si encuentra el error 404 y surge en la petición al usuario, reinicia el usuario
   *
   * @param err objeto con la información del error
   */
  checkApiErrors(err: AjaxError, peticionUsuario = false) {
    const msg: string = err.response.message;

    // Usuario no existe
    if (err.status == 404 && peticionUsuario) { // No encontrado
      this.userSubject$.next(null);
      this.userSearchError$.next("The user '" + this.username + "' for does not exist 😢");
      this.typingSubject$.next(false);
    }

    // Límite excedido
    if (err.status == 403 && msg.includes('limit exceeded')) {
      this.rateLimitExceededSubject$.next(true);
    }
  }

  // Recibe un username y lo busca, si lo encuentra, lo manda
  /**
   * Recibe un username y lo busca, si lo encuentra delege en el método [onUserResult]{@link GitHubService#onUserResult}
   * Si surgen errores en la petición emite valores nulos y falsos donde sea necesario para notificar a la APP
   *
   * @param username nombre de usuario a buscar
   */
  onUserSearch(username: string) {
    // Si ha buscado el mismo usuario, obviamos
    if (this.username.toLocaleLowerCase() == username.toLocaleLowerCase()) {
      this.typingSubject$.next(false);
      return;
    }

    this.username = username;

    // Si no ha escrito nada, reiniciamos
    if (!username) {
      this.userSubject$.next(null);
      this.userSearchError$.next(null);
      return;
    }

    const url = GHC.BASE_URL + GHC.USER.replace(GHC.KEY_USERNAME, username);
    ajax.get<GitHubUserInterface>(url)
      .pipe(
        pluck('response'),
        tap(() => { // Utilizamos el tap para notificar que ya no está escribiendo
          this.typingSubject$.next(false);
        }),) // <- si trabajamos con ajax de rxjs en vez de httpclient lo recibimos distinto
      .subscribe({
        next: user => {
          this.onUserResult(user);
        },
        error: (err: AjaxError) => {
          this.checkApiErrors(err, true);
        }
      });
  }

  /**
   * Recibe el usuario encontrado y lo emite a sus observers, también dependiendo de si ya existía una elección previa
   * de información a mostrar la mantiene, por lo que cargará los elementos necesarios.
   *
   * Guarda el usuario buscado utilizando el método [onSaveSearchedUser]{@link GitHubService#onSaveSearchedUser}
   *
   * @emits GitHubUserInterface
   *
   * @param user usuario encontrado en la búsqueda de la app
   */
  onUserResult(user: GitHubUserInterface): void {
    this.userSubject$.next(user);
    this.user = user;
    this.repos = [];
    this.gists = [];
    this.follows = [];
    this.userReposSubject$.next([]);
    this.userGistsSubject$.next([]);
    this.userFollowsSubject$.next([]);

    // Guardamos el username buscado en la lista de recientes
    if (user) this.onSaveSearchedUser(user.login);

    // Notificamos spinner loading
    if (this.selectedSection > 0) {
      this.loadingSubject$.next(true);
    }

    // Utilizamos if else porque el rendimiento es mejor que switch y buscamos la respuesta más rápida
    if (this.selectedSection == GHC.CASE_REPOS) { // Actualizamos repos
      this.onUserReposRequest(user.url + "/repos", user.public_repos);
    } else if (this.selectedSection == GHC.CASE_GISTS) { // Actualizamos gists
      this.onUserGistsRequest(user.url + "/gists", user.public_gists);
    } else if (this.selectedSection == GHC.CASE_FOLLOWERS) { // Actualizamos followers
      this.onUserFollowsRequest(user.url + "/followers", 4, 1);
    } else if (this.selectedSection == GHC.CASE_FOLLOWING) { // Actualizamos following
      this.onUserFollowsRequest(user.url + "/following", 4, 1);
    }
  }


  /**
   * Guarda el usuario buscado en el localStorage para luego utilizar dicha lista como sugerencias según el usuario vaya escribiendo
   *
   * @param username username del usuario buscado
   */
  onSaveSearchedUser(username: string): void {
    const indexOfUsername = this.suggestedUsernames.indexOf(username);

    // Si ya existía lo eliminamos para ponerlo en la primera posición
    if (indexOfUsername !== -1) {
      this.suggestedUsernames.splice(indexOfUsername, 1);
    }

    // Lo añadimos en la primera posición
    this.suggestedUsernames.unshift(username);

    // Lo guardamos en el almacenamiento local
    localStorage.setItem(GHC.LS_GITHUB_RECENT_USERNAMES, JSON.stringify(this.suggestedUsernames));

    // Notificamos a las suscripciones la nueva lista
    this.suggedUsernamesSubject$.next(this.suggestedUsernames);
  }


  /**
   * Carga / actualización de los repositorios, dependiendo de si el total de repositorios es superior a 100
   * combinará múltiples peticiones a la api y sus resultados, emitiendo una única respuesta a través del observable
   * @emits GitHubRepoInterface[]
   *
   * @param url url de la petición a la api
   * @param total total de elementos a coger
   */
  onUserReposRequest(url: string, total: number = 30): void {
    const username = this.user.name;
    // Contemplamos si es necesario realizar múltiples peticiones, por página podemos pedir máximo 100 valores a la api
    let perPage = 1;
    if (total > perPage) {
      perPage = total;
      if (perPage > 100) perPage = 100;
    }

    // Obtenemos número de páginas
    const pages = [];
    let i = 0;
    while (i * perPage < total) {
      i++;
      pages.push(i);
    }

    // Contemplamos que no tenga ningún repositorio
    if (pages.length <= 0) {
      // Timeout de medio segundo para que el componente se inicialice antes y así evitar el loading infinito
      setTimeout(() => {
        if (username != this.user.name) return;

        this.loadingSubject$.next(false);
        this.repos = [];
        this.userReposSubject$.next(this.repos);
      }, 500);
      return;
    }

    // Generamos un observable con cada página

    const observables: Observable<GitHubRepoInterface[]>[] = [];
    for (let page of pages) {
      const urlWithParams = new URL(url)
      urlWithParams.searchParams.set('per_page', perPage+'')
      urlWithParams.searchParams.set('page', page+'')

      observables.push(
        ajax.get<GitHubRepoInterface[]>(
          urlWithParams.toString()
        ).pipe(
          pluck('response')
        ));
    }

    // Combinamos todos los resultados
    combineLatest([...observables]).subscribe(
    {
      next: results => {
        // Recogemos y juntamos las respuestas
        this.repos = [];
        for (let result of results) {
          this.repos.push(...result);
        }

        // Emitimos la lista actualizada
        this.userReposSubject$.next(this.repos);
      },
      error: this.checkApiErrors
    });

  }

  /**
   * Carga / actualización de los gists, dependiendo de si el total de gists es superior a 100
   * combinará múltiples peticiones a la api y sus resultados, emitiendo una única respuesta a través del observable
   * @emits GitHubGistInterface[]
   *
   * @param url url de la petición a la api
   * @param total total de elementos a coger
   */
  onUserGistsRequest(url: string, total: number = 30): void {
    const username = this.user.name;
    // Contemplamos si es necesario realizar múltiples peticiones, por página podemos pedir máximo 100 valores a la api
    let perPage = 5;
    if (total > perPage) {
      perPage = total;
      if (perPage > 100) perPage = 100;
    }

    // Obtenemos número de páginas
    const pages = [];
    let i = 0;
    while (i * perPage < total) {
      i++;
      pages.push(i);
    }

    // Contemplamos que no tenga ningún repositorio
    if (pages.length <= 0) {
      // Timeout de medio segundo para que el componente se inicialice antes y así evitar el loading infinito
      setTimeout(() => {
        if (username != this.user.name) return;

        this.loadingSubject$.next(false);
        this.gists = [];
        this.userGistsSubject$.next(this.gists);
      }, 500);
      return;
    }

    // Generamos un observable con cada página
    const observables: Observable<GitHubGistInterface[]>[] = [];
    for (let page of pages) {
      const urlWithParams = new URL(url)
      urlWithParams.searchParams.set('per_page', perPage+'')
      urlWithParams.searchParams.set('page', page+'')

      observables.push(
        ajax.get<GitHubGistInterface[]>(
        urlWithParams.toString()
      ).pipe(
        pluck('response')
      ));
    }

    // Combinamos todos los resultados
    forkJoin([...observables]).subscribe(
    {
      next: results => {
        // Recogemos y juntamos las respuestas
        this.gists = []
        for (let result of results) {
          this.gists.push(...result);
        }

        // Emitimos la lista actualizada
        this.userGistsSubject$.next(this.gists);
      },
      error: this.checkApiErrors
    });

  }

  /**
   * Carga / actualiza los follows (ya sean followers o following) y a través del observable emitirá
   * un array con los resultados
   * @emits GitHubBasicUserInterface[]
   *
   * @param url url de la petición a la api
   * @param follows_per_query cuántos seguidores obtener en la petición
   * @param page paginación de la petición
   */
  onUserFollowsRequest(url: string, follows_per_query: number = 5, page: number = 1): void {
    // Generamos un observable con cada página
    const urlWithParams = new URL(url);
    urlWithParams.searchParams.set('per_page', follows_per_query+'');
    urlWithParams.searchParams.set('page', page+'');

    ajax.get<GitHubBasicUserInterface[]>(
      urlWithParams.toString()
    ).pipe(
      pluck('response')
    ).subscribe(
      {
        next: results => {
          this.userFollowsSubject$.next(results);
        },
        error: this.checkApiErrors
      }
    );
  }

}
