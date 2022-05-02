import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BehaviorSubject } from "rxjs";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule, SortDirection } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";

import { SizeFormatterPipe } from "src/app/shared/pipes/size-formatter.pipe";
import { GitHubService } from "../../services/github.service";
import { GitHubUserGistsComponent } from "./github-user-gists.component";
import { GitHubGistInterface } from "../../interfaces/github-gist.interface";
import { RetrieveGistFileNamesPipe } from "../../pipes/retrieve-gist-file-names.pipe";

describe('GitHubUserGistsComponent', () => {
  let component: GitHubUserGistsComponent
  let fixture: ComponentFixture<GitHubUserGistsComponent>

  beforeEach(fakeAsync(() => TestBed.configureTestingModule({
    imports: [ 
      MatPaginatorModule,
      MatInputModule,
      MatTableModule,
      MatSortModule,
      MatDialogModule,
      BrowserAnimationsModule,
    ],
    declarations: [ 
      GitHubUserGistsComponent, 
      SizeFormatterPipe,
      RetrieveGistFileNamesPipe
    ],
    providers: [
      // Override del GitHubService por el GitHubMockedService
      { provide: GitHubService, useClass: GitHubMockedService }
    ]
  }).compileComponents()))

  beforeEach(() => {
    fixture = TestBed.createComponent(GitHubUserGistsComponent)
    component = fixture.debugElement.componentInstance
  })

  it('should create the table AND contain 3 gists', fakeAsync(() => {
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      const tr_repos = fixture.debugElement.queryAll(By.css('tbody tr'))
      expect(tr_repos.length == 3).toBeTrue()
    })
  }))

  it("first gists's file should be 'web-component.md (Markdown)'", fakeAsync(() => {
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      const tr_gists = fixture.debugElement.queryAll(By.css('tbody tr'))
      expect((tr_gists[0].children[0].children[0].nativeElement as HTMLLinkElement).innerText).toBe('web-component.md (Markdown)')
    })
  }))

  it("after resorting list first gists's file should NOT be 'web-component.md (Markdown)'", fakeAsync(() => {
    // Modificamos el ancho de la pantalla porque si es bajo ocultará la columna created_at
    // https://jasmine.github.io/tutorials/spying_on_properties
    spyOnProperty(window, 'innerWidth').and.returnValue(800)
    window.dispatchEvent(new Event('resize'))
    fixture.detectChanges()

    const sorts = fixture.debugElement.queryAll(By.css('.mat-sort-header-content'))
    const sortCreatedAt = sorts.find(sort => (sort.nativeNode as HTMLElement).innerText.toLocaleLowerCase() == 'created at')
    const sortCreatedAtButton = (sortCreatedAt.nativeElement as HTMLButtonElement)
    sortCreatedAtButton.click()
    fixture.detectChanges()

    fixture.whenStable().then(() => {
      const tr_repos = fixture.debugElement.queryAll(By.css('tbody tr'))
      expect((tr_repos[0].children[0].children[0].nativeElement as HTMLElement).innerText == 'web-component.md (Markdown)').toBeFalse()
    })

    discardPeriodicTasks()
  }))
})

