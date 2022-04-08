import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GitHubComponent } from './github/github.component';
import { HomeComponent } from './home/home/home.component';
import { MapComponent } from './map/map.component';
import { TasklistComponent } from './tasklist/tasklist.component';

const routes: Routes = [
  // Inicio
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '' },

  // GitHub (api)
  { 
    path: 'github', 
    component: GitHubComponent, 
    children: [
      { path: '**', redirectTo: '/github' }
    ] 
  },

  // Task Lists (localstorage) / Markdown Writter (+ guardar contenido en firebase?) 
  { 
    path: 'tasklist', 
    component: TasklistComponent, 
    children: [
      { path: '**', redirectTo: '/tasklist' }
    ] 
  },
  
  // Mapas (open layers, nasa?)
  { 
    path: 'map', 
    component: MapComponent, 
    children: [
      { path: '**', redirectTo: '/map' }
    ] 
  },

  // Redirección para todas las demás rutas
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
