import VectorSource from 'ol/source/Vector';
import VectorImageLayer from 'ol/layer/VectorImage';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import WMTS from 'ol/source/WMTS';

export interface LayerGroupConfig {
  name: string,
  displayName: string,
  dataset?: string,
  url: string,
  opacity: number,
  modified: boolean,
  layers: LayerConfig[],
}

export interface LayerConfig {
  key: string,
  color: string,
  visible: boolean
}

export interface LoadedLayer {
  groupName: string,
  key: string,
  visible: boolean,
  layer?: TileLayer<TileWMS> | VectorImageLayer<VectorSource> | TileLayer<WMTS>
}