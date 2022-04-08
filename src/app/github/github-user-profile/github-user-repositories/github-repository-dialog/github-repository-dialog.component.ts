import { Component, OnInit } from '@angular/core';
import { GitHubContributorInterface } from 'src/app/shared/interfaces/github-contributor.interface';
import { GitHubRepoInterface } from 'src/app/shared/interfaces/github-repo.interface';
import { GitHubService } from 'src/app/shared/services/github.service';

@Component({
  selector: 'app-github-repository-dialog',
  templateUrl: './github-repository-dialog.component.html',
  styleUrls: ['./github-repository-dialog.component.scss']
})
export class GitHubRepositoryDialogComponent implements OnInit {

  repo: GitHubRepoInterface;
  repoContributors: GitHubContributorInterface[];
  totalCommits: number = 0;

  constructor(private githubService: GitHubService) { }

  ngOnInit(): void {
    // Obtenemos el repositorio seleccionado
    this.repo = this.githubService.selectedRepository;
    this.repoContributors = this.githubService.selectedRepositoryContributors;
    
    // Recuento de commits totales
    this.repoContributors.map(contributor => {
      this.totalCommits += contributor.contributions;
    });
  }

  setRepo(): void {

  }

}
