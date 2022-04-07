import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

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

  constructor() { }

  ngOnInit(): void {
  }

}
