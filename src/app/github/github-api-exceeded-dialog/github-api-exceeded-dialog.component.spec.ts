import { ComponentFixture, TestBed } from "@angular/core/testing"
import { GitHubTestHelper } from "../github-test-helper"
import { GithubApiExceededDialogComponent } from "./github-api-exceeded-dialog.component"

describe('GitHubApiExceededDialogComponent', () => {
  let component: GithubApiExceededDialogComponent
  let fixture: ComponentFixture<GithubApiExceededDialogComponent>
  let ghHelper: GitHubTestHelper<GithubApiExceededDialogComponent>

  beforeEach(() => TestBed.configureTestingModule({
    imports: [  ],
    declarations: [ GithubApiExceededDialogComponent ]
  }).compileComponents())

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubApiExceededDialogComponent)
    component = fixture.debugElement.componentInstance
    ghHelper = new GitHubTestHelper(fixture)
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should set title correctly', () => {
    expect(ghHelper.getFirstElement('h1').nativeElement.innerText.trim()).toBe('API is exhausted')
  })

})
