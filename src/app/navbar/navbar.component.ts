import { Component, OnInit } from '@angular/core';
import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';


const NAV_LINKS = [ 'home', 'github', 'tasklist', 'map' ];
const SLIDER_COLORS = [
  'rgb(47, 47, 47)',
  'rgb(8, 0, 169)',
  'rgb(25, 135, 84)',
  'rgb(255, 64, 129)',
];
const NAV_COLORS = [
  'rgb(185, 185, 185)',
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
      state(NAV_LINKS[0], style({ right: 'calc(100% - 50px)' })), //si utilizo left: 0 la animaci??n da un tir??n al cambiar
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
     * Nos suscribimos a los eventos de cambio de navegaci??n
     * ya que de no hacerlo si el usuario intenta navegar hacia atr??s el slider no se mover??a
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
    const locationPathName = this.getLocationPathName()

    // Comprobamos en qu?? ruta est?? para saber d??nde poner el navSlider
    NAV_LINKS.forEach(navLink => {
      if (locationPathName.includes(navLink)) {
        this.navSlideState = navLink;
      }
    })

  }

  public getLocationPathName(): string {
    return window.location.href
  }

  /*openGitHubRepo(): void {
    // Removed: f??cil de missclickear en m??vil y molesto que saque una ventana (aunque la app no ser?? utilizada apenas por lo que tampoco le dar?? muchas vueltas, aunque ya estoy escribiendo todo esto as?? que alguna vuelta s?? que le est??s dando eh Dani... y t??..., t?? qu?? haces leyendo esto? bueno, si has llegado hasta aqu?? te contar?? un detalle sobre m?? que quiz??s no conozcas. Durante mucho tiempo estuve perdido, no encontraba una profesi??n ni objetivo que me motivasen, ver que el resto avanza y logra sus metas mientras estaba estancado hac??a que todo sea a??n si cabe m??s sofocante. Para m?? la programaci??n fue ese rayo de sol que entra por la ventana en un d??a oscuro, ese momento donde el tiempo se detiene y sabes que tienes la oportunidad de volver a empezar. Con respecto a mis compa??eros llevo a??os de retraso, ??y qu???, eso no me va a parar, es m??s, es una maldita motivaci??n para darlo todo. Yo soy yo y tengo mucho que demostrar.)
    window.open('https://github.com/DanielTamargo/angular-app', '_blank');
  }*/

}
