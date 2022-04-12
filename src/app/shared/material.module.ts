import { NgModule } from '@angular/core';

import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
// import { A11yModule } from '@angular/cdk/a11y';

const modules = [
    MatPaginatorModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatCardModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatCheckboxModule,
    MatSliderModule
]

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
