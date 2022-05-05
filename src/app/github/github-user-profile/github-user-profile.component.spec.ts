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
import { GitHubUserGistsComponent } from "./github-user-gists/github-user-gists.component";
import { GitHubUserRepositoriesComponent } from "./github-user-repositories/github-user-repositories.component";


describe('GitHubUserProfileComponent', () => {
  let component: GitHubUserProfileComponent
  let fixture: ComponentFixture<GitHubUserProfileComponent>

  let ghHelper: GitHubTestHelper<GitHubUserProfileComponent>
  let gitHubMockedService: any

  beforeEach(fakeAsync(() => {
    // Configuramos el mock del servicio
    gitHubMockedService = jasmine.createSpyObj('GitHubService', [''])
    gitHubMockedService.userSubject$ = of(GitHubTestHelper.dummyGithubUser)
    gitHubMockedService.typingSubject$ = of(true)
    gitHubMockedService.userFollowsSubject$ = of([])
    gitHubMockedService.userSearchError$ = of(null)
    gitHubMockedService.selectedSection = 0
    // Para sub componente repo
    gitHubMockedService.userReposSubject$ = of(GitHubTestHelper.dummyGitHubRepos)
    gitHubMockedService.loadingSubject$ = of(true)
    // Para sub componente gist
    gitHubMockedService.userGistsSubject$ = of(GitHubTestHelper.dummyGitHubGists)


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
        GitHubUserRepositoriesComponent,
        GitHubUserGistsComponent,
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

  describe('IF PATHs: getUser method', () => {
    it('should update follows_number when FOLLOWERS section already selected', () => {
      component.lastCase = GitHubConstants.CASE_FOLLOWERS
      fixture.detectChanges()
      expect(component.follows_number).toBe(component.user.followers)
    })

    it('should update follows_number when FOLLOWING section already selected', () => {
      component.lastCase = GitHubConstants.CASE_FOLLOWING
      fixture.detectChanges()
      expect(component.follows_number).toBe(component.user.following)
    })
  })

  describe('IF PATHs: checkLastCase method', () => {
    it('should update follows_number when FOLLOWERS section already selected', () => {
      gitHubMockedService.selectedSection = GitHubConstants.CASE_FOLLOWERS
      fixture.detectChanges()
      expect(component.follows_number).toBe(component.user.followers)
    })

    it('should update follows_number when FOLLOWING section already selected', () => {
      gitHubMockedService.selectedSection = GitHubConstants.CASE_FOLLOWING
      fixture.detectChanges()
      expect(component.follows_number).toBe(component.user.following)
    })
  })


  it('trackBy should track the item id properly', () => {
    const id = component.trackByFollows(0, GitHubTestHelper.dummyGithubUser)
    expect(id).toEqual(GitHubTestHelper.dummyGithubUser.id)
  })


  describe('Display Info Selection', () => {
    let selection: number
    let element: HTMLElement

    let func: any
    let funcTimes: number
    let isComponentLoading: boolean

    beforeEach(() => {
      component.loading = true
      component.lastCase = 0
      component.user = GitHubTestHelper.dummyGithubUser
      gitHubMockedService.selectedSection = 0
      element = document.createElement('div')

      gitHubMockedService.onUserReposRequest = () => {}
      gitHubMockedService.onUserGistsRequest = () => {}
      gitHubMockedService.onUserFollowsRequest = () => {}
      gitHubMockedService.onUserFollowsRequest = () => {}
    })

    it('should return if same section got selected', () => {
      selection = 0

      component.onChangeDisplayInfoSelection(element, selection)
      expect(element.classList.length).toBe(0)
    })

    it('should update values and execute service onUserReposRequest when selecting repos', () => {
      selection = GitHubConstants.CASE_REPOS
      func = spyOn(gitHubMockedService, 'onUserReposRequest')

      component.onChangeDisplayInfoSelection(element, selection)
      expect(element.classList.length).toBeGreaterThan(0)
      funcTimes = 1
      expect(func).toHaveBeenCalledWith(component.user.url + '/repos', component.user.public_repos)
      isComponentLoading = false
    })

    it('should update values and execute service onUserGistsRequest when selecting gists', () => {
      selection = GitHubConstants.CASE_GISTS
      func = spyOn(gitHubMockedService, 'onUserGistsRequest')

      component.onChangeDisplayInfoSelection(element, selection)
      expect(element.classList.length).toBeGreaterThan(0)

      funcTimes = 1
      expect(func).toHaveBeenCalledWith(component.user.url + '/gists', component.user.public_gists)
      isComponentLoading = false
    })

    it('should update values and execute service onUserFollowsRequest when selecting followers', () => {
      selection = GitHubConstants.CASE_FOLLOWERS
      func = spyOn(gitHubMockedService, 'onUserFollowsRequest')

      component.onChangeDisplayInfoSelection(element, selection)
      expect(element.classList.length).toBeGreaterThan(0)
      expect(component.follows_number).toBe(component.user.followers)

      funcTimes = 1
      expect(func).toHaveBeenCalledWith(component.user.url + '/followers', component.follows_per_query, component.follows_page)
      isComponentLoading = true
    })

    it('should update values and execute service onUserFollowsRequest when selecting followings', () => {
      selection = GitHubConstants.CASE_FOLLOWING
      func = spyOn(gitHubMockedService, 'onUserFollowsRequest')

      component.onChangeDisplayInfoSelection(element, selection)
      expect(element.classList.length).toBeGreaterThan(0)
      expect(component.follows_number).toBe(component.user.following)

      funcTimes = 1
      expect(func).toHaveBeenCalledWith(component.user.url + '/following', component.follows_per_query, component.follows_page)
      isComponentLoading = true
    })

    it('should change active class on selected display section when selecting a diferent section', () => {
      fixture.detectChanges()
      component.lastCase = GitHubConstants.CASE_REPOS
      fixture.detectChanges()

      const previousSelectedElement = ghHelper.getFirstElement('.user-details .stats.active')

      selection = GitHubConstants.CASE_GISTS
      const onChangeDisplayInfoSelectionSpy = spyOn(component, 'onChangeDisplayInfoSelection').and.callThrough()
      func = spyOn(gitHubMockedService, 'onUserGistsRequest')
      fixture.detectChanges()

      const section = ghHelper.getFirstElement('.user-details .public-gists')
      section.nativeElement.click()
      fixture.detectChanges()

      const finalSelectedElement = ghHelper.getFirstElement('.user-details .stats.active')
      expect(previousSelectedElement == finalSelectedElement).toBeFalse()
      expect(onChangeDisplayInfoSelectionSpy).toHaveBeenCalledTimes(1)
      expect(onChangeDisplayInfoSelectionSpy).toHaveBeenCalledWith(section.nativeElement, selection)

      funcTimes = 1
      isComponentLoading = false
    })

    afterEach(() => {
      if (selection > 0) {
        expect(func).toHaveBeenCalledTimes(funcTimes)
        expect(component.loading).toBe(isComponentLoading)

        expect(component.displayFollows.length).toBe(0)
        expect(component.lastCase).toBe(selection)
        expect(component.follows_page).toBe(1)
      }

      expect(gitHubMockedService.selectedSection).toBe(selection)
    })
  })

  describe('Follows', () => {
    let initialFollowsPage: number
    let onUserFollowsRequestSpy: jasmine.Spy<any>

    beforeEach(() => {
      gitHubMockedService.onUserFollowsRequest = () => {}
      initialFollowsPage = component.follows_page
      onUserFollowsRequestSpy = spyOn(gitHubMockedService, 'onUserFollowsRequest')
      component.lastCase = GitHubConstants.CASE_FOLLOWING
      fixture.detectChanges()
    })

    it('should increase follows page by 1', () => {
      component.loadMoreFollows()
      expect(initialFollowsPage + 1).toBe(component.follows_page)
    })

    it('should call the function with correct params', () => {
      component.loadMoreFollows()
      expect(onUserFollowsRequestSpy).toHaveBeenCalledOnceWith(component.user.url + '/following', component.follows_per_query, component.follows_page)
    })

    it('should select correct key', () => {
      component.lastCase = GitHubConstants.CASE_FOLLOWERS
      component.loadMoreFollows()
      expect(onUserFollowsRequestSpy).toHaveBeenCalledOnceWith(component.user.url + '/followers', component.follows_per_query, component.follows_page)
    })
  })

})

/*
     public loadMoreFollows(): void {
    this.follows_page++;
    let key = '/following';
    Iif (this.lastCase == this.CASE_FOLLOWERS) {
      key = '/followers';
    }

    this.gitHubService.onUserFollowsRequest(this.user.url + key, this.follows_per_query, this.follows_page);
  }
*/
