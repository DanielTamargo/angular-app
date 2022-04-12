import { Pipe, PipeTransform } from '@angular/core';
import { LayerConfig } from '../interfaces/layer-config.interface';

@Pipe({
  name: 'filterVisibleLayers'
})
export class FilterVisibleLayersPipe implements PipeTransform {

  /**
   * Pipe que se encargará de filtrar los layers.
   * Los devolverá ordenados alfabeticamente.
   * 
   * @param layers layers a filtrar
   * @param showOnlyVisible boolean que determinará si se muestran todos o solo los visibles
   * @returns layers filtrados
   */
  transform(layers: LayerConfig[], showOnlyVisible: boolean = false): LayerConfig[] {
    const layersCopy = layers.slice().map(lay => {
      if (lay.key.includes(',')) {
        lay.key = lay.key.split(',').reverse().join(' ').trim();
      }
      return lay;
    }).sort((a, b) => {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });

    if (showOnlyVisible) return layersCopy.filter(lay => lay.visible);

    return layersCopy;
  }

}
