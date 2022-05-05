import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { catchError, Observable, of, throwError } from "rxjs";
import { ajax, AjaxError, AjaxResponse } from "rxjs/ajax";
import { GitHubConstants as GHC} from "../constants/github-constants";
import { GitHubTestHelper } from "../github-test-helper";
import { GitHubRepoInterface } from "../interfaces/github-repo.interface";
import { GitHubUserInterface } from "../interfaces/github-user.interface";
import { GitHubService } from "./github.service";

describe('GitHubService', () => {

  let service: GitHubService

  beforeEach(fakeAsync(() => {
     // Configuramos el módulo que utilizará en la fase de testing
    TestBed.configureTestingModule({
      imports: [  ],
      declarations: [  ],
      providers: [ ]
    }).compileComponents()

    service = TestBed.inject(GitHubService)
  }))

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('Method: checkApiErrors', () => {
    let userSearchErrorSpy: jasmine.Spy<any>
    let rateLimitExceededSubjectSpy: jasmine.Spy<any>

    let err: AjaxError = {
      name: '',
      message: '',
      stack: '',
      xhr: null,
      request: null,
      status: 200,
      responseType: null,
      response: {
        message: 'There is no error'
      },
    }

    beforeEach(() => {
      userSearchErrorSpy = spyOn(service.userSearchError$, 'next')
      rateLimitExceededSubjectSpy = spyOn(service.rateLimitExceededSubject$, 'next')
    })

    it('should execute method but do nothing', () => {
      err = {
        ...err,
        status: 200,
        response: {
          message: 'There is no error'
        },
      }

      service.checkApiErrors(err)
      expect(userSearchErrorSpy).toHaveBeenCalledTimes(0)
      expect(rateLimitExceededSubjectSpy).toHaveBeenCalledTimes(0)
    })

    it('should execute method and notify user search error', () => {
      err = {
        ...err,
        status: 404,
        response: {
          message: 'User not found'
        },
      }

      service.checkApiErrors(err, true)
      expect(userSearchErrorSpy).toHaveBeenCalledOnceWith("The user '" + service.username + "' for does not exist 😢")
      expect(rateLimitExceededSubjectSpy).toHaveBeenCalledTimes(0)
    })

    it('should execute method and notify api rate limit exceed error', () => {
      err = {
        ...err,
        status: 403,
        response: {
          message: 'Api rate limit exceeded'
        },
      }

      service.checkApiErrors(err)
      expect(userSearchErrorSpy).toHaveBeenCalledTimes(0)
      expect(rateLimitExceededSubjectSpy).toHaveBeenCalledOnceWith(true)
    })
  })

  describe('Method: onUserSearch', () => {
    let typingSubjectSpy: jasmine.Spy<any>
    let userSubjectSpy: jasmine.Spy<any>
    let ajaxGetSpy: jasmine.Spy<any>

    let user: GitHubUserInterface = GitHubTestHelper.dummyGithubUser

    beforeEach(() => {
      typingSubjectSpy = spyOn(service.typingSubject$, 'next')
      userSubjectSpy = spyOn(service.userSubject$, 'next')
    })

    describe('AJAX success', () => {
      let ajaxResponse$: Observable<AjaxResponse<GitHubUserInterface>> | Observable<any> = of({ response: GitHubTestHelper.dummyGithubUser })

      beforeEach(() => {
        ajaxGetSpy = spyOn(ajax, 'get').and.returnValue(ajaxResponse$)
      })

      it('typingSubject should emit false because both names were equal', () => {
        service.username = 'test'
        service.onUserSearch('TEST')

        expect(typingSubjectSpy).toHaveBeenCalledOnceWith(false)
        expect(userSubjectSpy).toHaveBeenCalledTimes(0)
        expect(ajaxGetSpy).toHaveBeenCalledTimes(0)
      })

      it('userSubject should emit null because username was undefined', () => {
        service.username = 'test'
        service.onUserSearch('')

        expect(userSubjectSpy).toHaveBeenCalledOnceWith(null)
        expect(ajaxGetSpy).toHaveBeenCalledTimes(0)
      })

      it('ajax should execute get request and retrieve user info', () => {
        const onUserResultSpy = spyOn(service, 'onUserResult')
        let username = 'danieltamargo'
        service.onUserSearch(username)

        expect(ajaxGetSpy).toHaveBeenCalledOnceWith(GHC.BASE_URL + GHC.USER.replace(GHC.KEY_USERNAME, username))
        expect(typingSubjectSpy).toHaveBeenCalledTimes(1)
        expect(onUserResultSpy).toHaveBeenCalledOnceWith(user)
      })

    })

    describe('AJAX errors', () => {
      let checkApiErrorsSpy: jasmine.Spy<(err: AjaxError, peticionUsuario?: boolean) => void>

      let errStatus: number
      let errMsg: string
      let ajaxError$ = throwError(() => {
        const error: any = new Error(errMsg)
        error.status = errStatus
        return error;
      })

      beforeEach(() => {
        checkApiErrorsSpy = spyOn(service, 'checkApiErrors')
        ajaxGetSpy = spyOn(ajax, 'get').and.returnValue(ajaxError$)
      })

      it('ajax should execute get request and retrieve error because url does not exist', () => {
        errStatus = 404
        errMsg = '404 user not found'
      })

      it('ajax should execute get request and retrieve error because api rate limit was exceeded', () => {
        errStatus = 403
        errMsg = '403 api rate limit exceeded'
      })

      afterEach(() => {
        service.onUserSearch('danieltamargosdfsdf')
        expect(checkApiErrorsSpy).toHaveBeenCalledOnceWith(new Error(errMsg) as AjaxError, true)
      })

    })
  })

  describe('Method: onUserResult', () => {
    let userSubjectSpy: jasmine.Spy<any>
    let userReposSubjectSpy: jasmine.Spy<any>
    let userGistsSubjectSpy: jasmine.Spy<any>
    let userFollowsSubjectSpy: jasmine.Spy<any>
    let loadingSubjectSpy: jasmine.Spy<any>

    let onSaveSearchedUserSpy: jasmine.Spy<any>
    let onUserReposRequestSpy: jasmine.Spy<any>
    let onUserGistsRequestSpy: jasmine.Spy<any>
    let onUserFollowsRequestSpy: jasmine.Spy<any>

    let user = GitHubTestHelper.dummyGithubUser

    beforeEach(() => {
      userSubjectSpy = spyOn(service.userSubject$, 'next')
      userReposSubjectSpy = spyOn(service.userReposSubject$, 'next')
      userGistsSubjectSpy = spyOn(service.userGistsSubject$, 'next')
      userFollowsSubjectSpy = spyOn(service.userFollowsSubject$, 'next')
      loadingSubjectSpy = spyOn(service.loadingSubject$, 'next')

      onSaveSearchedUserSpy = spyOn(service, 'onSaveSearchedUser')
      onUserReposRequestSpy = spyOn(service, 'onUserReposRequest')
      onUserGistsRequestSpy = spyOn(service, 'onUserGistsRequest')
      onUserFollowsRequestSpy = spyOn(service, 'onUserFollowsRequest')
    })

    it('should execute method correctly when selectedSection is 0', () => {
      service.selectedSection = 0
      service.onUserResult(user)
    })

    it('should execute method correctly when selectedSection is 1', () => {
      service.selectedSection = 1
      service.onUserResult(user)
      expect(loadingSubjectSpy).toHaveBeenCalledOnceWith(true)

      expect(onUserReposRequestSpy).toHaveBeenCalledTimes(1)
      expect(onUserGistsRequestSpy).toHaveBeenCalledTimes(0)
      expect(onUserFollowsRequestSpy).toHaveBeenCalledTimes(0)
    })

    it('should execute method correctly when selectedSection is 2', () => {
      service.selectedSection = 2
      service.onUserResult(user)
      expect(loadingSubjectSpy).toHaveBeenCalledOnceWith(true)

      expect(onUserReposRequestSpy).toHaveBeenCalledTimes(0)
      expect(onUserGistsRequestSpy).toHaveBeenCalledTimes(1)
      expect(onUserFollowsRequestSpy).toHaveBeenCalledTimes(0)
    })

    it('should execute method correctly when selectedSection is 3', () => {
      service.selectedSection = 3
      service.onUserResult(user)
      expect(loadingSubjectSpy).toHaveBeenCalledOnceWith(true)

      expect(onUserReposRequestSpy).toHaveBeenCalledTimes(0)
      expect(onUserGistsRequestSpy).toHaveBeenCalledTimes(0)
      expect(onUserFollowsRequestSpy).toHaveBeenCalledTimes(1)
    })

    it('should execute method correctly when selectedSection is 4', () => {
      service.selectedSection = 4
      service.onUserResult(user)
      expect(loadingSubjectSpy).toHaveBeenCalledOnceWith(true)

      expect(onUserReposRequestSpy).toHaveBeenCalledTimes(0)
      expect(onUserGistsRequestSpy).toHaveBeenCalledTimes(0)
      expect(onUserFollowsRequestSpy).toHaveBeenCalledTimes(1)
    })

    afterEach(() => {
      expect(userSubjectSpy).toHaveBeenCalledOnceWith(user)
      expect(userReposSubjectSpy).toHaveBeenCalledOnceWith([])
      expect(userGistsSubjectSpy).toHaveBeenCalledOnceWith([])
      expect(userFollowsSubjectSpy).toHaveBeenCalledOnceWith([])

      expect(onSaveSearchedUserSpy).toHaveBeenCalledOnceWith(user.login)

      expect(service.user).toEqual(user)
      expect(service.repos.length).toBe(0)
      expect(service.gists.length).toBe(0)
      expect(service.follows.length).toBe(0)
    })

  })

  describe('Method: onSaveSearchedUser', () => {
    const LS_KEY = GHC.LS_GITHUB_RECENT_USERNAMES
    const username = 'dani'

    beforeEach(() => {
      localStorage.removeItem(LS_KEY)
      service.suggestedUsernames = []
    })

    it('should save a new searched user', () => {
      service.onSaveSearchedUser(username)
      expect(service.suggestedUsernames.length).toBe(1)
      expect(service.suggestedUsernames[0]).toBe(username)
      expect(localStorage.getItem(LS_KEY)).toEqual(JSON.stringify([username]))
    })

    it('should move searched user to first position if user was already searched', () =>{
      service.suggestedUsernames = ['irune', 'iker', 'usta', username, 'aitor']
      service.onSaveSearchedUser(username)
      expect(service.suggestedUsernames[0]).toEqual(username)
      expect(service.suggestedUsernames.filter(usrnm => usrnm === username).length).toBe(1)
    })

    it('should send', () => {
      const onSaveSearchedUserSpy = spyOn(service.suggedUsernamesSubject$, 'next')
      service.onSaveSearchedUser(username)
      expect(onSaveSearchedUserSpy).toHaveBeenCalledTimes(1)
    })

  })

  describe('Method: onUserReposRequest', () => {
    const repo = GitHubTestHelper.dummyGitHubEmptyRepo
    const user = GitHubTestHelper.dummyGithubUser
    let userReposSubjectSpy: jasmine.Spy<any>
    let numberOfAjaxCalls: number
    let ajaxGetSpy: jasmine.Spy<any>

    const arrResult = (qt: number): any[] => {
      let arr = []
      if (qt > 100) qt = 100
      for (let i = 0; i < qt; i++) {
        arr[i] = repo
      }
      return arr
    }

    const expectedResult = (qt: number): any[] => {
      let arr = []
      const multiply = qt / 100

      if (qt > 100) qt = 100

      for (let i = 0; i < qt; i++) {
        arr[i] = repo
      }

      if (multiply > 1) {
        const aux_arr = [...arr]
        arr = []
        for (let i = 0; i < multiply; i++) {
          arr = [...arr, ...aux_arr]
        }
      }

      return arr
    }

    let ajaxResponse: AjaxResponse<unknown>
      = {
        request: null, originalEvent: null, type: null, responseHeaders: null,
        responseType: null, loaded: null, total: null, xhr: null,
        status: 200,
        response: repo,
      }

    let qt: number

    beforeEach(() => {
      service.user = {...GitHubTestHelper.dummyGithubUser}
      userReposSubjectSpy = spyOn(service.userReposSubject$, 'next')
      ajaxGetSpy = spyOn(ajax, 'get')
    })

    it('should emit userRepository subject once with 0 repositories using ajax get 1 time', () => {
      qt = 2
    })

    it('should emit userRepository subject once with 101 repositories using ajax get 2 times (using pagination)', fakeAsync(() => {
      qt = 101
    }))

    it('should emit userRepository subject once with 0 repositories using ajax get 0 times', fakeAsync(() => {
      qt = 0
    }))

    it('should use default number per_page and work correctly', fakeAsync(() => {
      service.user.name = 'different_name'
      qt = -1
    }))

    afterEach(fakeAsync(() => {
      ajaxResponse = {
        ...ajaxResponse,
        response: arrResult(qt)
      }

      ajaxGetSpy.and.returnValue(of(ajaxResponse))
      if (qt < 0) {
        numberOfAjaxCalls = 1
        service.onUserReposRequest(user.url + '/repos')
        qt = 0
      } else {
        numberOfAjaxCalls = Math.ceil(qt / 100)
        service.onUserReposRequest(user.url + '/repos', qt)
      }

      tick(500)
      expect(userReposSubjectSpy).toHaveBeenCalledTimes(1)
      expect(ajaxGetSpy).toHaveBeenCalledTimes(numberOfAjaxCalls)
      expect((userReposSubjectSpy.calls.argsFor(0)[0] as any).length).toBe(expectedResult(qt).length)
    }))


  })


})

/*
  onUserSearch(username: string) {
    // Si ha buscado el mismo usuario, obviamos
    if (this.username.toLocaleLowerCase() == username.toLocaleLowerCase()) {
      this.typingSubject$.next(false);
      return;
    }

    this.username = username;

    // Si no ha escrito nada, reiniciamos
    if (!username) {
      this.userSubject$.next(null);
      this.userSearchError$.next(null);
      return;
    }

    const url = GHC.BASE_URL + GHC.USER.replace(GHC.KEY_USERNAME, username);
    ajax<GitHubUserInterface>(url)
      .pipe(
        pluck('response'),
        tap(() => { // Utilizamos el tap para notificar que ya no está escribiendo
          this.typingSubject$.next(false);
        }),) // <- si trabajamos con ajax de rxjs en vez de httpclient lo recibimos distinto
      .subscribe({
        next: user => {
          this.onUserResult(user);
        },
        error: (err: AjaxError) => {
          this.checkApiErrors(err, true);
        }
      });
  }

  */
