import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html',
  styleUrls: ['./github.component.css'],
  animations: [ // TODO
    trigger('inOut', [
      state('in', style({
        opacity: 1,
        color: 'white',
        backgroundColor: 'red'
      })),
      /* 
      state('void', style({
        opacity: 0
      })),
      */
      transition('void <=> in', animate(1000)),
    ]),
  ]
})
export class GitHubComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
