import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar/navbar.component';
import { HomeComponent } from './home/home/home.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { MapComponent } from './map/map.component';

import { GitHubModule } from './github/github.module';
import { SharedModule } from './shared/shared.module';
import { AdminPanelComponent } from './map/admin-panel/admin-panel.component';
import { FilterVisibleLayersPipe } from './map/pipes/filter-visible-layers.pipe';
import { FixCCAAnamesPipe } from './map/pipes/fix-ccaanames.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    TasklistComponent,
    MapComponent,
    AdminPanelComponent,
    FilterVisibleLayersPipe,
    FixCCAAnamesPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    GitHubModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
