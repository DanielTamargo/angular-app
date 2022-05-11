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
  slideRight: string = 'translateX(110vw)';
  direction: 'left' | 'right'

  constructor() { }

  ngOnInit(): void {
    this.homeDisplay = document.getElementById('display-home');

    this.homeInfoCardClickEvents();
    this.technologiesSectionClickEvents();
  }

  goBackHome(id: string): void {
    if (this.direction == 'left') document.getElementById(id).style.transform = this.slideRight;
    else  document.getElementById(id).style.transform = this.slideLeft;

    this.homeDisplay.style.transform = 'translateX(0)';
  }

  goNextDisplay(id: string) {
    const nextDisplay = document.getElementById(id);
    this.resetPosition(nextDisplay);

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
        if (i % 2 == 0) this.direction = 'right'
        else this.direction = 'left'

        this.currentDisplay = document.getElementById(`display-${infoCards[i].id}`);

        if (this.direction == 'left') {
          this.homeDisplay.style.transform = this.slideLeft;
        } else {
          this.homeDisplay.style.transform = this.slideRight;
        }

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
