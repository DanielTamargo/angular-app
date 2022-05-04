import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';

import { catchError, pluck, Subscription } from 'rxjs';
import { GitHubRepoInterface } from 'src/app/github/interfaces/github-repo.interface';
import { GitHubService } from 'src/app/github/services/github.service';
import { MatDialog } from '@angular/material/dialog';
import { GitHubRepositoryDialogComponent } from './github-repository-dialog/github-repository-dialog.component';
import { ajax } from 'rxjs/ajax';
import { GitHubContributorInterface } from '../../interfaces/github-contributor.interface';

@Component({
  selector: 'app-github-user-repositories',
  templateUrl: './github-user-repositories.component.html',
  styleUrls: ['./github-user-repositories.component.scss']
})
export class GitHubUserRepositoriesComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('repos_qt') repos_qt: number;

  // Boolean para mostrar/ocultar spinner
  loading: boolean = true;
  firstLoad: boolean = true;
  // Configuración paginator
  pageIndex: number = 0;
  // Configuración orden
  filtro_active: string           = 'updated_at';
  filtro_direction: SortDirection = 'desc';

  // Datos
  repos: GitHubRepoInterface[] = [];
  reposSubscription$ = new Subscription;
  loadingSubscription$ = new Subscription;

  // Tabla Angular Material
  displayedColumns: string[] = [
    'name',
    'created_at',
    'updated_at',
    'size',
    'details',
  ];
  dataSource = new MatTableDataSource<GitHubRepoInterface>(this.repos);
  // Ordenar tabla
  @ViewChild(MatSort) sort: MatSort;
  // Paginación
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) matTable: MatTable<any>;

  constructor(private githubService: GitHubService, private dialog: MatDialog) { }

  public ngOnInit(): void {
    // Obtenemos los repositorios del usuario
    this.reposSubscription$ = this.githubService.userReposSubject$.subscribe(repos => {
      this.repos = repos;
      if (this.firstLoad) this.firstLoad = false;
      else this.loading = false;

      if (repos.length > 0) this.loading = false;

      // Volcamos datos en el datasource de la tabla
      this.dataSource = new MatTableDataSource(this.repos);

      // Repetimos configuración para que se enlace correctamente
      // Configuramos el sorting de la tabla
      this.dataSource.sort = this.sort;
      // Configuramos la paginación de la tabla
      this.dataSource.paginator = this.paginator;
    });

    // Nos suscribimos a la posibilidad de que cambie de usuario y por ende haya que recargar
    this.loadingSubscription$ = this.githubService.loadingSubject$.subscribe(loading => {
      this.loading = loading;
    })

    // Consultamos si el usuario ya había navegado y utilizado el componente y se había ido pero luego vuelve
    this.pageIndex = this.githubService.pageIndex;
    this.filtro_active = this.githubService.filtro_active;
    this.filtro_direction = this.githubService.filtro_direction;

    // Si sabemos de antemano que notiene repositorios, cancelamos la carga
    if (this.repos_qt <= 0) {
      this.loading = false;
    }
  }

  public ngAfterViewInit(): void {
    // Configuramos el sorting de la tabla
    this.dataSource.sort = this.sort;

    // Configuramos la paginación de la tabla
    this.dataSource.paginator = this.paginator;
  }

  public ngOnDestroy(): void {
    // Limpiamos suscripciones para evitar pérdidas de memoria y rendimiento
    this.reposSubscription$.unsubscribe();
    this.loadingSubscription$.unsubscribe();
  }

  // Función llamada cuando se cambie de página en la paginación
  public onPaginateChange(pageEvent: PageEvent): void {
    // Actualizamos en el servicio por si navega entre componentes mantener integridad
    this.githubService.pageIndex = pageEvent.pageIndex;
  }

  // Función llamada cuando utilice el sorting
  public onSortChange(sortState: Sort): void {
    // Al reordenar, volvemos a la primera página
    this.paginator.firstPage();

    // Actualizamos en el servicio por si navega entre componentes mantener integridad
    this.githubService.filtro_active    = sortState.active;
    this.githubService.filtro_direction = sortState.direction;
  }

  // Lanza un modal con la información detallada del repositorio
  public openRepositoryDialog(repo: GitHubRepoInterface) {
    this.githubService.selectedRepository = repo;

    // TODO mostrar spinner modal

    // Obtenemos los contributors como información extra
    ajax.get<GitHubContributorInterface[]>(repo.contributors_url)
    .pipe(pluck('response'), catchError(() => {
      throw new Error('Contributors request error')
    }))
    .subscribe(
      {
        next: contributors => {
          this.githubService.selectedRepositoryContributors = contributors;
          this.dialog.open(GitHubRepositoryDialogComponent);

          // TODO quitar spinner modal
        },
        error: (err) => {
          // TODO quitar spinner modal
        }
      }
    );
  }

}
