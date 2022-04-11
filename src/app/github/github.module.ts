import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { GitHubSearchComponent } from './github-search/github-search.component';
import { GitHubComponent } from './github.component';
import { GitHubUserProfileComponent } from './github-user-profile/github-user-profile.component';
import { GitHubUserRepositoriesComponent } from './github-user-profile/github-user-repositories/github-user-repositories.component';
import { GitHubRepositoryDialogComponent } from './github-user-profile/github-user-repositories/github-repository-dialog/github-repository-dialog.component';
import { GitHubUserGistsComponent } from './github-user-profile/github-user-gists/github-user-gists.component';
import { GitHubUserDisplayComponent } from './github-user-display/github-user-display.component';
import { GithubApiExceededDialogComponent } from './github-api-exceeded-dialog/github-api-exceeded-dialog.component';

const declarations = [
  GitHubSearchComponent,
  GitHubComponent,
  GitHubUserProfileComponent,
  GitHubUserRepositoriesComponent,
  GitHubRepositoryDialogComponent,
  GitHubUserGistsComponent,
  GitHubUserDisplayComponent,
  GithubApiExceededDialogComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: declarations,
  // exports: declarations
})
export class GitHubModule { }
