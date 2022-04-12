import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LayerGroupConfig } from '../interfaces/layer-config.interface';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  duration = 2000;
  
  layersConfig: LayerGroupConfig[];

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.layersConfig = this.mapService.layersConfig;
  }


  onLayerVisibleChange(evt: MatCheckboxChange, layerKey: string, layerGroupName: string): void {
    this.mapService.onLayerVisibilityChange(evt.checked, layerKey, layerGroupName);
  }
}
