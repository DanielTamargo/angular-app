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
import { catchError, Subject, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  newWFSLayerSubject$ = new Subject<TileLayer<TileWMS> | VectorImageLayer<VectorSource> | TileLayer<WMTS>>();


  constructor(private http: HttpClient) { }



    /**
   * Método que genera una nueva capa WFS (vectores), la recogerá de geoserver
   * @param url url a cargar con formato geojson
   * @return la capa para añadirla al mapa o trabajar con ella
   */
  newWFSLayer(url: string, ca: string) {
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
        visible: true,
        renderBuffer: 1000,
        opacity: 0.4
      }); 

      this.newWFSLayerSubject$.next(WFS_layer);
    });

  }
}
