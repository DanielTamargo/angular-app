import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import  {MatTableDataSource } from '@angular/material/table';

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
  repos: GitHubRepoInterface[] = [];
  reposSubscription$ = new Subscription

  // Tabla Angular Material
  displayedColumns: string[] = ['name', 'created_at', 'updated_at', 'watchers', 'size'];
  dataSource = new MatTableDataSource<GitHubRepoInterface>(this.repos);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  paginatorConfigurado = false;

  constructor(private githubService: GitHubService) { }

  ngOnInit(): void {
    // Obtenemos los repositorios del usuario
    this.reposSubscription$ = this.githubService.userReposSubject$.subscribe(repos => {
      this.repos = repos;
      this.loading = false;     

      // Configuramos el datasource de la tabla
      this.dataSource = new MatTableDataSource(this.repos);

      // Configuramos la paginación de la tabla
      if (!this.paginatorConfigurado) {
        this.paginatorConfigurado = true;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  ngOnDestroy(): void {
    // Limpiamos suscripciones para evitar pérdidas de memoria y rendimiento
    this.reposSubscription$.unsubscribe();
  }

}
