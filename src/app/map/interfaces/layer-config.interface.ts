export interface LayerGroupConfig {
  name: string,
  dataset?: string,
  url: string,
  opacity: number
  layers: LayerConfig[],
}

export interface LayerConfig {
  key: string,
  color: string,
  visible: boolean
}

export interface LoadedLayer {
  key: string,
  visible: boolean,
  layer?: any
}