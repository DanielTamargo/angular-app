import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { GitHubService } from '../shared/services/github.service';
import { GithubApiExceededDialogComponent } from './github-api-exceeded-dialog/github-api-exceeded-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css'],
  animations: [ // TODO
    trigger('inOut', [
      state('void', style({ opacity: 0, /* transform: 'translateX(-100%)' */ })),
      state('*', style({ opacity: 1, /* transform: 'translateX(0)' */ })),
      transition(':enter', animate(`1000ms ease-out`)),
      transition(':leave', animate(`1000ms ease-in`))
    ]),
  ]
})
export class GitHubComponent implements OnInit {
  
  apiRateExceededDialogSubscription$ = new Subscription;

  constructor(private dialog: MatDialog, private githubService: GitHubService, private router: Router) { }

  ngOnInit(): void {
    // Nos suscribimos a la posibilidad de exceder el límite de peticiones y entonces mostrar un modal
    this.apiRateExceededDialogSubscription$ = this.githubService.rateLimitExceededSubject$.subscribe(show => {
      if (show) {
        let apiRateExceededDialog = this.dialog.open(GithubApiExceededDialogComponent);
        apiRateExceededDialog.afterClosed().subscribe(result => {
          this.router.navigate(['/']);
        });
      }
    })



  }

}
