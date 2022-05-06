import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing"
import { MatAutocompleteModule } from "@angular/material/autocomplete"
import { MatButtonModule } from "@angular/material/button"
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { MatInputModule } from "@angular/material/input"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSortModule } from "@angular/material/sort"
import { MatTableModule } from "@angular/material/table"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { RouterTestingModule } from "@angular/router/testing"
import { BehaviorSubject, of, Subject } from "rxjs"
import { GitHubSearchComponent } from "./github-search/github-search.component"
import { GitHubTestHelper } from "./github-test-helper"
import { GitHubUserProfileComponent } from "./github-user-profile/github-user-profile.component"
import { GitHubComponent } from "./github.component"
import { GitHubService } from "./services/github.service"
import { Location } from "@angular/common";
import { Router } from "@angular/router"
import { GithubApiExceededDialogComponent } from "./github-api-exceeded-dialog/github-api-exceeded-dialog.component"

describe('GitHubComponent', () => {
  let component: GitHubComponent
  let fixture: ComponentFixture<GitHubComponent>
  let ghHelper: GitHubTestHelper<GitHubComponent>

  let gitHubMockedService: any

  beforeEach(() => {
    // ------------------------------------------------------------------------------------------------------------
    // Mockeando servicio para el component
    gitHubMockedService = jasmine.createSpyObj('GitHubService', [''])
    gitHubMockedService.rateLimitExceededSubject$ = new Subject<boolean>()

    // Extra mockeado para componentes hijos
    gitHubMockedService.userSubject$ = of(GitHubTestHelper.dummyGithubUser)
    gitHubMockedService.typingSubject$ = of(true)
    gitHubMockedService.suggedUsernamesSubject$ = of([])
    gitHubMockedService.userFollowsSubject$ = of([])
    gitHubMockedService.userSearchError$ = of(null)
    // ------------------------------------------------------------------------------------------------------------

    TestBed.configureTestingModule({
      imports: [
        MatPaginatorModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        MatButtonModule,
        MatAutocompleteModule,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        GitHubComponent,
        GitHubUserProfileComponent,
        GitHubSearchComponent,
        GithubApiExceededDialogComponent
      ],
      providers: [
        { provide: GitHubService, useValue: gitHubMockedService }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(GitHubComponent)
    component = fixture.debugElement.componentInstance
    ghHelper = new GitHubTestHelper(fixture)
  })

  describe('Component', () => {
    beforeEach(() => {
      fixture.detectChanges()
    })

    it('should create the component', () => {
      expect(component).toBeTruthy()
    })

    it('should instance title correctly', () => {
      expect(ghHelper.getFirstElement('#github-title')).toBeTruthy()
    })

    it('should instance app-github-search component', () => {
      expect(ghHelper.getFirstElement('app-github-search')).toBeTruthy()
    })

    it('should instance app-github-user-profile component', () => {
      expect(ghHelper.getFirstElement('app-github-user-profile')).toBeTruthy()
    })
  })

  it('should call apiRateExceededDialog if service emits true on rateLimitExceededSubject$', () => {
    gitHubMockedService.rateLimitExceededSubject$ = new BehaviorSubject<boolean>(true)
    const spyOpenDialog = spyOn(component, 'openGitHubAPIExceededDialog')

    fixture.detectChanges()
    expect(spyOpenDialog).toHaveBeenCalledTimes(1)
  })

  it('should open apiRateExceededDialog', fakeAsync(() => {
    gitHubMockedService.rateLimitExceededSubject$ = new BehaviorSubject<boolean>(true)
    fixture.detectChanges()
    tick(100)

    // Comprobamos por ejemplo que el botón de cerrar el diálogo existe
    const closeDialogButton = document.querySelector('.mat-dialog-container button') as HTMLButtonElement
    expect(closeDialogButton).toBeTruthy()
    expect(closeDialogButton.innerText.trim()).toBe('Close')
  }))

  it('should navigate back to home after apiRateExceededDialog closed', fakeAsync(() => {
    const location = TestBed.inject(Location)
    const dialog = TestBed.inject(MatDialog)

    // Mockeamos para que devuelva el afterclosed al instante
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) } as MatDialogRef<typeof GithubApiExceededDialogComponent>)

    gitHubMockedService.rateLimitExceededSubject$ = new BehaviorSubject<boolean>(true)
    fixture.detectChanges()
    tick(100)

    // Comprobamos que ha navegado de vuelta a home
    expect(location.path()).toBe('/')
  }))

})
