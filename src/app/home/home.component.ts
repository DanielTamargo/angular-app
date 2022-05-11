import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  transition = 'transition: 250ms ease-in-out';
  homeDisplay: HTMLElement;
  currentDisplay: HTMLElement;
  slideLeft: string = 'translateX(-110vw)';

  constructor() { }

  ngOnInit(): void {
    this.homeDisplay = document.getElementById('display-home');

    this.homeInfoCardClickEvents();
    this.technologiesSectionClickEvents();
  }

  goBackHome(id: string): void {
    document.getElementById(id).style.transform = this.slideLeft;
    this.homeDisplay.style.transform = 'translateX(0)';

    this.resetPosition(this.currentDisplay);
  }

  goNextDisplay(id: string) {
    const nextDisplay = document.getElementById(id);

    nextDisplay.style.transition = '';
    nextDisplay.style.transform = `translateX(110vw)`;
    nextDisplay.style.transition = this.transition;

    this.currentDisplay.style.transform = this.slideLeft;
    nextDisplay.style.transform = 'translateX(0)';

    this.currentDisplay = nextDisplay;
  }

  resetPosition(elm: HTMLElement) {
    elm.style.transition = '';
    elm.style.transform = `translateX(110vw)`;
    elm.style.transition = this.transition;
  }

  private homeInfoCardClickEvents(): void {
    const infoCards = document.querySelectorAll('.info-card');
    for (let i = 0; i < infoCards.length; i++) {
      infoCards[i].addEventListener('click', () => {
        this.currentDisplay = document.getElementById(`display-${infoCards[i].id}`);
        this.homeDisplay.style.transform = this.slideLeft;
        this.currentDisplay.style.transform = 'translateX(0)';
      })
    }
  }

  private technologiesSectionClickEvents(): void {
    document.querySelectorAll('.technologies_content_details_header')
      ?.forEach(elm => {
        (elm as HTMLElement).addEventListener('click', function() { // <- no arrow function porque así tenemos contexto para utilizar this
          this.parentElement.classList.toggle('selected');
        });
      });
  }

}
