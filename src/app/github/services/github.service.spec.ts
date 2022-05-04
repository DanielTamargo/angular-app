import { fakeAsync, TestBed } from "@angular/core/testing";
import { catchError, Observable, of } from "rxjs";
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

    let ajaxResponse: Observable<AjaxResponse<GitHubUserInterface>> | Observable<any> = of({ response: GitHubTestHelper.githubUser })
    let user: GitHubUserInterface = GitHubTestHelper.githubUser
    
    beforeEach(() => {
      typingSubjectSpy = spyOn(service.typingSubject$, 'next')
      userSubjectSpy = spyOn(service.userSubject$, 'next')
      ajaxGetSpy = spyOn(ajax, 'get').and.returnValue(ajaxResponse)
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

    it('ajax should execute get request and retrieve error because url does not exist', () => {
      const checkApiErrorsSpy = spyOn(service, 'checkApiErrors')
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
      
      let username = 'danieltamargosdfsdf'
      service.onUserSearch(username)
      
      expect(checkApiErrorsSpy).toHaveBeenCalled()
    })
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