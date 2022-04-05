import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GitHubComponent } from './github/github.component';
import { HomeComponent } from './home/home/home.component';

const routes: Routes = [
  // Inicio
  { path: '', component: HomeComponent },
  { path: 'home', redirectTo: '' },

  // GitHub
  { path: 'github', component: GitHubComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
