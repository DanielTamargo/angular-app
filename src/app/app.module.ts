import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar/navbar.component';
import { GitHubSearchComponent } from './github/github-search/github-search.component';
import { HomeComponent } from './home/home/home.component';
import { GitHubComponent } from './github/github.component';
import { GitHubUserProfileComponent } from './github/github-user-profile/github-user-profile.component';
import { GitHubUserRepositoriesComponent } from './github/github-user-profile/git-hub-user-repositories/github-user-repositories.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GitHubSearchComponent,
    HomeComponent,
    GitHubComponent,
    GitHubUserProfileComponent,
    GitHubUserRepositoriesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatInputModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