class GitHubMockedService {
  gists: GitHubGistInterface[] = [
    {
      url: "https://api.github.com/gists/7122b4f381cccba08cf71ced380c4623",
      forks_url: "https://api.github.com/gists/7122b4f381cccba08cf71ced380c4623/forks",
      commits_url: "https://api.github.com/gists/7122b4f381cccba08cf71ced380c4623/commits",
      id: "7122b4f381cccba08cf71ced380c4623",
      node_id: "G_kwDOAfIqVNoAIDcxMjJiNGYzODFjY2NiYTA4Y2Y3MWNlZDM4MGM0NjIz",
      git_pull_url: "https://gist.github.com/7122b4f381cccba08cf71ced380c4623.git",
      git_push_url: "https://gist.github.com/7122b4f381cccba08cf71ced380c4623.git",
      html_url: "https://gist.github.com/7122b4f381cccba08cf71ced380c4623",
      files: {
        "web-component.md": {
          filename: "web-component.md",
          type: "text/markdown",
          language: "Markdown",
          raw_url: "https://gist.githubusercontent.com/DanielTamargo/7122b4f381cccba08cf71ced380c4623/raw/b9f065c90087311acf6e09c37cd103c8c9bc7d4e/button-panel.md",
          size: 5645
        }
      },
      public: true,
      created_at: "2022-02-07T09:37:57Z",
      updated_at: "2022-05-02T10:10:57Z",
      description: "Código Web Component en JavaScript plano",
      comments: 0,
      user: null,
      comments_url: "https://api.github.com/gists/7122b4f381cccba08cf71ced380c4623/comments",
      owner: {
        login: "DanielTamargo",
        id: 32647764,
        node_id: "MDQ6VXNlcjMyNjQ3NzY0",
        avatar_url: "https://avatars.githubusercontent.com/u/32647764?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/DanielTamargo",
        html_url: "https://github.com/DanielTamargo",
        followers_url: "https://api.github.com/users/DanielTamargo/followers",
        following_url: "https://api.github.com/users/DanielTamargo/following{/other_user}",
        gists_url: "https://api.github.com/users/DanielTamargo/gists{/gist_id}",
        starred_url: "https://api.github.com/users/DanielTamargo/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/DanielTamargo/subscriptions",
        organizations_url: "https://api.github.com/users/DanielTamargo/orgs",
        repos_url: "https://api.github.com/users/DanielTamargo/repos",
        events_url: "https://api.github.com/users/DanielTamargo/events{/privacy}",
        received_events_url: "https://api.github.com/users/DanielTamargo/received_events",
        type: "User",
        site_admin: false
      },
      truncated: false
    },
    {
      url: "https://api.github.com/gists/bc3c06fd824da7d5ea0569d3bf871839",
      forks_url: "https://api.github.com/gists/bc3c06fd824da7d5ea0569d3bf871839/forks",
      commits_url: "https://api.github.com/gists/bc3c06fd824da7d5ea0569d3bf871839/commits",
      id: "bc3c06fd824da7d5ea0569d3bf871839",
      node_id: "G_kwDOAfIqVNoAIGJjM2MwNmZkODI0ZGE3ZDVlYTA1NjlkM2JmODcxODM5",
      git_pull_url: "https://gist.github.com/bc3c06fd824da7d5ea0569d3bf871839.git",
      git_push_url: "https://gist.github.com/bc3c06fd824da7d5ea0569d3bf871839.git",
      html_url: "https://gist.github.com/bc3c06fd824da7d5ea0569d3bf871839",
      files: {
        "selectores-CSS-basicos-y-habituales.md": {
          filename: "selectores-CSS-basicos-y-habituales.md",
          type: "text/markdown",
          language: "Markdown",
          raw_url: "https://gist.githubusercontent.com/DanielTamargo/bc3c06fd824da7d5ea0569d3bf871839/raw/6e5a856779ad376e0a624e55c59577839f59d5de/selectores-CSS-basicos-y-habituales.md",
          size: 1619
        }
      },
      public: true,
      created_at: "2022-03-26T09:30:03Z",
      updated_at: "2022-04-07T08:08:11Z",
      description: "Algunos selectores CSS básicos",
      comments: 0,
      user: null,
      comments_url: "https://api.github.com/gists/bc3c06fd824da7d5ea0569d3bf871839/comments",
      owner: {
        login: "DanielTamargo",
        id: 32647764,
        node_id: "MDQ6VXNlcjMyNjQ3NzY0",
        avatar_url: "https://avatars.githubusercontent.com/u/32647764?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/DanielTamargo",
        html_url: "https://github.com/DanielTamargo",
        followers_url: "https://api.github.com/users/DanielTamargo/followers",
        following_url: "https://api.github.com/users/DanielTamargo/following{/other_user}",
        gists_url: "https://api.github.com/users/DanielTamargo/gists{/gist_id}",
        starred_url: "https://api.github.com/users/DanielTamargo/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/DanielTamargo/subscriptions",
        organizations_url: "https://api.github.com/users/DanielTamargo/orgs",
        repos_url: "https://api.github.com/users/DanielTamargo/repos",
        events_url: "https://api.github.com/users/DanielTamargo/events{/privacy}",
        received_events_url: "https://api.github.com/users/DanielTamargo/received_events",
        type: "User",
        site_admin: false
      },
      truncated: false
    },
    {
      url: "https://api.github.com/gists/af07b0dc3870e6c04c5921220322bcc6",
      forks_url: "https://api.github.com/gists/af07b0dc3870e6c04c5921220322bcc6/forks",
      commits_url: "https://api.github.com/gists/af07b0dc3870e6c04c5921220322bcc6/commits",
      id: "af07b0dc3870e6c04c5921220322bcc6",
      node_id: "G_kwDOAfIqVNoAIGFmMDdiMGRjMzg3MGU2YzA0YzU5MjEyMjAzMjJiY2M2",
      git_pull_url: "https://gist.github.com/af07b0dc3870e6c04c5921220322bcc6.git",
      git_push_url: "https://gist.github.com/af07b0dc3870e6c04c5921220322bcc6.git",
      html_url: "https://gist.github.com/af07b0dc3870e6c04c5921220322bcc6",
      files: {
        "guia-laravel-8.md": {
          filename: "guia-laravel-8.md",
          type: "text/markdown",
          language: "Markdown",
          raw_url: "https://gist.githubusercontent.com/DanielTamargo/af07b0dc3870e6c04c5921220322bcc6/raw/ba5a20123700718746fe785a667d5de181836020/guia-laravel-8.md",
          size: 9879
        }
      },
      public: true,
      created_at: "2022-03-03T07:39:49Z",
      updated_at: "2022-04-07T06:50:00Z",
      description: "Una guía básica e intermedia de Laravel 8. Cómo crear y comenzar un proyecto.",
      comments: 0,
      user: null,
      comments_url: "https://api.github.com/gists/af07b0dc3870e6c04c5921220322bcc6/comments",
      owner: {
        login: "DanielTamargo",
        id: 32647764,
        node_id: "MDQ6VXNlcjMyNjQ3NzY0",
        avatar_url: "https://avatars.githubusercontent.com/u/32647764?v=4",
        gravatar_id: "",
        url: "https://api.github.com/users/DanielTamargo",
        html_url: "https://github.com/DanielTamargo",
        followers_url: "https://api.github.com/users/DanielTamargo/followers",
        following_url: "https://api.github.com/users/DanielTamargo/following{/other_user}",
        gists_url: "https://api.github.com/users/DanielTamargo/gists{/gist_id}",
        starred_url: "https://api.github.com/users/DanielTamargo/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/DanielTamargo/subscriptions",
        organizations_url: "https://api.github.com/users/DanielTamargo/orgs",
        repos_url: "https://api.github.com/users/DanielTamargo/repos",
        events_url: "https://api.github.com/users/DanielTamargo/events{/privacy}",
        received_events_url: "https://api.github.com/users/DanielTamargo/received_events",
        type: "User",
        site_admin: false
      },
      truncated: false
    }
  ]
  userGistsSubject$ = new BehaviorSubject<GitHubGistInterface[]>(this.gists)
  loadingSubject$ = new BehaviorSubject<boolean>(false)

  pageIndex: number = 0
  filtro_active: string = 'updated_at'
  filtro_direction: SortDirection = 'desc'
}
