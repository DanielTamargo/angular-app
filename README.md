# Angular APP

> [¡Si quieres leer el README en español haz clic aquí!](./README.md)

**Hi there!** 😊  
This is the *'personal, improvising while learning, random but cool'* mini-app I'm developing for myself as a way to learn Angular. If you're interested, have time or just bored you can give me any tips about angular, development in general (backend, frontend...) or any other programming stuff and it will help me so much!  

> Note: This is the app I'm using to understand and learn Angular so I'm awared that the code will be a little messy.  
> All the comments you'll find in the code are in spanish language (this is just a personal project for self-learning).  
> Also, any questions or tips are welcome, feel free to talk to me!

----

## What's used in this project

- [Angular](https://angular.io/) as front-end framework
- [RxJS](https://rxjs.dev/) using observables, observers, suscriptions and operators
- [NgRx](https://ngrx.io/docs) as an app state manager (Angular's Redux version)
- [SASS](https://sass-lang.com/) to style the project
- [Bootstrap](https://getbootstrap.com/) as a fast way to layout
- [Angular Material](https://next.material.angular.io/) as an extra library that offers styled and logic components already built for angular
- [Open Layers](https://openlayers.org/) to load maps and its layers
- APIs
  - [GitHub API](https://docs.github.com/en/rest)
  - [OpenDataSoft (provincias españa)](https://help.opendatasoft.com/apis/ods-search-v1/#record-search-api) 
- Angular + Firebase
  - [AngularFire](https://github.com/angular/angularfire) to manage Realtime Database
  - [FirebaseUI-Angular](https://github.com/RaphaelJenni/FirebaseUI-Angular) to login as user
  
----

> **Note:**
> When we build an application we want this to be 'alive', being consistent, perserving state and making User eXperience as good as possible. This is known as **application state**.  
>  
> In Angular, in order to preserve this state allowing to connect your components to eachother, sharing information, you have two ways to achieve this, using RxJS with observables and suscriptions, or use NgRx (reactive aplication state manager built in Angular inspired by Redux).   
> 
> Taking advangate of the fact that the project has three mini-applications built inside of it *(as if they were independent applications)* I decided to use **RxJS** for GitHub and Map and use **NgRx** for TaskList. Trying to learn as much as possible, because that was the goal of this project, **to learn**.

----

## Documentations

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
  - [Migrations (I started using deprecated examples hehe)](https://ngrx.io/guide/migration/v13)
  - [Guía NgRx in spanish](https://academia-binaria.com/el-patron-redux-con-ngrx-en-angular/)
- OpenLayers
  - [Generate VectorSource with a GeoJSON (+ basic styles)](https://openlayers.org/en/latest/examples/geojson.html)
  - [Center on map's view](https://openlayers.org/en/latest/examples/center.html)
- Jasmine (testing)
  - [Spy on properties](https://jasmine.github.io/tutorials/spying_on_properties)
  - [Testing timers with FakeAsync](https://www.damirscorner.com/blog/posts/20210917-TestingTimersWithFakeAsync.html)
  - [How to manage async with Unit Testing in Angular](https://codecraft.tv/courses/angular/unit-testing/asynchronous/#_summary)

## Another posts and guides

- [Cédric Exbrayat](https://github.com/cexbrayat) published some posts explaining how to improve the performance in our Angular application
  - [Part 1: First Load](https://blog.ninja-squad.com/2018/09/06/angular-performances-part-1/)
  - [Part 2: Reload](https://blog.ninja-squad.com/2018/09/13/angular-performances-part-2/)
  - [Part 3: Profiling and runtime performances](https://blog.ninja-squad.com/2018/09/20/angular-performances-part-3/)
  - [Part 4: Change detection strategies](https://blog.ninja-squad.com/2018/09/27/angular-performances-part-4/)
  - [Part 5: Pure pipes, attribute decorator and other tips](https://blog.ninja-squad.com/2018/10/04/angular-performances-part-5/)
- [RxJS most used map operators, when to use them and why](https://blog.angular-university.io/rxjs-higher-order-mapping/)
- [Unit testing in Angular with Jasmine and Karma (35 short vids)](https://www.youtube.com/playlist?list=PL8jcXf-CLpxolmjV5_taFP0c5LyCveDF1)
