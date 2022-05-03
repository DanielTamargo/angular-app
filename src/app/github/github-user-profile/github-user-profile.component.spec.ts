import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { GitHubUserProfileComponent } from "./github-user-profile.component";
import { GitHubService } from "../services/github.service";
import { GitHubTestHelper } from "../github-test-helper";
import { GitHubConstants } from "../constants/github-constants";
import { of } from "rxjs";


describe('GitHubUserProfileComponent', () => {
  let component: GitHubUserProfileComponent
  let fixture: ComponentFixture<GitHubUserProfileComponent>

  let ghHelper: GitHubTestHelper<GitHubUserProfileComponent>
  let gitHubMockedService: any

  beforeEach(fakeAsync(() => {
    // Configuramos el mock del servicio
    gitHubMockedService = jasmine.createSpyObj('GitHubService', [''])
    gitHubMockedService.userSubject$ = of(GitHubTestHelper.githubUser)
    gitHubMockedService.typingSubject$ = of(true)
    gitHubMockedService.userFollowsSubject$ = of([])
    gitHubMockedService.userSearchError$ = of(null)
    gitHubMockedService.selectedSection = 0

    // Configuramos el módulo que utilizará en la fase de testing
    TestBed.configureTestingModule({
      imports: [ 
        MatPaginatorModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        BrowserAnimationsModule,
      ],
      declarations: [ 
        GitHubUserProfileComponent, 
      ],
      providers: [
        // Override del GitHubService por el GitHubMockedService
        { provide: GitHubService, useValue: gitHubMockedService },
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(GitHubUserProfileComponent)
    component = fixture.debugElement.componentInstance

    // Instanciamos el helper
    ghHelper = new GitHubTestHelper(fixture)
  })

  
  describe('Followings / Followers check', () => {
    beforeEach(() => {
      fixture.detectChanges()
      component.loading = true
    })

    it("should display the spinner when loading followers", () => {
      component.lastCase = GitHubConstants.CASE_FOLLOWERS
      fixture.detectChanges()
    })

    it("should display the spinner when loading followings", () => {
      component.lastCase = GitHubConstants.CASE_FOLLOWING
      fixture.detectChanges()
    })

    afterEach(() => {
      expect(ghHelper.getFirstElement('.spinner-border.text-primary')).toBeTruthy()
    })
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