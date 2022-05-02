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
import { GitHubRepoInterface } from "../../interfaces/github-repo.interface";
import { GitHubService } from "../../services/github.service";
import { GitHubUserRepositoriesComponent } from "./github-user-repositories.component";

describe('GitHubUserRepositoriesComponent', () => {
  let component: GitHubUserRepositoriesComponent
  let fixture: ComponentFixture<GitHubUserRepositoriesComponent>

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
      GitHubUserRepositoriesComponent, 
      SizeFormatterPipe
    ],
    providers: [
      // Override del GitHubService por el GitHubMockedService
      { provide: GitHubService, useClass: GitHubMockedService }
    ]
  }).compileComponents()))

  beforeEach(() => {
    fixture = TestBed.createComponent(GitHubUserRepositoriesComponent)
    component = fixture.debugElement.componentInstance
  })

  it('should create the table AND contain 2 repos', fakeAsync(() => {
    // Comprobar que existen repositorios añadidos a la tabla
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      const tr_repos = fixture.debugElement.queryAll(By.css('tbody tr'))
      expect(tr_repos.length == 2).toBeTrue()
    })
  }))

 it("first repo's name should be 'angular-app'", fakeAsync(() => {
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      const tr_repos = fixture.debugElement.queryAll(By.css('tbody tr'))
      expect((tr_repos[0].children[0].children[0].nativeElement as HTMLElement).innerHTML).toBe('angular-app')
    })
  }))

  it("first repo's link should be 'https://github.com/DanielTamargo/angular-app'", fakeAsync(() => {
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      const tr_repos = fixture.debugElement.queryAll(By.css('tbody tr'))
      expect((tr_repos[0].children[0].children[0].nativeElement as HTMLLinkElement).href).toBe('https://github.com/DanielTamargo/angular-app')
    })
  }))

  it("after resorting list first repo's name should NOT be 'angular-app'", fakeAsync(() => {
    // Modificamos el ancho de la pantalla porque si es bajo ocultará la columna created_at
    // https://jasmine.github.io/tutorials/spying_on_properties
    spyOnProperty(window, 'innerWidth').and.returnValue(800)
    window.dispatchEvent(new Event('resize'))
    fixture.detectChanges()

    const sorts = fixture.debugElement.queryAll(By.css('.mat-sort-header-content'))
    const sortCreatedAt = sorts.find(sort => (sort.nativeNode as HTMLElement).innerText.toLocaleLowerCase() == 'created at')
    const sortCreatedAtButton = (sortCreatedAt.nativeElement as HTMLButtonElement)
    sortCreatedAtButton.click()
    sortCreatedAtButton.click()
    fixture.detectChanges()

    fixture.whenStable().then(() => {
      const tr_repos = fixture.debugElement.queryAll(By.css('tbody tr'))
      expect((tr_repos[0].children[0].children[0].nativeElement as HTMLElement).innerHTML == 'angular-app').toBeFalse()
    })

    discardPeriodicTasks()
  }))

})

