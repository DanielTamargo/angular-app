import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { GitHubSearchComponent } from './github-search/github-search.component';
import { GitHubComponent } from './github.component';
import { GitHubUserProfileComponent } from './github-user-profile/github-user-profile.component';
import { GitHubUserRepositoriesComponent } from './github-user-profile/github-user-repositories/github-user-repositories.component';
import { GitHubRepositoryDialogComponent } from './github-user-profile/github-user-repositories/github-repository-dialog/github-repository-dialog.component';
import { GitHubUserGistsComponent } from './github-user-profile/github-user-gists/github-user-gists.component';
import { GitHubUserDisplayComponent } from './github-user-display/github-user-display.component';
import { GithubApiExceededDialogComponent } from './github-api-exceeded-dialog/github-api-exceeded-dialog.component';
import { RetrieveGistFileNamesPipe } from './pipes/retrieve-gist-file-names.pipe';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    GitHubSearchComponent,
    GitHubComponent,
    GitHubUserProfileComponent,
    GitHubUserRepositoriesComponent,
    GitHubRepositoryDialogComponent,
    GitHubUserGistsComponent,
    GitHubUserDisplayComponent,
    GithubApiExceededDialogComponent,
    RetrieveGistFileNamesPipe
  ],
  exports: [
  ]
})
export class GitHubModule { }
