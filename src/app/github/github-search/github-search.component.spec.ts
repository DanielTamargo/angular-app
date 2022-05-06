import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { MatAutocompleteModule } from "@angular/material/autocomplete"
import { MatButtonModule } from "@angular/material/button"
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog"
import { MatInputModule } from "@angular/material/input"
import { MatPaginatorModule } from "@angular/material/paginator"
import { MatSortModule } from "@angular/material/sort"
import { MatTableModule } from "@angular/material/table"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { RouterTestingModule } from "@angular/router/testing"
import { BehaviorSubject, of } from "rxjs"
import { Location } from "@angular/common";
import { GitHubService } from "../services/github.service"
import { GitHubSearchComponent } from "./github-search.component"
import { GitHubTestHelper } from "../github-test-helper"

describe('GitHubSearchComponent', () => {
  let component: GitHubSearchComponent
  let fixture: ComponentFixture<GitHubSearchComponent>
  let ghHelper: GitHubTestHelper<GitHubSearchComponent>

  let gitHubMockedService: any

  beforeEach(() => {
    // ------------------------------------------------------------------------------------------------------------
    // Mockeando servicio para el component
    gitHubMockedService = jasmine.createSpyObj('GitHubService', [''])
    gitHubMockedService.username = 'danieltamargo'
    gitHubMockedService.userSubject$ = of(GitHubTestHelper.dummyGithubUser)
    gitHubMockedService.typingSubject$ = of(true)
    gitHubMockedService.suggedUsernamesSubject$ = of([])
    gitHubMockedService.onUserSearch = (username) => {}
    // ------------------------------------------------------------------------------------------------------------

    TestBed.configureTestingModule({
      imports: [
        MatInputModule,
        MatAutocompleteModule,
        BrowserAnimationsModule
      ],
      declarations: [ GitHubSearchComponent ],
      providers: [
        { provide: GitHubService, useValue: gitHubMockedService }
      ]
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(GitHubSearchComponent)
    component = fixture.debugElement.componentInstance
    ghHelper = new GitHubTestHelper(fixture)
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })


  it('should tap the keyup and filter suggested usernames', fakeAsync(() => {
    const filterSuggestedUsernamesSpy = spyOn(component, 'filterSuggestedUsernames')
    fixture.detectChanges()

    const elm = ghHelper.getFirstElement('#username').nativeElement as HTMLInputElement
    const event = new KeyboardEvent('keyup', { key: 'a' })
    elm.dispatchEvent(event)

    tick(750)
    expect(filterSuggestedUsernamesSpy).toHaveBeenCalledTimes(1)
  }))

})
