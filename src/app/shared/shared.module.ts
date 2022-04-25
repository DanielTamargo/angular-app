import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MaterialModule } from './material.module';

import { SizeFormatterPipe } from './pipes/size-formatter.pipe';
import { StringCutterPipe } from './pipes/string-cutter.pipe';
import { FirstWordPipe } from './pipes/firstWord.pipe';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    SizeFormatterPipe,
    StringCutterPipe,
    FirstWordPipe,
  ],
  exports: [
    MaterialModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SizeFormatterPipe,
    StringCutterPipe,
    FirstWordPipe,
  ]
})
export class SharedModule { }
