import { NgModule } from '@angular/core';

import { SizeFormatterPipe } from './pipes/size-formatter.pipe';
import { RetrieveGistFileNamesPipe } from './pipes/retrieve-gist-file-names.pipe';
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    MaterialModule,
  ],
  declarations: [
    SizeFormatterPipe,
    RetrieveGistFileNamesPipe,
  ],
  exports: [
    MaterialModule,
    SizeFormatterPipe,
    RetrieveGistFileNamesPipe
  ]
})
export class SharedModule { }
