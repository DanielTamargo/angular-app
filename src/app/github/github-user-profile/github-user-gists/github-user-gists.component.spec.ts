import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
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
import { GitHubTestHelper } from "../../github-test-helper";

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

  it('should create the table AND contain 3 gists', () => {
    fixture.detectChanges()
    const tr_repos = fixture.debugElement.queryAll(By.css('tbody tr'))
    expect(tr_repos.length == 3).toBeTrue()
  })

  it("first gists's file should be 'web-component.md (Markdown)'", () => {
    fixture.detectChanges()
    const tr_gists = fixture.debugElement.queryAll(By.css('tbody tr'))
    expect((tr_gists[0].children[0].children[0].nativeElement as HTMLLinkElement).innerText).toBe('web-component.md (Markdown)')
  })

  it("after resorting list by updated at (asc) first gists's file should NOT be 'web-component.md (Markdown)'", () => {
    fixture.detectChanges()

    const sorts = fixture.debugElement.queryAll(By.css('.mat-sort-header-content'))
    const sortCreatedAt = 
      sorts.find(
        sort => (sort.nativeNode as HTMLElement).innerText.toLocaleLowerCase().trim() == 'updated at'
      ).nativeElement as HTMLButtonElement

    sortCreatedAt.click()
    fixture.detectChanges()

    const tr_gists = fixture.debugElement.queryAll(By.css('tbody tr'))
    const tr_gist_filename = (tr_gists[0].children[0].children[0].nativeElement as HTMLElement).innerText
    expect(tr_gist_filename == 'web-component.md (Markdown)').toBeFalse()

  })
})

class GitHubMockedService {
  gists: GitHubGistInterface[] = GitHubTestHelper.githubGists
  userGistsSubject$ = new BehaviorSubject<GitHubGistInterface[]>(this.gists)
  loadingSubject$ = new BehaviorSubject<boolean>(false)

  pageIndex: number = 0
  filtro_active: string = 'updated_at'
  filtro_direction: SortDirection = 'desc'
}