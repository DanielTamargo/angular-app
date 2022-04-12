import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Map, View } from 'ol';

import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';

import OSM from 'ol/source/OSM';
import WMTS from 'ol/source/WMTS';

import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import VectorImageLayer from 'ol/layer/VectorImage';
import VectorSource from 'ol/source/Vector';

import { Geometry } from 'ol/geom';

import Rotate from 'ol/control/Rotate';
import { ScaleLine } from 'ol/control';
import Zoom from 'ol/control/Zoom';
import FullScreen from 'ol/control/FullScreen';

import { MapService } from './services/map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  animations: [
    trigger('adminPanel', [
      state('false', style({ left: '-100vw' })),
      state('true', style({ left: '0' })),
      transition('0 <=> 1', animate(`200ms ease-in-out`)),
    ]),
  ]
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  layers: (TileLayer<TileWMS> | VectorImageLayer<VectorSource> | TileLayer<WMTS>)[] = [];
  baseLayers: (TileLayer<TileWMS> | VectorImageLayer<VectorSource<Geometry>> | TileLayer<WMTS> | TileLayer<OSM>)[] = [];
  map?: Map;

  loadedLayersSubscription$ = new Subscription;

  adminPanel: boolean = false;

  newWFSlayerSubscription$ = new Subscription;

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    // Projection
    // https://ptc-it.de/developing-openlayers-apps-in-es6-mocha-karma-webpack-projections/
    // https://sisteme-ig.com/questions/50787/como-puedo-reproyectar-una-capa-wms-en-openlayers-3
    // https://mappinggis.com/2016/04/los-codigos-epsg-srid-vinculacion-postgis/#:~:text=La%20tabla%20spatial_ref_sys%20contiene%20informaci%C3%B3n%20descriptiva%20sobre%20los%20sistemas%20de%20referencia%20espacial%2C%20o%20tambi%C3%A9n%20llamados%20Sistemas%20de%20Referencia%20de%20Coordenadas%20soportados%20por%20PostGIS.
    proj4.defs(
      'EPSG:25830',
      '+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    );
    register(proj4);

    // Consideramos dimensión de pantalla para ajustar zoom al cargar la primera vez
    let zoom = 6.5;
    if (window.innerWidth < 500) zoom = 5.5;

    const capaBase = new TileLayer({
      source: new OSM()
    });
    this.baseLayers.push(capaBase);


    // Inicializar mapa
    this.map = new Map({
      target: 'mapa',
      layers: [],
      view: new View({
        center: [-484923.2208519772, 39.96122825707207],
        zoom: zoom,
        //projection: 'EPSG:25830'
        projection: 'EPSG:4326'
      }),
      controls: [
        new Zoom(), new Rotate({ className: 'ol-rotate me-4' }), new FullScreen({ tipLabel: 'Pantalla completa' }), new ScaleLine()
      ]
    });
    this.map.getLayers().insertAt(0, capaBase);


    // Listener on click en el mapa
    this.map.on('singleclick', evt => {
      // Coordenadas:
      // console.log('Coordenadas: ', evt.coordinate);
      // this.map?.getView().setCenter(evt.coordinate);

      // Ejecutar por cada feature en el pixel (con hitTolerance)
      this.map?.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (!layer) return;
        console.log(feature.getProperties()['provincia']);
      });
    });

    this.loadedLayersSubscription$ 
      = this.mapService.loadedLayersSubject$
        .subscribe(layers => {
          for (const layer of layers) {
            if (layer.layer) this.map.addLayer(layer.layer);
          }
        });

    // Cargamos los layers necesarios
    this.mapService.loadVisibleLayers();
  }

  ngAfterViewInit(): void {
    // Nos suscribimos a las creaciones de nuevas WFS layer
    this.newWFSlayerSubscription$
    = this.mapService.newWFSLayerSubject$
      .subscribe({
        next: layer => {
          //layer.setExtent(this.map.getView().calculateExtent())
          this.map.addLayer(layer);
        }
      });
  }

  ngOnDestroy(): void {
    // Eliminamos suscripciones para evitar pérdidas de memoria y rendimiento
    this.newWFSlayerSubscription$.unsubscribe();
    this.loadedLayersSubscription$.unsubscribe();
  }

}
