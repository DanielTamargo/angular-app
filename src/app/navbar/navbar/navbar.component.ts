import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  gitHubLogoSrc = 'assets/img/logo-github.svg';
  gitHubLogoAlt = 'GitHub Logo'

  constructor() { }

  ngOnInit(): void {
  }

}
