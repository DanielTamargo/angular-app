import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BehaviorSubject } from "rxjs";

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
import { ajax } from "rxjs/ajax";

describe('GitHubUserRepositoriesComponent', () => {
  let component: GitHubUserRepositoriesComponent
  let fixture: ComponentFixture<GitHubUserRepositoriesComponent>
  let ghHelper: GitHubTestHelper<GitHubUserRepositoriesComponent>
  let gitHubMockedService: any

  beforeEach(fakeAsync(() => {
    // Configuramos el mock del servicio
    gitHubMockedService = jasmine.createSpyObj('GitHubService', [''])
    gitHubMockedService.selectedRepository = GitHubTestHelper.githubRepos[0]
    gitHubMockedService.selectedRepositoryContributors = GitHubTestHelper.githubRepoContributors

    gitHubMockedService.repos = GitHubTestHelper.githubRepos
    gitHubMockedService.userReposSubject$ = new BehaviorSubject<GitHubRepoInterface[]>(gitHubMockedService.repos)
    gitHubMockedService.loadingSubject$ = new BehaviorSubject<boolean>(false)
  
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
    it('should create the table AND contain 2 repos', () => {
      // Comprobar que existen repositorios añadidos a la tabla
      fixture.detectChanges()
      expect(ghHelper.countElements('tbody tr')).toEqual(2)
    })
  
    it("first repo's link should be 'https://github.com/DanielTamargo/angular-app'", () => {
      fixture.detectChanges()
      const tr_repos = ghHelper.getAllElements('tbody tr')
      expect((tr_repos[0].children[0].children[0].nativeElement as HTMLLinkElement).href).toBe('https://github.com/DanielTamargo/angular-app')
    })
  
    it("first repo's name should be 'angular-app'", () => {
      fixture.detectChanges()
      const tr_repos = ghHelper.getAllElements('tbody tr')
      expect((tr_repos[0].children[0].children[0].nativeElement as HTMLElement).innerHTML).toBe('angular-app')
    })
  
    it("after resorting list first repo's name should NOT be 'angular-app'", () => {
      // Modificamos el ancho de la pantalla porque si es bajo ocultará la columna created_at
      // https://jasmine.github.io/tutorials/spying_on_properties
      spyOnProperty(window, 'innerWidth').and.returnValue(800)
      window.dispatchEvent(new Event('resize'))
      
      fixture.detectChanges() // ngOnInit
  
      const sorts = ghHelper.getAllElements('.mat-sort-header-content')
      const sortCreatedAt = 
        sorts.find(
          sort => (sort.nativeNode as HTMLElement).innerText.toLocaleLowerCase() == 'created at'
        ).nativeElement as HTMLButtonElement
      
      sortCreatedAt.click() // descendente
      sortCreatedAt.click() // ascendente
  
      fixture.detectChanges() // detectar cambios producidos por los clicks
  
      const tr_repos = fixture.debugElement.queryAll(By.css('tbody tr'))
      expect((tr_repos[0].children[0].children[0].nativeElement as HTMLElement).innerText == 'angular-app').toBeFalse()
      // tr_repos[0].children[0].children[0].innerText para acceder a la primera fila, al primer TD y al <a> que contendrá el texto
    })
  })

/*   beforeEach(function() {
    jasmine.Ajax.install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it("should create a dialog with repository info", fakeAsync(() => {

    fixture.detectChanges()
    component.openRepositoryDialog(GitHubTestHelper.githubRepos[0])
    tick(50)
    
    fixture.detectChanges()
    debugger

  })) */
  
  /*
    ajax<GitHubRepoInterface[]>(repo.contributors_url)
    .pipe(pluck('response'))
    .subscribe(
      {
        next: contributors => {
          this.githubService.selectedRepositoryContributors = contributors;
          this.dialog.open(GitHubRepositoryDialogComponent);
        },
        error: (err) => {
        }
      }
    ); */
})