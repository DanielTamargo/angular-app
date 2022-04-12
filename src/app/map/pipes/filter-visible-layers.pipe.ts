import { Pipe, PipeTransform } from '@angular/core';
import { LayerConfig } from '../interfaces/layer-config.interface';

@Pipe({
  name: 'filterVisibleLayers'
})
export class FilterVisibleLayersPipe implements PipeTransform {

  /**
   * Pipe que se encargará de filtrar los layers
   * 
   * @param layers layers a filtrar
   * @param all boolean que determinará si se muestran todos o solo los visibles
   * @returns layers filtrados
   */
  transform(layers: LayerConfig[], all: boolean = true): LayerConfig[] {
    if (all) return layers;

    return layers.filter(lay => lay.visible);
  }

}
