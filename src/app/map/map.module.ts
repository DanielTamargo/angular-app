import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { MapComponent } from './map.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { FeatureInfoComponent } from './feature-info/feature-info.component';

import { FilterVisibleLayersPipe } from './pipes/filter-visible-layers.pipe';
import { FixCCAAnamesPipe } from './pipes/fix-ccaanames.pipe';

const declarations = [
  MapComponent,
  AdminPanelComponent,
  FeatureInfoComponent,
  FilterVisibleLayersPipe,
  FixCCAAnamesPipe
];

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: declarations,
  // exports: declarations
})
export class MapModule { }
