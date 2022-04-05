import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GitHubRepoInterface } from 'src/app/shared/interfaces/github-repo.interface';
import { GitHubUserInterface } from 'src/app/shared/interfaces/github-user.interface';
import { GitHubService } from 'src/app/shared/services/github.service';

import { GitHubConstants as GHC } from 'src/app/shared/constants/github-constants';

@Component({
  selector: 'app-github-user-profile',
  templateUrl: './github-user-profile.component.html',
  styleUrls: ['./github-user-profile.component.css']
})
export class GitHubUserProfileComponent implements OnInit, OnDestroy {
  loading = false;
  lastCase: number = -1;

  CASE_REPOS     = GHC.CASE_REPOS;
  CASE_GISTS     = GHC.CASE_GISTS;
  CASE_FOLLOWERS = GHC.CASE_FOLLOWERS;
  CASE_FOLLOWING = GHC.CASE_FOLLOWING;


  user?: GitHubUserInterface;
  userRepos?: GitHubRepoInterface[];

  userSubscription$ = new Subscription;

  error?: any;

  constructor(private gitHubService: GitHubService) { }

  ngOnInit(): void {
    // Obtenemos el usuario cargado y nos suscribimos a los cambios
    this.userSubscription$ = this.gitHubService.userSubject$.subscribe(user => {
      this.user = user;
    });
  }

  /**
   * Dependiendo de la selección mostrará un componente u otro con la información correspondiente
   * Activará el spinner de carga, que será deshabilitado una vez se carguen los datos (o surja algún error)
   * 
   * @param selectedElement elemento seleccionado
   * @param caseNumber opción seleccionada
   * @returns 
   */
  onChangeDisplayInfoSelection(selectedElement: HTMLElement, caseNumber: number): void {
    // Evitamos el spam al seleccionar múltiples veces el mismo botón
    if (this.lastCase == caseNumber) return;
    
    this.lastCase = caseNumber;
    this.loading = true;

    // En el DOM actualizamos el elemento activo
    document.querySelectorAll('.stats.active').forEach(elm => {
      elm.classList.remove('active');
    });

    selectedElement.classList.add('active');

    switch (caseNumber) {
      case 1: // Repos
        this.gitHubService.onUserReposRequest(this.user.url + '/repos');
        break;
      case 2: // Gists

        break;
      case 3: // Followers

        break;
      case 4: // Al default
      default: // Following

    }

    // Realizamos la petición a la API

  }

  ngOnDestroy(): void {
    // Limpiamos suscripciones para evitar leaks de memoria
    this.userSubscription$.unsubscribe();
  }

}
