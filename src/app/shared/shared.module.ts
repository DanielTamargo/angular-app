import { NgModule } from '@angular/core';

import { SizeFormatterPipe } from './pipes/size-formatter.pipe';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    MaterialModule,
  ],
  declarations: [
    SizeFormatterPipe,
  ],
  exports: [
    MaterialModule,
    SizeFormatterPipe,
  ]
})
export class SharedModule { }
