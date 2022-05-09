import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MatCardModule } from "@angular/material/card"
import { GitHubTestHelper } from "../github-test-helper"
import { GitHubUserDisplayComponent } from "./github-user-display.component"

describe('GitHubApiExceededDialogComponent', () => {
  let component: GitHubUserDisplayComponent
  let fixture: ComponentFixture<GitHubUserDisplayComponent>
  let ghHelper: GitHubTestHelper<GitHubUserDisplayComponent>

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ MatCardModule ],
    declarations: [ GitHubUserDisplayComponent ]
  }).compileComponents())

  beforeEach(() => {
    fixture = TestBed.createComponent(GitHubUserDisplayComponent)
    component = fixture.debugElement.componentInstance
    ghHelper = new GitHubTestHelper(fixture)

    component.user = GitHubTestHelper.dummyGithubUser
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should instance img correctly', () => {
    expect(ghHelper.getFirstElement('.user-display-img')).toBeTruthy()
  })

})
