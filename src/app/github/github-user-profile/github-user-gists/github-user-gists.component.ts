import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { GitHubGistInterface } from 'src/app/shared/interfaces/github-gist.interface';
import { Subscription } from 'rxjs';
import { GitHubService } from 'src/app/shared/services/github.service';

@Component({
  selector: 'app-github-user-gists',
  templateUrl: './github-user-gists.component.html',
  styleUrls: ['./github-user-gists.component.css']
})
export class GitHubUserGistsComponent implements OnInit, AfterViewInit, OnDestroy {

  // Comportamiento muy similar al de los repositorios, pero más simple (sin modal ni peticiones extra).

  @Input('gists_qt') gists_qt: number;

  // Boolean para mostrar/ocultar spinner
  loading: boolean = true;
  // Configuración paginator
  pageIndex: number = 0;
  // Configuración orden
  filtro_active: string           = 'updated_at';
  filtro_direction: SortDirection = 'desc';

  // Datos
  gists: GitHubGistInterface[] = [];
  gistsSubscription$ = new Subscription;

  // Tabla Angular Material
  displayedColumns: string[] = [
    'name', 
    'created_at', 
    'updated_at', 
  ];
  dataSource = new MatTableDataSource<GitHubGistInterface>(this.gists);
  // Ordenar tabla
  @ViewChild(MatSort) sort: MatSort;
  // Paginación
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) matTable: MatTable<any>;

  constructor(private githubService: GitHubService) { }

  ngOnInit(): void {
    // Obtenemos los repositorios del usuario
    this.gistsSubscription$ = this.githubService.userGistsSubject$.subscribe(gists => {
      this.gists = gists;
      this.loading = false;     

      // Volcamos datos en el datasource de la tabla
      this.dataSource = new MatTableDataSource(this.gists);

      // Repetimos configuración para que se enlace correctamente
      // Configuramos el sorting de la tabla
      this.dataSource.sort = this.sort;
      // Configuramos la paginación de la tabla
      this.dataSource.paginator = this.paginator;      
    });

    // Consultamos si el usuario ya había navegado y utilizado el componente y se había ido pero luego vuelve
    this.pageIndex = this.githubService.pageIndex;
    this.filtro_active = this.githubService.filtro_active;
    this.filtro_direction = this.githubService.filtro_direction;

    // Si sabemos de antemano que notiene repositorios, cancelamos la carga
    if (this.gists_qt <= 0) {
      this.loading = false;
    }
  }

  ngAfterViewInit(): void {
    // Configuramos el sorting de la tabla
    this.dataSource.sort = this.sort;

    // Configuramos la paginación de la tabla
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    // Limpiamos suscripciones para evitar pérdidas de memoria y rendimiento
    this.gistsSubscription$.unsubscribe();
  }

  // Función llamada cuando se cambie de página en la paginación
  onPaginateChange(pageEvent: PageEvent): void {
    // Actualizamos en el servicio por si navega entre componentes mantener integridad
    this.githubService.pageIndex = pageEvent.pageIndex;
  }

  // Función llamada cuando utilice el sorting
  onSortChange(sortState: Sort): void {
    // Actualizamos en el servicio por si navega entre componentes mantener integridad
    this.githubService.filtro_active    = sortState.active;
    this.githubService.filtro_direction = sortState.direction;
  }

}
