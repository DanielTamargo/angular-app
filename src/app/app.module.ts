import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

// import { A11yModule } from '@angular/cdk/a11y';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar/navbar.component';
import { GitHubSearchComponent } from './github/github-search/github-search.component';
import { HomeComponent } from './home/home/home.component';
import { GitHubComponent } from './github/github.component';
import { GitHubUserProfileComponent } from './github/github-user-profile/github-user-profile.component';
import { GitHubUserRepositoriesComponent } from './github/github-user-profile/github-user-repositories/github-user-repositories.component';
import { SizeFormatterPipe } from './shared/pipes/size-formatter.pipe';
import { GitHubRepositoryDialogComponent } from './github/github-user-profile/github-user-repositories/github-repository-dialog/github-repository-dialog.component';
import { GitHubUserGistsComponent } from './github/github-user-profile/github-user-gists/github-user-gists.component';
import { RetrieveGistFileNamesPipe } from './shared/pipes/retrieve-gist-file-names.pipe';
import { GitHubUserDisplayComponent } from './github/github-user-display/github-user-display.component';
import { GithubApiExceededDialogComponent } from './github/github-api-exceeded-dialog/github-api-exceeded-dialog.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GitHubSearchComponent,
    HomeComponent,
    GitHubComponent,
    GitHubUserProfileComponent,
    GitHubUserRepositoriesComponent,
    SizeFormatterPipe,
    GitHubRepositoryDialogComponent,
    GitHubUserGistsComponent,
    RetrieveGistFileNamesPipe,
    GitHubUserDisplayComponent,
    GithubApiExceededDialogComponent,
    TasklistComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    // A11yModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
