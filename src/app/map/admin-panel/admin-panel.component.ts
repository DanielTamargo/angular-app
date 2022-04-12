import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  duration = 2000;
  
  constructor() { }

  ngOnInit(): void {
  }

}
