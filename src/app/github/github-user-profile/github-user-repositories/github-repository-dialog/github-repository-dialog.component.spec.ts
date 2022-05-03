import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { GitHubRepositoryDialogComponent } from "./github-repository-dialog.component";
import { GitHubTestHelper } from "src/app/github/github-test-helper";
import { GitHubService } from "src/app/github/services/github.service";
import { SizeFormatterPipe } from "src/app/shared/pipes/size-formatter.pipe";
import { MatChipsModule } from "@angular/material/chips";


describe('GitHubRepositoryDialogComponent', () => {
  let component: GitHubRepositoryDialogComponent
  let fixture: ComponentFixture<GitHubRepositoryDialogComponent>

  let ghHelper: GitHubTestHelper<GitHubRepositoryDialogComponent>
  let gitHubMockedService: any

  beforeEach(fakeAsync(() => {
    // Configuramos el mock del servicio
    gitHubMockedService = jasmine.createSpyObj('GitHubService', [''])
    gitHubMockedService.selectedRepository = GitHubTestHelper.githubRepos[0]
    gitHubMockedService.selectedRepositoryContributors = GitHubTestHelper.githubRepoContributors

    // Configuramos el módulo que utilizará en la fase de testing
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
        GitHubRepositoryDialogComponent,
        SizeFormatterPipe, 
      ],
      providers: [
        // Override del GitHubService por el GitHubMockedService
        { provide: GitHubService, useValue: gitHubMockedService },
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GitHubRepositoryDialogComponent)
    component = fixture.debugElement.componentInstance
    ghHelper = new GitHubTestHelper(fixture)
    fixture.detectChanges()
  })

  it('should load dialog with repository info correctly', () => {
    expect(component.repo).toBeTruthy()
    expect(ghHelper.getFirstElement('.github-repository-dialog')).toBeTruthy()
    expect(ghHelper.getFirstElement('h2').nativeElement.innerText.toLowerCase().trim()).toEqual('angular-app')
  })

  it('should have more than one contributtor', () => {
    expect(component.repoContributors.length).toBeGreaterThan(0)    
  })
  
  it('should have commits', () => {
    expect(component.totalCommits).toBeGreaterThan(0)
  })

})

/* 
class GitHubMockedService {
  userReposSubject$ = new BehaviorSubject<GitHubRepoInterface[]>(this.repos)
  loadingSubject$ = new BehaviorSubject<boolean>(false)

  pageIndex: number = 0
  filtro_active: string = 'updated_at'
  filtro_direction: SortDirection = 'desc'
} 
*/