class GitHubMockedService {
  repos: GitHubRepoInterface[] = [
      {
        id: 478032792,
        node_id: "R_kgDOHH4zmA",
        name: "angular-app",
        full_name: "DanielTamargo/angular-app",
        private: false,
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
        html_url: "https://github.com/DanielTamargo/angular-app",
        description: "Aplicación creada para aprender y mejorar con Angular. Se dará uso de Angular, RxJS, Firebase, Angular Material, Bootstrap y Sass.",
        fork: false,
        url: "https://api.github.com/repos/DanielTamargo/angular-app",
        forks_url: "https://api.github.com/repos/DanielTamargo/angular-app/forks",
        keys_url: "https://api.github.com/repos/DanielTamargo/angular-app/keys{/key_id}",
        collaborators_url: "https://api.github.com/repos/DanielTamargo/angular-app/collaborators{/collaborator}",
        teams_url: "https://api.github.com/repos/DanielTamargo/angular-app/teams",
        hooks_url: "https://api.github.com/repos/DanielTamargo/angular-app/hooks",
        issue_events_url: "https://api.github.com/repos/DanielTamargo/angular-app/issues/events{/number}",
        events_url: "https://api.github.com/repos/DanielTamargo/angular-app/events",
        assignees_url: "https://api.github.com/repos/DanielTamargo/angular-app/assignees{/user}",
        branches_url: "https://api.github.com/repos/DanielTamargo/angular-app/branches{/branch}",
        tags_url: "https://api.github.com/repos/DanielTamargo/angular-app/tags",
        blobs_url: "https://api.github.com/repos/DanielTamargo/angular-app/git/blobs{/sha}",
        git_tags_url: "https://api.github.com/repos/DanielTamargo/angular-app/git/tags{/sha}",
        git_refs_url: "https://api.github.com/repos/DanielTamargo/angular-app/git/refs{/sha}",
        trees_url: "https://api.github.com/repos/DanielTamargo/angular-app/git/trees{/sha}",
        statuses_url: "https://api.github.com/repos/DanielTamargo/angular-app/statuses/{sha}",
        languages_url: "https://api.github.com/repos/DanielTamargo/angular-app/languages",
        stargazers_url: "https://api.github.com/repos/DanielTamargo/angular-app/stargazers",
        contributors_url: "https://api.github.com/repos/DanielTamargo/angular-app/contributors",
        subscribers_url: "https://api.github.com/repos/DanielTamargo/angular-app/subscribers",
        subscription_url: "https://api.github.com/repos/DanielTamargo/angular-app/subscription",
        commits_url: "https://api.github.com/repos/DanielTamargo/angular-app/commits{/sha}",
        git_commits_url: "https://api.github.com/repos/DanielTamargo/angular-app/git/commits{/sha}",
        comments_url: "https://api.github.com/repos/DanielTamargo/angular-app/comments{/number}",
        issue_comment_url: "https://api.github.com/repos/DanielTamargo/angular-app/issues/comments{/number}",
        contents_url: "https://api.github.com/repos/DanielTamargo/angular-app/contents/{+path}",
        compare_url: "https://api.github.com/repos/DanielTamargo/angular-app/compare/{base}...{head}",
        merges_url: "https://api.github.com/repos/DanielTamargo/angular-app/merges",
        archive_url: "https://api.github.com/repos/DanielTamargo/angular-app/{archive_format}{/ref}",
        downloads_url: "https://api.github.com/repos/DanielTamargo/angular-app/downloads",
        issues_url: "https://api.github.com/repos/DanielTamargo/angular-app/issues{/number}",
        pulls_url: "https://api.github.com/repos/DanielTamargo/angular-app/pulls{/number}",
        milestones_url: "https://api.github.com/repos/DanielTamargo/angular-app/milestones{/number}",
        notifications_url: "https://api.github.com/repos/DanielTamargo/angular-app/notifications{?since,all,participating}",
        labels_url: "https://api.github.com/repos/DanielTamargo/angular-app/labels{/name}",
        releases_url: "https://api.github.com/repos/DanielTamargo/angular-app/releases{/id}",
        deployments_url: "https://api.github.com/repos/DanielTamargo/angular-app/deployments",
        created_at: "2022-04-05T08:10:17Z",
        updated_at: "2022-04-26T07:51:53Z",
        pushed_at: "2022-04-27T06:39:36Z",
        git_url: "git://github.com/DanielTamargo/angular-app.git",
        ssh_url: "git@github.com:DanielTamargo/angular-app.git",
        clone_url: "https://github.com/DanielTamargo/angular-app.git",
        svn_url: "https://github.com/DanielTamargo/angular-app",
        homepage: "",
        size: 2840,
        stargazers_count: 0,
        watchers_count: 0,
        language: "TypeScript",
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 0,
        license: null,
        allow_forking: true,
        is_template: false,
        topics: [],
        visibility: "public",
        forks: 0,
        open_issues: 0,
        watchers: 0,
        default_branch: "main"
      },
      {
        id: 298891859,
        node_id: "MDEwOlJlcG9zaXRvcnkyOTg4OTE4NTk=",
        name: "arkanoid-unity",
        full_name: "DanielTamargo/arkanoid-unity",
        private: false,
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
        html_url: "https://github.com/DanielTamargo/arkanoid-unity",
        description: "Juego Arkanoid desarrollado en Unity con Firebase Realtime para almacenar las puntuaciones de los usuarios.",
        fork: false,
        url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity",
        forks_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/forks",
        keys_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/keys{/key_id}",
        collaborators_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/collaborators{/collaborator}",
        teams_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/teams",
        hooks_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/hooks",
        issue_events_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/issues/events{/number}",
        events_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/events",
        assignees_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/assignees{/user}",
        branches_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/branches{/branch}",
        tags_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/tags",
        blobs_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/git/blobs{/sha}",
        git_tags_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/git/tags{/sha}",
        git_refs_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/git/refs{/sha}",
        trees_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/git/trees{/sha}",
        statuses_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/statuses/{sha}",
        languages_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/languages",
        stargazers_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/stargazers",
        contributors_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/contributors",
        subscribers_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/subscribers",
        subscription_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/subscription",
        commits_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/commits{/sha}",
        git_commits_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/git/commits{/sha}",
        comments_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/comments{/number}",
        issue_comment_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/issues/comments{/number}",
        contents_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/contents/{+path}",
        compare_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/compare/{base}...{head}",
        merges_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/merges",
        archive_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/{archive_format}{/ref}",
        downloads_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/downloads",
        issues_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/issues{/number}",
        pulls_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/pulls{/number}",
        milestones_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/milestones{/number}",
        notifications_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/notifications{?since,all,participating}",
        labels_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/labels{/name}",
        releases_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/releases{/id}",
        deployments_url: "https://api.github.com/repos/DanielTamargo/arkanoid-unity/deployments",
        created_at: "2020-09-26T20:10:31Z",
        updated_at: "2022-03-30T08:21:48Z",
        pushed_at: "2020-09-26T20:11:52Z",
        git_url: "git://github.com/DanielTamargo/arkanoid-unity.git",
        ssh_url: "git@github.com:DanielTamargo/arkanoid-unity.git",
        clone_url: "https://github.com/DanielTamargo/arkanoid-unity.git",
        svn_url: "https://github.com/DanielTamargo/arkanoid-unity",
        homepage: "",
        size: 67096,
        stargazers_count: 0,
        watchers_count: 0,
        language: "C#",
        has_issues: true,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 0,
        license: {
          key: "apache-2.0",
          name: "Apache License 2.0",
          spdx_id: "Apache-2.0",
          url: "https://api.github.com/licenses/apache-2.0",
          node_id: "MDc6TGljZW5zZTI="
        },
        allow_forking: true,
        is_template: false,
        topics: [],
        visibility: "public",
        forks: 0,
        open_issues: 0,
        watchers: 0,
        default_branch: "master"
      }
  ]
  userReposSubject$ = new BehaviorSubject<GitHubRepoInterface[]>(this.repos)
  loadingSubject$ = new BehaviorSubject<boolean>(false)

  pageIndex: number = 0
  filtro_active: string = 'updated_at'
  filtro_direction: SortDirection = 'desc'
}
