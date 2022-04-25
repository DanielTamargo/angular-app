import { NgModule } from '@angular/core';

import { SizeFormatterPipe } from './pipes/size-formatter.pipe';
import { MaterialModule } from './material.module';
import { StringCutterPipe } from './pipes/string-cutter.pipe';
import { FirstWordPipe } from './pipes/firstWord.pipe';

@NgModule({
  imports: [
    MaterialModule,
  ],
  declarations: [
    SizeFormatterPipe,
    StringCutterPipe,
    FirstWordPipe,
  ],
  exports: [
    MaterialModule,
    SizeFormatterPipe,
    StringCutterPipe,
    FirstWordPipe,
  ]
})
export class SharedModule { }
