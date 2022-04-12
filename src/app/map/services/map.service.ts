import { Injectable } from '@angular/core';

import GeoJSON from 'ol/format/GeoJSON';
import VectorSource from 'ol/source/Vector';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { Style, Stroke, Fill, Circle } from 'ol/style';
import VectorImageLayer from 'ol/layer/VectorImage';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import WMTS from 'ol/source/WMTS';

import { MapConstants } from '../constants/map-constants';
import { HttpClient } from '@angular/common/http';
import { catchError, Subject, map } from 'rxjs';

import { MapConstants as MC } from '../constants/map-constants';
import { LayerConfig, LayerGroupConfig, LoadedLayer } from '../interfaces/layer-config.interface';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  changeLayerVisibilitySubject$ = new Subject<LayerConfig>();
  newWFSLayerSubject$ = new Subject<TileLayer<TileWMS> | VectorImageLayer<VectorSource> | TileLayer<WMTS>>();
  loadedLayersSubject$ = new Subject<LoadedLayer[]>();
  configResetedSubject$ = new Subject<boolean>();

  layersConfig: LayerGroupConfig[];
  defaultLayersConfig: LayerGroupConfig[] = [
    {
      name : MC.LAYERGROUP_CCAA_NAME,
      displayName: "Autonomous Communities",
      url: MC.OPENDATA_DATASET_RECORDS,
      dataset: MC.DATASET_PROVINCIAS_ESPANOLAS,
      opacity: 0.6,
      layers: [
        {
          key: "Castilla y León",
          color: "rgba(252, 197, 101, 0.4)",
          visible: true,
        },
        {
          key: "Castilla - La Mancha",
          color: "rgba(57, 174, 132, 0.4)",
          visible: false,
        },
        {
          key: "Andalucía",
          color: "rgba(125, 101, 129, 0.4)",
          visible: true,
        },
        {
          key: "Cataluña",
          color: "rgba(162, 109, 54, 0.4)",
          visible: false,
        },
        {
          key: "Galicia",
          color: "rgba(71, 235, 83, 0.4)",
          visible: false,
        },
        {
          key: "Aragón",
          color: "rgba(63, 54, 96, 0.4)",
          visible: false,
        },
        {
          key: "Comunitat Valenciana",
          color: "rgba(126, 145, 162, 0.4)",
          visible: false,
        },
        {
          key: "País Vasco",
          color: "rgba(184, 51, 76, 0.4)",
          visible: false,
        },
        {
          key: "Canarias",
          color: "rgba(41, 119, 178, 0.4)",
          visible: false,
        },
        {
          key: "Extremadura",
          color: "rgba(138, 188, 65, 0.4)",
          visible: false,
        },
        {
          key: "Asturias, Principado de",
          color: "rgba(211, 177, 142, 0.4)",
          visible: false,
        },
        {
          key: "Cantabria",
          color: "rgba(46, 136, 124, 0.4)",
          visible: false,
        },
        {
          key: "Ceuta",
          color: "rgba(77, 117, 16, 0.4)",
          visible: false,
        },
        {
          key: "Comunidad Foral de Navarra",
          color: "rgba(93, 114, 243, 0.4)",
          visible: false,
        },
        {
          key: "Comunidad de Madrid",
          color: "rgba(56, 150, 230, 0.4)",
          visible: false,
        },
        {
          key: "Illes Balears",
          color: "rgba(114, 228, 145, 0.4)",
          visible: false,
        },
        {
          key: "Melilla",
          color: "rgba(96, 179, 157, 0.4)",
          visible: false,
        },
        {
          key: "Región de Murcia",
          color: "rgba(77, 245, 188, 0.4)",
          visible: false,
        },
        {
          key: "Rioja, La",
          color: "rgba(133, 154, 244, 0.4)",
          visible: false,
        }
      ],
    }
  ];
  loadedLayers: LoadedLayer[] = [];


  constructor(private http: HttpClient) { 
    // Cargamos la configuración guardada o si no existe o da error cargamos la configuración por defecto
    const savedLayersConfig = localStorage.getItem(MC.LS_LAYERS_CONFIG_KEY);
    if (savedLayersConfig) {
      try {
        this.layersConfig = JSON.parse(savedLayersConfig);
      } catch (err) {
        this.layersConfig = this.defaultLayersConfig;
      }
    } else {
      this.layersConfig = this.defaultLayersConfig;
    }
  }

  /**
   * Método que genera una nueva capa WFS (vectores), la recogerá de OpenData
   * 
   * @param url url a cargar y parsear con formato geojson
   * @return la capa para añadirla al mapa o trabajar con ella
   */
  newOpenDataWFSLayer({url, ca, opacity = 0.6, visible = true}) {
    const ca_color = MapConstants.CCAA_COLORS.find(ca_color => ca_color.key == ca);
    const color
      = ca_color
      ? ca_color.color
      : 'rgba(252, 197, 101, 0.4)';

    let stroke = new Stroke({
      width: 1,
      color: '#2f2f2f'
    });
    let fill = new Fill({
      color: color
    });
    let image = new Circle({
      stroke: stroke,
      fill: fill,
      radius: 4
    });

    this.http.get(url).pipe(
      catchError<any, any>(err => {
        return {
          error: true
        };
      }),
      map<any, any>((resp) => {
        const features = [];
        const geojsonObject = {
          'type': 'FeatureCollection',
          'crs': {
            'type': 'name',
            'properties': {
              'name': 'EPSG:4326',
            },
          },
          'features': features,
        };

        resp.features.map(feature => {
          const properties = feature.properties;
          const geo_shape = properties.geo_shape;
          features.push({
            'type': 'Feature',
            'geometry': {
              'type': geo_shape.type,
              'coordinates': geo_shape.coordinates
            },
            'properties': {
              'ccaa': properties.ccaa,
              'cod_ccaa': properties.cod_ccaa,
              'codigo': properties.codigo,
              'provincia': properties.provincia,
              'texto': properties.texto,
            }
          })
        });

        return geojsonObject;
      })
    ).subscribe(geojsonObject => {
      if (geojsonObject.error) {
        return;
      }

      const WFS_layer = new VectorImageLayer({
        source: new VectorSource({
          features: new GeoJSON().readFeatures(geojsonObject),
          strategy: bboxStrategy
        }),
        style: new Style({
          stroke: stroke,
          fill: fill,
          image: image
        }),
        visible: visible,
        renderBuffer: 1000,
        opacity: opacity
      });

      // Lo añadimos a la lista de capas cargadas
      this.loadedLayers.push({
        groupName: MC.LAYERGROUP_CCAA_NAME,
        key: ca,
        visible: visible,
        layer: WFS_layer
      });

      // Lo mandamos al mapa
      this.newWFSLayerSubject$.next(WFS_layer);
    });

  }

  /**
   * Método que llamará el mapa una vez inicializado para cargar todos los layers de la configuración
  */
  loadVisibleLayers(): void {
    // Si ya existían layers cargados simplemente los mandamos sin repetir las peticiones
    if (this.loadedLayers.length > 0) {
      this.loadedLayersSubject$.next(this.loadedLayers);
      return;
    }

    // Si no existían layers cargados recorremos los grupos de layers que hay en la configuración
    for (let layerGroup of this.layersConfig) {

      // Dentro del grupo recorremos los layers marcados como visibles para cargarlos
      for (let layer of layerGroup.layers.filter(lay => lay.visible)) {
        if (layerGroup.name == "open_data_ccaa") {
          const url 
            = layerGroup.url
              .replace(MC.KEY_DATASET, MC.DATASET_PROVINCIAS_ESPANOLAS)
              .replace(MC.KEY_CCAA, layer.key.replace(/ /g, '%20%'));

          this.newOpenDataWFSLayer({url: url, ca: layer.key, opacity: layerGroup.opacity, visible: layer.visible});
        }
      }
    }
  }

  /**
   * El usuario ha modificado la visibilidad de una de las capas disponibles
   * 
   * @param visible boolean que determinará si es visible o no es visible la capa
   */
  onLayerVisibilityChange(visible: boolean, layerKey: string, layerGroupName: string) {
    if (layerGroupName == MC.LAYERGROUP_CCAA_NAME) {
      this.layersConfig
        .find(layerGroup => layerGroup.name == layerGroupName)
        .layers
          .find(lay => lay.key == layerKey)
          .visible = visible;

      const layer = this.loadedLayers.find(lay => lay.groupName == layerGroupName && lay.key == layerKey);

      if (!layer) {
        const url 
              = this.layersConfig.find(layerGroup => layerGroup.name == layerGroupName).url
                .replace(MC.KEY_DATASET, MC.DATASET_PROVINCIAS_ESPANOLAS)
                .replace(MC.KEY_CCAA, layerKey.replace(/ /g, '%20%'));
        
        this.newOpenDataWFSLayer({ url: url, ca: layerKey, visible: visible})
      }
      else layer.layer.setVisible(visible);
      
      this.saveConfig();
    }
  }

  /**
   * Guarda la configuración en el localStorage
   */
  saveConfig() {
    console.log(this.layersConfig);
    localStorage.setItem(MC.LS_LAYERS_CONFIG_KEY, JSON.stringify(this.layersConfig));
  }

  /**
   * Método utilizado cuando el usuario decida restaurar la configuración a la configuración por defecto
   */
  resetConfiguration() {
    localStorage.removeItem(MC.LS_LAYERS_CONFIG_KEY);

    // TODO reiniciar layers del mapa, reiniciar config zoom, config coordenadas, etc
    this.configResetedSubject$.next(true);

    this.loadedLayers = [];
  }

}
