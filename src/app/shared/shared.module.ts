import { NgModule } from '@angular/core';

import { SizeFormatterPipe } from './pipes/size-formatter.pipe';
import { MaterialModule } from './material.module';
import { StringCutterPipe } from './pipes/string-cutter.pipe';

@NgModule({
  imports: [
    MaterialModule,
  ],
  declarations: [
    SizeFormatterPipe,
    StringCutterPipe
  ],
  exports: [
    MaterialModule,
    SizeFormatterPipe,
    StringCutterPipe
  ]
})
export class SharedModule { }
