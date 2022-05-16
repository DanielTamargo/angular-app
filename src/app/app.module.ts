import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// Componentes sueltos
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { InfoCardComponent } from './home/info-card/info-card.component';
import { DisplayControlsComponent } from './home/display-controls/display-controls.component';

// Módules refactorizados
import { GitHubModule } from './github/github.module';
import { TaskListModule } from './tasklist/tasklist.module';
import { MapModule } from './map/map.module';
import { SharedModule } from './shared/shared.module';

// Interceptors
import { AuthInterceptor } from './tasklist/auth.interceptor';
import { TasklistService } from './tasklist/services/tasklist.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    InfoCardComponent,
    DisplayControlsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    GitHubModule,
    TaskListModule,
    MapModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, deps: [TasklistService] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
