import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', './home.component.animations.scss'],
  animations: [
    trigger('slideLeft', [
      transition(':enter', [
        sequence([
          animate(`0s`, style({
            display: 'inline-flex',
            transform: 'translateX(110vw)',
            opacity: 0
          })),
          animate(`200ms ease-in-out`, style({
            transform: 'translateX(0)',
            opacity: 1
          })),
        ])
      ]),
      transition(':leave', [
        sequence([
          animate(`200ms ease-in-out`, style({ transform: 'translateX(110vw)' })),
          animate(`0s`, style({ display: 'none !important' })),
        ])
      ]),
    ]),
    trigger('slideRight', [
      transition(':enter', [
        sequence([
          animate(`0s`, style({
            display: 'inline-flex',
            transform: 'translateX(-110vw)',
            opacity: 0
          })),
          animate(`200ms ease-in-out`, style({
            transform: 'translateX(0)',
            opacity: 1
          })),
        ])
      ]),
      transition(':leave', [
        sequence([
          animate(`200ms ease-in-out`, style({ transform: 'translateX(-110vw)' })),
          animate(`0s`, style({ display: 'none !important' })),
        ])
      ]),
    ]),
  ]
})
export class HomeComponent implements OnInit {

  transition = 'transition: 250ms ease-in-out';
  homeDisplay: HTMLElement;
  currentDisplay: HTMLElement;

  slideLeft: string = 'translateX(-110vw)';
  slideRight: string = 'translateX(110vw)';
  direction: 'left' | 'right'

  displayState = 'home'

  constructor() { }

  ngOnInit(): void {
    this.homeDisplay = document.getElementById('display-home');

    this.homeInfoCardClickEvents();
    this.technologiesSectionClickEvents();
  }

  public goBackHome(id: string): void {
    this.displayState = 'home'
    this.homeDisplay.style.transform = 'translateX(0)';
  }

  public goNextDisplay(id: string) {
    const nextDisplay = document.getElementById(id);
    this.resetPosition(nextDisplay);

    this.currentDisplay.style.display = 'block'
    this.currentDisplay.style.transform = this.slideLeft;
    nextDisplay.style.transform = 'translateX(0)';

    this.currentDisplay = nextDisplay;
  }

  private resetPosition(elm: HTMLElement) {
    elm.style.transition = '';
    elm.style.transform = `translateX(110vw)`;
    elm.style.transition = this.transition;
  }

  private homeInfoCardClickEvents(): void {
    const infoCards = document.querySelectorAll('.info-card');
    for (let i = 0; i < infoCards.length; i++) {
      infoCards[i].addEventListener('click', () => {
        this.displayState = infoCards[i].id;
        if (i % 2 == 0) this.direction = 'right'
        else this.direction = 'left'

        //this.currentDisplay = document.getElementById(`display-${infoCards[i].id}`);

        if (this.direction == 'left') {
          this.homeDisplay.style.transform = this.slideLeft;
        } else {
          this.homeDisplay.style.transform = this.slideRight;
        }

        //this.currentDisplay.style.transform = 'translateX(0)';
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

  public technologiesSectionExpandEvent(evt: any): void {
    (evt.target as HTMLElement)?.parentElement?.classList.toggle('selected');
  }

}
