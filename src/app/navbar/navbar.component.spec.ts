import { Location } from "@angular/common";
import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { GitHubTestHelper } from "../github/github-test-helper";

import { NavbarComponent } from "./navbar.component";

describe('NavbarComponent', () => {
  let component: NavbarComponent
  let fixture: ComponentFixture<NavbarComponent>
  let ghHelper: GitHubTestHelper<NavbarComponent>

  let home: DebugElement
  let github: DebugElement
  let tasklist: DebugElement
  let map: DebugElement

  beforeEach(fakeAsync(() => TestBed.configureTestingModule({
    imports: [
      BrowserAnimationsModule,
      RouterTestingModule.withRoutes(
        [
          { path: '', component: DummyComponent },
          { path: 'github', component: DummyComponent },
          { path: 'tasklist', component: DummyComponent },
          { path: 'map', component: DummyComponent },
          { path: 'home', redirectTo: '' },
        ]
      )
    ],
    declarations: [ NavbarComponent ]
  }).compileComponents()))

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent)
    component = fixture.debugElement.componentInstance
    ghHelper = new GitHubTestHelper(fixture)

    home = ghHelper.getFirstElement('[routerLink="/"]')
    github = ghHelper.getFirstElement('[routerLink="/github"]')
    tasklist = ghHelper.getFirstElement('[routerLink="/tasklist"]')
    map = ghHelper.getFirstElement('[routerLink="/map"]')
  })

  describe('Navbar DOM', () => {
    it('should create the navbar', () => {
      expect(component).toBeTruthy()
    })

    it('should contain links', () => {
      expect(home).toBeTruthy()
      expect(github).toBeTruthy()
      expect(tasklist).toBeTruthy()
      expect(map).toBeTruthy()
    })
  })

  /* Tests de navegación */
  describe('Navbar Navigation', () => {
    let location: Location

    beforeEach(() => {
      location = TestBed.inject(Location);
    })

    it('should navigate to home', fakeAsync(() => {
      (home.nativeElement as HTMLButtonElement).click()
      fixture.detectChanges()
      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/')
      })
    }))

    it('should navigate to github', fakeAsync(() => {
      (github.nativeElement as HTMLButtonElement).click()
      fixture.detectChanges()
      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/github')
      })
    }))

    it('should navigate to tasklist', fakeAsync(() => {
      (tasklist.nativeElement as HTMLButtonElement).click()
      fixture.detectChanges()
      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/tasklist')
      })
    }))

    it('should navigate to map', fakeAsync(() => {
      (map.nativeElement as HTMLButtonElement).click()
      fixture.detectChanges()
      fixture.whenStable().then(() => {
        expect(location.path()).toBe('/map')
      })
    }))

    it('should change succesfully navSlideState when loaded url is /map', () => {
      spyOn(component, 'getLocationPathName').and.returnValue('/map')
      fixture.detectChanges()
      expect(component.navSlideState).toBe('map')
    })
  })

  // TODO
/*
  describe('Navbar Navigation Color Changes', () => {
    let initialColor: string
    let nav: any

    beforeEach(() => {
      fixture.detectChanges()
      nav = ghHelper.getFirstElement('nav')
      // https://developer.mozilla.org/es/docs/Web/API/Window/getComputedStyle
      initialColor = getComputedStyle(nav).backgroundColor
    })

    it('should change color after navigating', fakeAsync(() => {
      (map.nativeElement as HTMLButtonElement).click()
      tick(50)

      fixture.detectChanges()

      debugger
    }))

  })
 */
})

@Component({ template: '' })
class DummyComponent { }
