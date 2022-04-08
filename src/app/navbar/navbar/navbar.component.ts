import { Component, OnInit } from '@angular/core';
import { animate, sequence, state, style, transition, trigger } from '@angular/animations';

  
const NAV_LINKS = [ 'home', 'github', 'tasklist', 'map' ];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('inX', [
      state('void', style({ transform: 'translateX(-100%)' })),
      state('*', style({ transform: 'translateX(0)' })),
      transition(':enter', sequence([
        animate(`200ms ease-in-out`, style({})),
        animate(`600ms ease-in-out`),
      ]))
    ]),
    trigger('inY', [
      state('void', style({ transform: 'translateY(-100%)' })),
      state('*', style({ transform: 'translateY(0)' })),
      transition(':enter', animate(`800ms ease-in-out`)),
      transition(':leave', animate(`200ms ease-in-out`)), //<- no funciona como espero
    ]),
    trigger('navSlide', [
      state(NAV_LINKS[0], style({ top: '0' })),
      state(NAV_LINKS[1], style({ top: 'calc(10vh + 70px)' })),
      state(NAV_LINKS[2], style({ top: 'calc(10vh + (70px * 2))' })),
      state(NAV_LINKS[3], style({ top: 'calc(10vh + (70px * 3))' })),
      transition('* <=> *', animate(`200ms ease-in-out`)),
    ]),
    trigger('navSlideSmall', [
      state(NAV_LINKS[0], style({ left: '0' })),
      state(NAV_LINKS[1], style({ right: 'calc(70px * 2)' })),
      state(NAV_LINKS[2], style({ right: '70px' })),
      state(NAV_LINKS[3], style({ right: '0' })),
      transition('* <=> *', animate(`200ms ease-in-out`)),
    ]),
  ]
})
export class NavbarComponent implements OnInit {
  navSlideState = NAV_LINKS[0];

  constructor() { }

  ngOnInit(): void {
    // Comprobamos en qué ruta está para saber dónde poner el navSlider
    NAV_LINKS.forEach(navLink => {
      if (window.location.href.includes(navLink)) {
        this.navSlideState = navLink;
      }
    })
    
  }

  openGitHubRepo(): void {
    // TODO fácil de missclickear en móvil y molesto que saque una ventana (aunque la app no será utilizada apenas por lo que tampoco le daré muchas vueltas, aunque ya estoy escribiendo todo esto así que alguna vuelta sí que le estás dando eh Dani... y tú..., tú qué haces leyendo esto? bueno, si has llegado hasta aquí te contaré un detalle sobre mí que quizás no conozcas. Durante mucho tiempo estuve perdido, no encontraba una profesión ni objetivo que me motivasen, ver que el resto avanza y logra sus metas mientras estaba estancado hacía que todo sea aún si cabe más sofocante. Para mí la programación fue ese rayo de sol que entra por la ventana en un día oscuro, ese momento donde el tiempo se detiene y sabes que tienes la oportunidad de volver a empezar. Con respecto a mis compañeros llevo años de retraso, ¿y qué?, eso no me va a parar, es más, es una maldita motivación para darlo todo. Yo soy yo y tengo mucho que demostrar.)
    window.open('https://github.com/DanielTamargo/angular-app', '_blank');
  }

}