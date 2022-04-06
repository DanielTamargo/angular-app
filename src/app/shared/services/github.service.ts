import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, map, Observable, of, pluck, Subject } from 'rxjs';
import { ajax } from 'rxjs/ajax';

import { GitHubRepoInterface } from 'src/app/shared/interfaces/github-repo.interface';
import { GitHubUserInterface } from 'src/app/shared/interfaces/github-user.interface';

import { GitHubConstants as GHC } from 'src/app/shared/constants/github-constants';

@Injectable({
  providedIn: 'root'
})
export class GitHubService {

  username: string = '';

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
    public_gists: 0,
    followers: 0,
    following: 2,
    created_at: "2017-10-09T16:49:15Z",
    updated_at: "2022-03-29T12:54:34Z"
  };
  repos: GitHubRepoInterface[] = [];

  userSubject$ = new BehaviorSubject(this.user);
  userReposSubject$ = new Subject<GitHubRepoInterface[]>();
  usernameSubject$ = new BehaviorSubject(this.username);

  constructor(private http: HttpClient) { }

  // Recibe un username y lo busca, si lo encuentra, lo manda
  onUserSearch(username: string) {
    this.username = username;
    
    const url = GHC.BASE_URL + GHC.USER.replace(GHC.KEY_USERNAME, username);
    ajax<GitHubUserInterface>(url)
      .pipe(pluck('response')) // <- si trabajamos con ajax de rxjs en vez de httpclient lo recibimos distinto
      .subscribe({
        next: this.onUserResult,
        error: err => { // TODO
          console.log(err);
        }
      });
  }

  // Recibe el usuario, lo guarda como variable y lo emite a sus observers
  onUserResult(user: GitHubUserInterface): void {
    // Cargar todo (?) o solo repos (?) Plantear este apartado
    console.log(user);
  }


  // Carga / Actualización de repositorios
  onUserReposRequest(url: string, total: number = 30): void {
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
    
    // Generamos un observable con cada página
    const observables: Observable<GitHubRepoInterface[]>[] = [];
    for (let page of pages) {
      observables.push(ajax<GitHubRepoInterface[]>(url + '?per_page=' + perPage + '&page=' + page).pipe(pluck('response'))); 
    }
    
    // Combinamos todos los resultados
    // TODO implementar errores
    combineLatest([...observables]).subscribe(results => {
      this.repos = []
      for (let result of results) {
        this.repos.push(...result);
      }
      this.userReposSubject$.next(this.repos);
    })
  }

}
