import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

// NgRx
import { StoreModule } from '@ngrx/store';
import { taskListReducer } from './tasklist/store/tasklist.reducer';

// Componentes sueltos
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';

// Módules refactorizados
import { GitHubModule } from './github/github.module';
import { TaskListModule } from './tasklist/tasklist.module';
import { MapModule } from './map/map.module';
import { SharedModule } from './shared/shared.module';

// Interceptors
import { AuthInterceptor } from './tasklist/auth.interceptor';
import { TasklistService } from './tasklist/services/tasklist.service';
import { InfoCardComponent } from './home/info-card/info-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    InfoCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    GitHubModule,
    TaskListModule,
    MapModule,
    StoreModule.forRoot({ taskList: taskListReducer }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true, deps: [TasklistService] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
