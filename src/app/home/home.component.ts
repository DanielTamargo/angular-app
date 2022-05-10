import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.techDetailsLogic();
  }

  private techDetailsLogic(): void {
    document.querySelectorAll('.technologies_content_details_header')
      ?.forEach(elm => {
        (elm as HTMLElement).addEventListener('click', function() { // <- no arrow function porque así tenemos contexto para utilizar this
          this.parentElement.classList.toggle('selected');
        });
      });
  }

}
