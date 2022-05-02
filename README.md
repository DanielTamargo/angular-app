# Angular APP

### **English**  
Hi there! 😊  
This is the *'personal, improvising while learning, random but cool'* mini-app I'm developing for myself as a way to learn Angular. If you're interested, have time or just bored you can give me any tips about angular, development in general (backend, frontend...) or any other programming stuff and it will help me so much!  

> Note: This is the app I'm using to understand and learn Angular so I'm awared that the code will be a little messy.  
Also, the rest of the README plus all the comments you'll find in the code are in spanish language (translating would take a lot of time and this is just a personal project for self-learning), but any questions or tips are welcome, feel free to talk to me!

----

### **Español**  
¡Hola! 😜  
Esta es la mini aplicación *'personal, improvisando mientras aprendo, random pero guay'* que estoy desarrollando para mí mismo para aprender todo lo posible sobre Angular. Si te interesa, tienes tiempo o simplemente te aburres, puedes darme consejos sobre angular, desarrollo en general (backend, frontend, ...) o cualquier otro tema de programación y me ayudarás mucho!  

> Nota: Esta aplicación es la que estoy usando para aprender Angular progresivamente, soy consciente de que el código puede tener partes un poco 'patada en la espalda a Angular o RxJS'.  

----

## Qué se utiliza en la aplicación

- [Angular](https://angular.io/) como framework de desarrollo front-end
- [RxJS](https://rxjs.dev/) dando uso a sus observables, bservers y operators
- [NgRx](https://ngrx.io/docs) para trabajar también la versión Redux de Angular
- [SASS](https://sass-lang.com/) para los estilos personalizados 'super duper'
- [Bootstrap](https://getbootstrap.com/) para el maquetado rápido y sencillo
- [Angular Material](https://next.material.angular.io/) como otra librería que ofrece componentes con estilos y comportamientos ya elaborados
- [Open Layers](https://openlayers.org/) para mostrar el mapa y sus capas
- APIs
  - [GitHub API](https://docs.github.com/en/rest)
  - [OpenDataSoft (provincias españa)](https://help.opendatasoft.com/apis/ods-search-v1/#record-search-api) 
- Angular + Firebase
  - [AngularFire](https://github.com/angular/angularfire) para tratar con Realtime Database
  - [FirebaseUI-Angular](https://github.com/RaphaelJenni/FirebaseUI-Angular) para mostrar un inicio de sesión de Google
  

*El repo está totalmente WIP, ¡sigo desarrollando la aplicación!*


**¡Ah!** Dispongo de unos **apuntes en castellano** que he ido tomando a lo largo de la formación que recibí **de Angular**, también están incompletos pero tienen bastante contenido a modo de introducción. El repositorio es **privado** pero si quieres los apuntes no tengo ningún problema en darles un repaso y proporcionártelos.  

----

> **Nota:**  
> Cuando generamos una aplicación buscamos que esta parezca mantener la información 'viva', es decir, que sea lo más coherente posibles y tenga cierta persistencia de datos haciendo que la experiencia del usuario sea agradable. A esto se le conoce como **estado de la aplicación**.  
>
> En Angular, para mantener el estado de tal manera que los componentes estén comunicados, compartan información y esta no se pierda al navegar de un sitio a otro cuando no queremos que eso suceda tenemos dos opciones, utilizar observables y sus respectivas suscripciones con RxJS, o dar uso de NgRx (administración de estado reactivo para Angular inspirado en Redux).  
> 
> Aprovechando que la aplicación consta de tres partes *(como si fueran 3 aplicaciones pequeñas independientes)* he decidido dar uso tanto de **RxJS** para las partes de GitHub y Map, como dar uso de **NgRx** para la parte de TaskList. Intentando aprender todo lo posible, porque ese es el objetivo de este proyecto, **aprender**.   

----

## Documentaciones consultadas

- AngularFire 
  - [Auth](https://github.com/angular/angularfire/blob/master/docs/auth/getting-started.md)
  - [Realtime Database: Lists](https://github.com/angular/angularfire/blob/master/docs/rtdb/lists.md)
- RxJS
  - [Subject](https://rxjs.dev/guide/subject)
  - [Subscription](https://rxjs.dev/guide/subscription)
  - [Operators](https://rxjs.dev/guide/operators)
- NgRx
  - [Store](https://ngrx.io/guide/store)
  - [Effects](https://ngrx.io/guide/effects)
  - [Actions](https://ngrx.io/guide/store/actions)
  - [Migraciones (ya que inicialmente me basé en ejemplos obsoletos)](https://ngrx.io/guide/migration/v13)
  - [Guía NgRx en castellano](https://academia-binaria.com/el-patron-redux-con-ngrx-en-angular/)
- OpenLayers
  - [Generar VectorSource con un GeoJSON (+ estilos básicos)](https://openlayers.org/en/latest/examples/geojson.html)
  - [Centrar y posicionar una vista de un mapa](https://openlayers.org/en/latest/examples/center.html)
- Jasmine (testing)
  - [Spy on properties](https://jasmine.github.io/tutorials/spying_on_properties)
  - [Testing timers with fakeAsync](https://www.damirscorner.com/blog/posts/20210917-TestingTimersWithFakeAsync.html)

## Otros posts y guías de utilidad

- [Cédric Exbrayat](https://github.com/cexbrayat) publicó unos posts explicando por partes cómo mejorar el rendimiento de nuestra aplicación con Angular
  - [Part 1: First Load](https://blog.ninja-squad.com/2018/09/06/angular-performances-part-1/)
  - [Part 2: Reload](https://blog.ninja-squad.com/2018/09/13/angular-performances-part-2/)
  - [Part 3: Profiling and runtime performances](https://blog.ninja-squad.com/2018/09/20/angular-performances-part-3/)
  - [Part 4: Change detection strategies](https://blog.ninja-squad.com/2018/09/27/angular-performances-part-4/)
  - [Part 5: Pure pipes, attribute decorator and other tips](https://blog.ninja-squad.com/2018/10/04/angular-performances-part-5/)
- [RxJS operadores de mapeo más utilizados, cuándo utilizar cada uno y por qué](https://blog.angular-university.io/rxjs-higher-order-mapping/)
- [Unit testing en Angular con Jasmine y Karma (35 vídeos cortos)](https://www.youtube.com/playlist?list=PL8jcXf-CLpxolmjV5_taFP0c5LyCveDF1)