import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GitHubRepoInterface } from 'src/app/shared/interfaces/github-repo.interface';
import { GitHubService } from 'src/app/shared/services/github.service';

@Component({
  selector: 'app-git-hub-user-repositories',
  templateUrl: './github-user-repositories.component.html',
  styleUrls: ['./github-user-repositories.component.css']
})
export class GitHubUserRepositoriesComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  reposSubscription$ = new Subscription

  repos: GitHubRepoInterface[] = [];

  constructor(private githubService: GitHubService) { }

  ngOnInit(): void {
    console.log(this.loading);
    
    // Obtenemos los repositorios del usuario
    this.reposSubscription$ = this.githubService.userReposSubject$.subscribe(repos => {
      this.repos = repos;
      this.loading = false;
    })
  }

  ngOnDestroy(): void {
    // Limpiamos suscripciones para evitar pérdidas de memoria y rendimiento
    this.reposSubscription$.unsubscribe();
  }

}
