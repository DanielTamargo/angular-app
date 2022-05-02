import { Location } from "@angular/common";
import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

import { NavbarComponent } from "./navbar.component";

describe('NavbarComponent', () => {
  let component: NavbarComponent
  let fixture: ComponentFixture<NavbarComponent>

  let home: DebugElement;
  let github: DebugElement;
  let tasklist: DebugElement;
  let map: DebugElement;

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

    home = fixture.debugElement.query(By.css('[routerLink="/"]'))
    github = fixture.debugElement.query(By.css('[routerLink="/github"]'))
    tasklist = fixture.debugElement.query(By.css('[routerLink="/tasklist"]'))
    map = fixture.debugElement.query(By.css('[routerLink="/map"]'))
  })

  it('should create the navbar', () => {
    expect(component).toBeTruthy()
  })

  it('should contain links', () => {
    expect(home).toBeTruthy()
    expect(github).toBeTruthy()
    expect(tasklist).toBeTruthy()
    expect(map).toBeTruthy()
  })

  /* Tests de navegación */
  it('should navigate to home', fakeAsync(() => {
    let location: Location = TestBed.inject(Location);

    (home.nativeElement as HTMLButtonElement).click()
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/')
    })
  }))
  it('should navigate to github', fakeAsync(() => {
    let location: Location = TestBed.inject(Location);

    (github.nativeElement as HTMLButtonElement).click()
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/github')
    })
  }))
  it('should navigate to tasklist', fakeAsync(() => {
    let location: Location = TestBed.inject(Location);

    (tasklist.nativeElement as HTMLButtonElement).click()
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/tasklist')
    })
  }))
  it('should navigate to map', fakeAsync(() => {
    let location: Location = TestBed.inject(Location);

    (map.nativeElement as HTMLButtonElement).click()
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/map')
    })
  }))
  
})

@Component({ template: '' })
class DummyComponent { }