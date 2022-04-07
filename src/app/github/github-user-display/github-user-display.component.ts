import { Component, Input, OnInit } from '@angular/core';
import { GitHubBasicUserInterface } from 'src/app/shared/interfaces/github-basicuser.interface';

/**
 * Nota:
 * Este componente será utilizado para displayear una mini tarjeta con la información de los usuarios, 
 *  se utilizará tanto para mostrar los followers, como los followings, como los recientes
 */

@Component({
  selector: 'app-github-user-display',
  templateUrl: './github-user-display.component.html',
  styleUrls: ['./github-user-display.component.css']
})
export class GitHubUserDisplayComponent implements OnInit {

  @Input('user') user: GitHubBasicUserInterface;

  constructor() { }

  ngOnInit(): void {
  }

}
