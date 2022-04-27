import { Component, OnInit } from '@angular/core';
import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';


const NAV_LINKS = [ 'home', 'github', 'tasklist', 'map' ];
const SLIDER_COLORS = [
  'rgb(8, 0, 169)',
  'rgb(8, 0, 169)',
  'rgb(25, 135, 84)',
  'rgb(255, 64, 129)',
];
const NAV_COLORS = [
  'rgb(201, 223, 255)',
  'rgb(201, 223, 255)',
  'rgb(157, 237, 173)',
  'rgb(255, 204, 221)',
 ];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('colorChange', [
      state(NAV_LINKS[0], style({ backgroundColor: NAV_COLORS[0] })),
      state(NAV_LINKS[1], style({ backgroundColor: NAV_COLORS[1] })),
      state(NAV_LINKS[2], style({ backgroundColor: NAV_COLORS[2] })),
      state(NAV_LINKS[3], style({ backgroundColor: NAV_COLORS[3] })),
      transition('* <=> *', animate(`200ms ease-in-out`)),
    ]),
    trigger('sliderColorChange', [
      state(NAV_LINKS[0], style({ backgroundColor: SLIDER_COLORS[0] })),
      state(NAV_LINKS[1], style({ backgroundColor: SLIDER_COLORS[1] })),
      state(NAV_LINKS[2], style({ backgroundColor: SLIDER_COLORS[2] })),
      state(NAV_LINKS[3], style({ backgroundColor: SLIDER_COLORS[3] })),
      transition('* <=> *', animate(`200ms ease-in-out`)),
    ]),
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
      //transition(':leave', animate(`200ms ease-in-out`)), //<- no funciona como espero
    ]),
    trigger('navSlide', [
      state(NAV_LINKS[0], style({ top: '0' })),
      state(NAV_LINKS[1], style({ top: 'calc(10vh + 70px)' })),
      state(NAV_LINKS[2], style({ top: 'calc(10vh + (70px * 2))' })),
      state(NAV_LINKS[3], style({ top: 'calc(10vh + (70px * 3))' })),
      transition('* <=> *', animate(`200ms ease-in-out`)),
    ]),
    trigger('navSlideSmall', [
      state(NAV_LINKS[0], style({ right: 'calc(100% - 50px)' })), //si utilizo left: 0 la animación da un tirón al cambiar
      state(NAV_LINKS[1], style({ right: 'calc(100% - 100vw + (50px * 2) + 15px)' })),
      state(NAV_LINKS[2], style({ right: 'calc(100% - 100vw + 50px + 15px)' })),
      state(NAV_LINKS[3], style({ right: 'calc(100% - 100vw + 15px)' })),
      transition('* <=> *', animate(`200ms ease-in-out`)),
    ]),
  ]
})
export class NavbarComponent implements OnInit {
  navSlideState = NAV_LINKS[0];

  constructor(private router: Router) {
    /**
     * Nos suscribimos a los eventos de cambio de navegación 
     * ya que de no hacerlo si el usuario intenta navegar hacia atrás el slider no se movería
     */
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe((val: NavigationEnd) => {
        const url = val.url;
        if (url.includes('github')) this.navSlideState = NAV_LINKS[1]; 
        else if (url.includes('tasklist')) this.navSlideState = NAV_LINKS[2]; 
        else if (url.includes('map')) this.navSlideState = NAV_LINKS[3]; 
        else this.navSlideState = NAV_LINKS[0]; 
      });
  }

  ngOnInit(): void {
    // Comprobamos en qué ruta está para saber dónde poner el navSlider
    NAV_LINKS.forEach(navLink => {
      if (window.location.href.includes(navLink)) {
        this.navSlideState = navLink;
      }
    })

  }

  openGitHubRepo(): void {
    // Removed: fácil de missclickear en móvil y molesto que saque una ventana (aunque la app no será utilizada apenas por lo que tampoco le daré muchas vueltas, aunque ya estoy escribiendo todo esto así que alguna vuelta sí que le estás dando eh Dani... y tú..., tú qué haces leyendo esto? bueno, si has llegado hasta aquí te contaré un detalle sobre mí que quizás no conozcas. Durante mucho tiempo estuve perdido, no encontraba una profesión ni objetivo que me motivasen, ver que el resto avanza y logra sus metas mientras estaba estancado hacía que todo sea aún si cabe más sofocante. Para mí la programación fue ese rayo de sol que entra por la ventana en un día oscuro, ese momento donde el tiempo se detiene y sabes que tienes la oportunidad de volver a empezar. Con respecto a mis compañeros llevo años de retraso, ¿y qué?, eso no me va a parar, es más, es una maldita motivación para darlo todo. Yo soy yo y tengo mucho que demostrar.)
    window.open('https://github.com/DanielTamargo/angular-app', '_blank');
  }

}
