import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, map, Observable, of, pluck, Subject, tap } from 'rxjs';
import { ajax, AjaxError } from 'rxjs/ajax';

import { GitHubRepoInterface } from 'src/app/shared/interfaces/github-repo.interface';
import { GitHubUserInterface } from 'src/app/shared/interfaces/github-user.interface';

import { GitHubConstants as GHC } from 'src/app/shared/constants/github-constants';
import { SortDirection } from '@angular/material/sort';
import { GitHubGistInterface } from '../interfaces/github-gist.interface';
import { GitHubBasicUserInterface } from '../interfaces/github-basicuser.interface';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {

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
  selectedRepositoryContributors: any = null;

  user?: GitHubUserInterface = {
    login: "DanielTamargo",
    id: 32647764,
    node_id: "MDQ6VXNlcjMyNjQ3NzY0",
    avatar_url: "https://avatars.githubusercontent.com/u/32647764?v=4",
    gravatar_id: "",
    url: "https://api.github.com/users/DanielTamargo",
    html_url: "https://github.com/DanielTamargo",
    followers_url: "https://api.github.com/users/DanielTamargo/followers",
    following_url: "https://api.github.com/users/DanielTamargo/following{/other_user}",
    gists_url: "https://api.github.com/users/DanielTamargo/gists{/gist_id}",
    starred_url: "https://api.github.com/users/DanielTamargo/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/DanielTamargo/subscriptions",
    organizations_url: "https://api.github.com/users/DanielTamargo/orgs",
    repos_url: "https://api.github.com/users/DanielTamargo/repos",
    events_url: "https://api.github.com/users/DanielTamargo/events{/privacy}",
    received_events_url: "https://api.github.com/users/DanielTamargo/received_events",
    type: "User",
    site_admin: false,
    name: "Daniel Tamargo",
    company: null,
    blog: "",
    location: null,
    email: null,
    hireable: null,
    bio: null,
    twitter_username: null,
    public_repos: 34,
    public_gists: 2,
    followers: 0,
    following: 2,
    created_at: "2017-10-09T16:49:15Z",
    updated_at: "2022-03-29T12:54:34Z"
  };
  repos: GitHubRepoInterface[] = [];
  gists: GitHubGistInterface[] = [];
  follows: GitHubBasicUserInterface[] = [];

  typingSubject$ = new Subject<boolean>();
  rateLimitExceededSubject$ = new Subject<boolean>();

  loadingSubject$ = new Subject<boolean>();
  userSubject$ = new BehaviorSubject<GitHubUserInterface>(this.user);
  userReposSubject$ = new Subject<GitHubRepoInterface[]>();
  userGistsSubject$ = new Subject<GitHubGistInterface[]>();
  userFollowsSubject$ = new Subject<GitHubBasicUserInterface[]>();
  usernameSubject$ = new BehaviorSubject(this.username);

  userSearchError$ = new Subject<string>();

  constructor() { }

  checkApiRateLimitExceeded(err: AjaxError) {
    if (err.status == 403 && err.response.message.includes('limit exceeded')) {
      this.rateLimitExceededSubject$.next(true);
    }
  }

  // Recibe un username y lo busca, si lo encuentra, lo manda
  onUserSearch(username: string) {
    this.typingSubject$.next(true);
    this.username = username;
    
    const url = GHC.BASE_URL + GHC.USER.replace(GHC.KEY_USERNAME, username);
    ajax<GitHubUserInterface>(url)
      .pipe(
        pluck('response'), 
        tap(() => { // Utilizamos el tap para notificar que ya no está escribiendo
          this.typingSubject$.next(false);
      })) // <- si trabajamos con ajax de rxjs en vez de httpclient lo recibimos distinto
      .subscribe({
        next: user => {
          this.onUserResult(user);
        },
        error: (err: AjaxError) => { // TODO
          if (err.status == 404) { // No encontrado
            this.userSubject$.next(null);
            this.userSearchError$.next("The user '" + username + "' for does not exist 😢");
            this.typingSubject$.next(false);
          }
          this.checkApiRateLimitExceeded(err);
        }
      });
  }

  // Recibe el usuario, lo guarda como variable y lo emite a sus observers
  onUserResult(user: GitHubUserInterface): void {
    this.userSubject$.next(user);
    this.user = user;

    // Notificamos spinner loading
    if (this.selectedSection > 0) {
      this.loadingSubject$.next(true);
    }

    // Utilizamos if else porque el rendimiento es mejor que switch y buscamos la respuesta más rápida
    if (this.selectedSection == 1) { // Actualizamos repos
      this.repos = [];
      this.onUserReposRequest(user.url + "/repos", user.public_repos);
    } else if (this.selectedSection == 2) { // Actualizamos gists
      this.gists = [];
      this.onUserGistsRequest(user.url + "/gists", user.public_gists);
    } else if (this.selectedSection == 3) { // Actualizamos followers
      this.follows = [];
      this.onUserFollowsRequest(user.url + "/followers", 4, 1);
    } else { // Actualizamos following
      this.follows = [];
      this.onUserFollowsRequest(user.url + "/following", 4, 1);
    }
  }


  // Carga / Actualización de repositorios
  onUserReposRequest(url: string, total: number = 30): void {
    console.log('API Repos: ' + (this.user.name ? this.user.name : this.user.login));
    
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
        this.loadingSubject$.next(false);
        this.repos = [];
        this.userReposSubject$.next(this.repos);
      }, 500);
      return;
    }
    
    // Generamos un observable con cada página
    const observables: Observable<GitHubRepoInterface[]>[] = [];
    for (let page of pages) {
      observables.push(ajax<GitHubRepoInterface[]>({
        url: url,
        queryParams: {
          per_page: perPage,
          page: page
        }
      }).pipe(pluck('response'))); 
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
      error: (err: AjaxError) => {
        this.checkApiRateLimitExceeded(err);
      }
    });

  }

  // Carga / Actualización de gists
  onUserGistsRequest(url: string, total: number = 30): void {
    console.log('API Gists: ' + (this.user.name ? this.user.name : this.user.login));

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
        this.loadingSubject$.next(false);
        this.gists = [];
        this.userGistsSubject$.next(this.gists);
      }, 500);
      return;
    }
    
    // Generamos un observable con cada página
    const observables: Observable<GitHubGistInterface[]>[] = [];
    for (let page of pages) {
      observables.push(ajax<GitHubGistInterface[]>({
        url: url,
        queryParams: {
          per_page: perPage,
          page: page
        }
      }).pipe(pluck('response'))); 
    }
    
    // Combinamos todos los resultados
    combineLatest([...observables]).subscribe(
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
      error: (err: AjaxError) => {
        this.checkApiRateLimitExceeded(err);
      }
    });

  }

  // Carga / actualización de follows (tanto followers, como followings (como recientes))
  onUserFollowsRequest(url: string, follows_per_query: number = 5, page: number = 1): void {
    console.log('API Follows: ' + (this.user.name ? this.user.name : this.user.login));

    // Generamos un observable con cada página
    ajax<GitHubBasicUserInterface[]>({
        url: url,
        queryParams: {
          per_page: follows_per_query,
          page: page
        }
    }).pipe(pluck('response')).subscribe(
      {
        next: results => {
          this.userFollowsSubject$.next(results);
        },
        error: (err: AjaxError) => {
          this.checkApiRateLimitExceeded(err);
        }
      }
    ); 
  }

}
