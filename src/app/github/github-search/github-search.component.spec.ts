import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { MatAutocompleteModule, MatAutocompleteTrigger } from "@angular/material/autocomplete"
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
import { GitHubConstants as GHC } from "../constants/github-constants"

describe('GitHubSearchComponent', () => {
  let component: GitHubSearchComponent
  let fixture: ComponentFixture<GitHubSearchComponent>
  let ghHelper: GitHubTestHelper<GitHubSearchComponent>

  let gitHubMockedService: any

  beforeEach(() => {
    // ------------------------------------------------------------------------------------------------------------
    // Mockeando servicio para el component
    gitHubMockedService = jasmine.createSpyObj('GitHubService', [''])
    gitHubMockedService.username = ''
    gitHubMockedService.userSubject$ = of(GitHubTestHelper.dummyGithubUser)
    gitHubMockedService.typingSubject$ = of(true)
    gitHubMockedService.suggedUsernamesSubject$ = new BehaviorSubject<string[]>(['danieltamargo', 'irunemendez', 'usta'])
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

  it('should tap the keyup and set typing to false because input has no value', fakeAsync(() => {
    const filterSuggestedUsernamesSpy = spyOn(component, 'filterSuggestedUsernames').and.callThrough()
    fixture.detectChanges()

    const elm = ghHelper.getFirstElement('#username').nativeElement as HTMLInputElement
    const event = new KeyboardEvent('keyup', { key: 'a' })
    elm.dispatchEvent(event)

    tick(750)
    expect(filterSuggestedUsernamesSpy).toHaveBeenCalledTimes(1)
    expect(component.typing).toBeFalse()
  }))

  it('should tap the keyup and filter suggested usernames', fakeAsync(() => {
    const filterSuggestedUsernamesSpy = spyOn(component, 'filterSuggestedUsernames').and.callThrough()
    fixture.detectChanges()

    const elm = ghHelper.getFirstElement('#username').nativeElement as HTMLInputElement
    const event = new KeyboardEvent('keyup', { key: 't' })
    elm.value = 'danieltamargo'
    elm.dispatchEvent(event)

    tick(750)
    expect(filterSuggestedUsernamesSpy).toHaveBeenCalled()
    // Debería checkear el resultado del observable que contiene el filtrado, pero no consigo obtenerlo
    //    igualmente con el code coverage se observa que el código se recorre correctamente
  }))


  describe('Clear recent usernames', () => {
    beforeEach(() => {
      const recent_usernames = ['danieltamargo', 'irunemendez']
      localStorage.setItem(GHC.LS_GITHUB_RECENT_USERNAMES, JSON.stringify(recent_usernames))
      gitHubMockedService.recentUsernames = recent_usernames
      fixture.detectChanges()
    })

    it('should clear recent usernames from localStorage', () => {
      component.clearRecentUsernames()
      expect(localStorage.getItem(GHC.LS_GITHUB_RECENT_USERNAMES)).toBeFalsy()
    })

    it('should clear recent usernames on gitHubService', () => {
      component.clearRecentUsernames()
      expect(gitHubMockedService.suggestedUsernames).toEqual([])
    })
  })


  describe('Select autocomplete recent username', () => {
    beforeEach(() => {
      localStorage.setItem(GHC.LS_GITHUB_RECENT_USERNAMES, JSON.stringify(['danieltamargo', 'irunemendez']))
      fixture.detectChanges()
    })

    it('should select autocomplete option', fakeAsync(() => {
      const onUserSearchSpy = spyOn(gitHubMockedService, 'onUserSearch')
      component.onAutoCompleteOptionSelected('danieltamargo')
      tick(700)
      expect(onUserSearchSpy).toHaveBeenCalledTimes(1)
    }))

    it('should return if selectedUsernameTimeout was started and not finished and avoid select autocomplete option', fakeAsync(() => {
      const onUserSearchSpy = spyOn(gitHubMockedService, 'onUserSearch')
      component.selectedUsernameTimeout = setTimeout(() => { }, 400);
      component.onAutoCompleteOptionSelected('danieltamargo')
      tick(700)

      expect(onUserSearchSpy).toHaveBeenCalledTimes(0)
    }))

    afterEach(() => {
      localStorage.removeItem(GHC.LS_GITHUB_RECENT_USERNAMES)
    })
  })





})
