import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";

describe('AppComponent', () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>

  beforeEach(() => TestBed.configureTestingModule({
    imports: [ RouterTestingModule ],
    declarations: [ AppComponent, NavbarComponent ]
  }).compileComponents())

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.debugElement.componentInstance
  })

  it('should create the app', () => {
    expect(component).toBeTruthy()
  })

  it('should contain navbar', () => {
    const navbar = fixture.debugElement.query(By.css('app-navbar'))
    expect(navbar).toBeTruthy()
  })
  
})