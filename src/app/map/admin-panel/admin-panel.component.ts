import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSliderChange } from '@angular/material/slider';
import Swal from 'sweetalert2';
import { LayerGroupConfig } from '../interfaces/layer-config.interface';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  duration = 2000;
  
  showOnlyVisible = false;
  layersConfig: LayerGroupConfig[];

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.layersConfig = this.mapService.layersConfig;
  }

  onOpacityChange(evt: MatSliderChange, layerGroupName: string): void {
    this.mapService.onLayerOpacityChange(evt.value, layerGroupName);
  }

  onLayerVisibleChange(evt: MatCheckboxChange, layerKey: string, layerGroupName: string): void {
    this.mapService.onLayerVisibilityChange(evt.checked, layerKey, layerGroupName);
  }

  onRestoreDefaultConfiguration() {
    // Mostramos alerta para la confirmación del usuario ya que es una acción irreversible
    Swal.fire({
      title: 'Are you sure?',
      text: 'Any configuration made by you will be removed, this is not reversible.',
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      denyButtonText: 'Reset configuration',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      // Si ha denegado, borramos la configuración
      if (result.isDenied) {
        this.mapService.resetConfiguration();
        this.layersConfig = this.mapService.layersConfig;
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-right',
          iconColor: 'white',
          customClass: {
            popup: 'colored-toast pink'
          },
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        })
        Toast.fire({
          icon: 'success',
          title: 'Success'
        })
      }
      
    })
  }
}
