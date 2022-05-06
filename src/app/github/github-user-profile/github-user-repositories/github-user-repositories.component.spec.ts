import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BehaviorSubject, Observable, of, Subject, throwError } from "rxjs";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { SizeFormatterPipe } from "src/app/shared/pipes/size-formatter.pipe";
import { GitHubRepoInterface } from "../../interfaces/github-repo.interface";
import { GitHubService } from "../../services/github.service";
import { GitHubUserRepositoriesComponent } from "./github-user-repositories.component";
import { GitHubTestHelper } from "../../github-test-helper";
import { GitHubRepositoryDialogComponent } from "./github-repository-dialog/github-repository-dialog.component";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { ajax, AjaxResponse } from "rxjs/ajax";

describe('GitHubUserRepositoriesComponent', () => {
  let component: GitHubUserRepositoriesComponent
  let fixture: ComponentFixture<GitHubUserRepositoriesComponent>
  let ghHelper: GitHubTestHelper<GitHubUserRepositoriesComponent>
  let gitHubMockedService: any

  beforeEach(fakeAsync(() => {
    // Configuramos el mock del servicio
    gitHubMockedService = jasmine.createSpyObj('GitHubService', [''])
    gitHubMockedService.selectedRepository = GitHubTestHelper.dummyGitHubRepos[0]
    gitHubMockedService.selectedRepositoryContributors = GitHubTestHelper.dummyGithubRepoContributors

    gitHubMockedService.repos = GitHubTestHelper.dummyGitHubRepos
    gitHubMockedService.userReposSubject$ = new BehaviorSubject<GitHubRepoInterface[]>(gitHubMockedService.repos)
    gitHubMockedService.loadingSubject$ = new Subject<boolean>()

    gitHubMockedService.pageIndex = 0
    gitHubMockedService.filtro_active = 'updated_at'
    gitHubMockedService.filtro_direction = 'desc'

    TestBed.configureTestingModule({
      imports: [
        MatPaginatorModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        MatChipsModule,
        MatDialogModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        GitHubUserRepositoriesComponent,
        GitHubRepositoryDialogComponent,
        SizeFormatterPipe
      ],
      providers: [
        // Override del GitHubService por el GitHubMockedService
        { provide: GitHubService, useValue: gitHubMockedService }
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GitHubUserRepositoriesComponent)
    component = fixture.debugElement.componentInstance
    ghHelper = new GitHubTestHelper(fixture)
  })

  describe('Repositories Table', () => {
    let repoUrl = 'https://github.com/DanielTamargo/angular-app'

    it('should create the table AND contain 2 repos', () => {
      // Comprobar que existen repositorios añadidos a la tabla
      fixture.detectChanges()
      expect(ghHelper.countElements('tbody tr')).toEqual(2)
    })

    it("first repo's link should be '" + repoUrl + "'", () => {
      fixture.detectChanges()
      const tr_repos = ghHelper.getAllElements('tbody tr')
      expect((tr_repos[0].children[0].children[0].nativeElement as HTMLLinkElement).href).toBe(repoUrl)
    })

    it("first repo's name should be 'angular-app'", () => {
      fixture.detectChanges()
      const tr_repos = ghHelper.getAllElements('tbody tr')
      expect((tr_repos[0].children[0].children[0].nativeElement as HTMLElement).innerHTML).toBe('angular-app')
    })

    it("should call 'onSortChange' method once", () => {
      fixture.detectChanges()
      const onSortChangeSpy = spyOn(component, 'onSortChange')
      ghHelper.getFirstElement('.mat-sort-header-content')?.nativeElement?.click()
      expect(onSortChangeSpy).toHaveBeenCalledTimes(1)
    })

    /* AUTOMATIZAR TESTEOS DE ORDENAR LA TABLA */
    const automateSortTets = [
      { key: 'created at', repo: 'angular-app' },
      { key: 'updated at', repo: 'angular-app' },
      { key: 'size', repo: 'arkanoid-unity' },
    ]

    for (const sortTest of automateSortTets) {
      it(`after sorting list by ${sortTest.key} ASC first repo's name should NOT be '${sortTest.repo}'`, () => {
        fixture.detectChanges()

        const sorts = ghHelper.getAllElements('.mat-sort-header-content')
        const sortSize =
          sorts.find(
            sort => (sort.nativeNode as HTMLElement).innerText.toLocaleLowerCase().trim() == sortTest.key
          ).nativeElement as HTMLButtonElement

        // Updated at es el filtro por defecto, si es distinto lo aplicamos
        if (sortTest.key != 'updated at') sortSize.click()
        sortSize.click()

        fixture.detectChanges()
        const tr_repos = ghHelper.getAllElements('tbody tr')
        const tableFirstRepoName = (tr_repos[0].children[0].children[0].nativeElement as HTMLElement).innerText.trim()
        expect(tableFirstRepoName == sortTest.repo).toBeFalse()
      })

      it(`after sorting list by ${sortTest.key} DESC first repo's name should be '${sortTest.repo}'`, () => {
        fixture.detectChanges()

        const sorts = ghHelper.getAllElements('.mat-sort-header-content')
        const sortSize =
          sorts.find(
            sort => (sort.nativeNode as HTMLElement).innerText.toLocaleLowerCase().trim() == sortTest.key
          ).nativeElement as HTMLButtonElement

        // Updated at es el filtro por defecto, si es distinto lo aplicamos
        if (sortTest.key != 'updated at') sortSize.click()

        fixture.detectChanges()
        const tr_repos = fixture.debugElement.queryAll(By.css('tbody tr'))
        const tableFirstRepoName = (tr_repos[0].children[0].children[0].nativeElement as HTMLElement).innerText.trim()
        expect(tableFirstRepoName == sortTest.repo).toBeTrue()
      })
    }

    /*it("should hide or show created_at and updated_at when window innerWidth is lower or greater than 700", () => {
      fixture.detectChanges()

      const sorts = ghHelper.getAllElements('.mat-sort-header-content')
      const sortCreatedAt = sorts.find(sort => (sort.nativeNode as HTMLElement).innerText.toLocaleLowerCase().trim() == 'created at')
      const sortUpdatedAt = sorts.find(sort => (sort.nativeNode as HTMLElement).innerText.toLocaleLowerCase().trim() == 'updated at')

      console.log(window.innerWidth);

      // Si la ventana es inferior a 700, estarán ocultos, si es mayor, se mostrarán
      // Utilizo 725 porque Karma crea la instancia del componente dentro de un div con overflow-y scrollbar visible
      if (window.innerWidth < 726) {
        expect(sortCreatedAt.nativeElement).toBeFalsy()
        expect(sortUpdatedAt.nativeElement).toBeFalsy()
      } else {
        expect(sortCreatedAt.nativeElement).toBeTruthy()
        expect(sortUpdatedAt.nativeElement).toBeTruthy()
      }
    })*/
  })

  describe('Paginator', () => {
    beforeEach(() => {
      fixture.detectChanges()
    })

    it("should create the paginator", () => {
      const paginator = ghHelper.getFirstElement('mat-paginator')
      expect(paginator).toBeTruthy()
    })

    it("should 'onPaginateChange' method should update service's paginator index", () => {
      const pageIndex = 2;
      component.onPaginateChange({ length: 20, pageIndex: pageIndex, pageSize: 5, previousPageIndex: 0})
      expect(gitHubMockedService.pageIndex).toEqual(pageIndex)
    })
  })

  describe('Open Repository Dialog', () => {
    beforeEach(() => {
      fixture.detectChanges()
    })

    it("should trigger 'openRepositoryDialog' method ONCE and with specific repo", () => {
      const spyOpenDialog = spyOn(component, 'openRepositoryDialog')
      const linkInfo = ghHelper.getFirstElement('.link-info')
      linkInfo.triggerEventHandler('click', null)
      fixture.detectChanges()

      //expect(spyOpenDialog).toHaveBeenCalledOnceWith(GitHubTestHelper.githubRepos[0])
      //  Lo divido en dos expects porque el debug se complica al ser objetos grandes, así sabemos qué parte falla al momento
      expect(spyOpenDialog).toHaveBeenCalledTimes(1)
      expect(spyOpenDialog).toHaveBeenCalledWith(GitHubTestHelper.dummyGitHubRepos[0])
    })

    it("should get error when trying to get response from ajax get and won't open dialog", () => {
      gitHubMockedService.selectedRepositoryContributors = null

      const linkInfo = ghHelper.getFirstElement('.link-info')
      let ajaxError$ = throwError(() => {
        const error: any = new Error('404 Not found')
        error.status = 404
        return error;
      })
      spyOn(ajax, 'get').and.returnValue(ajaxError$)
      linkInfo.triggerEventHandler('click', null)
      fixture.detectChanges()

      //expect(spyOpenDialog).toHaveBeenCalledOnceWith(GitHubTestHelper.githubRepos[0])
      //  Lo divido en dos expects porque el debug se complica al ser objetos grandes, así sabemos qué parte falla al momento
      expect(gitHubMockedService.selectedRepositoryContributors).toEqual(null)
    })

    it("should create a dialog with repository info and contributtors", () => {
      /* Mockeando la creación del Dialogo y el contenido de la función (menos fiable y útil el test)
      let dialog: MatDialog
      dialog = TestBed.inject(MatDialog)
      const spyOpenDialog = spyOn(component, 'openRepositoryDialog')
      const selectedRepoContributors = GitHubTestHelper.githubRepoContributors

      spyOpenDialog.and.callFake((repo) => {
        gitHubMockedService.selectedRepository = repo
        gitHubMockedService.selectedRepositoryContributors = selectedRepoContributors
        dialog.open(GitHubRepositoryDialogComponent)
      })
      */

      /* Mockeando la respuesta de Ajax de la cual solo nos interesa response ya que el pluck se ejecuta sobre este */
      jasmine.createSpyObj(AjaxResponse, ['response'])
      const ajaxResponse: Observable<AjaxResponse<GitHubRepoInterface[]>> | Observable<any> = of({ response: GitHubTestHelper.dummyGithubRepoContributors })
      spyOn(ajax, 'get').and.returnValue(ajaxResponse)

      const selectedRepo = GitHubTestHelper.dummyGitHubRepos[0]
      component.openRepositoryDialog(selectedRepo)
      fixture.detectChanges()

      expect(gitHubMockedService.selectedRepository).toEqual(selectedRepo)
      expect(gitHubMockedService.selectedRepositoryContributors).toEqual(GitHubTestHelper.dummyGithubRepoContributors)
      expect(ajax.get).toHaveBeenCalledWith(selectedRepo.contributors_url)
      expect(document.querySelector('app-github-repository-dialog')).toBeTruthy()
    })
  })

  it("should instance component succesfully when repos quantity is 0", () => {
    component.firstLoad = false
    component.repos_qt = 0
    fixture.detectChanges()
    expect(component.loading).toBe(false)
  })

  describe('Loading status', () => {
    beforeEach(() => {
      gitHubMockedService.userReposSubject$ = new BehaviorSubject<GitHubRepoInterface[]>([])
    })

    it("should set loading to true when retrieves 0 gists and it's first load ", () => {
      component.firstLoad = true
      fixture.detectChanges()
      expect(component.loading).toBe(true)
    })

    it("should set loading to false retrieves 0 gists but it's not first load", () => {
      component.firstLoad = false
      fixture.detectChanges()
      expect(component.loading).toBe(false)
    })
  })

})
