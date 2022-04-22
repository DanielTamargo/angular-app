import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Map, Overlay, View } from 'ol';

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
    trigger('featureInfo', [
      state('false', style({ bottom: '-100vh' })),
      state('true', style({ bottom: '0' })),
      transition('0 <=> 1', animate(`200ms ease-in-out`)),
    ]),
  ]
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  layers: (TileLayer<TileWMS> | VectorImageLayer<VectorSource> | TileLayer<WMTS>)[] = [];
  baseLayers: (TileLayer<TileWMS> | VectorImageLayer<VectorSource<Geometry>> | TileLayer<WMTS> | TileLayer<OSM>)[] = [];
  map?: Map;

  loadedLayersSubscription$ = new Subscription;
  newWFSlayerSubscription$ = new Subscription;
  configResetedSubscription$ = new Subscription;

  featureProperties: any = {};
  featureInfo: boolean = false;

  adminPanel: boolean = false;
  defaultCenterCoordinates: number[] = [566349.3696978227, 4409951.952130745];


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
    //proj4("EPSG:4326", "EPSG:25830", [2,5]);
    register(proj4);

    const capaBase = new TileLayer({
      source: new OSM()
    });
    this.baseLayers.push(capaBase);


    // Inicializar mapa
    this.map = new Map({
      target: 'mapa',
      layers: [],
      view: new View({
        center: this.defaultCenterCoordinates,
        zoom: this.getZoom(),
        projection: 'EPSG:25830'
        //projection: 'EPSG:4326'
      }),
      controls: [
        new Zoom(), new Rotate({ className: 'ol-rotate me-4' }), new FullScreen({ tipLabel: 'Pantalla completa' }), new ScaleLine()
      ]
    });
    this.map.getLayers().insertAt(0, capaBase);

    // Suscripción para recibir los layers ya cargados
    this.loadedLayersSubscription$
      = this.mapService.loadedLayersSubject$
        .subscribe(layers => {
          for (const layer of layers) {
            if (layer.layer) this.map.addLayer(layer.layer);
          }
        });

    // Cargamos los layers necesarios
    this.mapService.loadVisibleLayers();

    // Suscripción para contemplar la posiblidad de que el usuario reinicie la configuración
    this.configResetedSubscription$
      = this.mapService.configResetedSubject$
        .subscribe(reset => {
          if (reset) {
            for (const layer of this.map.getAllLayers()) {
              if (layer != capaBase) this.map.removeLayer(layer);
            }
          }
        });

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

  ngAfterViewInit(): void {

    // LISTENER ONCLICK
    this.map.on('singleclick', evt => {
      // Obtener coordenadas click, coordenadas centro mapa, centrar en coordenadas del click, obtener zoom:
      //console.log('Coordenadas click: ', evt.coordinate);
      //console.log('Coordenadas centro mapa: ', this.map.getView().getCenter());
      //this.map?.getView().setCenter(evt.coordinate);
      console.log('Zoom del mapa y ancho/alto de pantalla',
        {
          zoom: this.map.getView().getZoom(),
          anchoPantalla: window.innerWidth,
          alturaPantalla: window.innerHeight,
        });

      // Ejecutar por cada feature en el pixel (con hitTolerance)
      let features = this.map?.getFeaturesAtPixel(evt.pixel);
      if (features!.length <= 0) this.featureInfo = false;

      this.map?.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (!layer) return;

        const featureProperties = feature.getProperties();
        this.featureInfo = true;

        const keys = Object.keys(featureProperties);
        const resp = [];

        let i = 0;
        for (const key of keys) {
          if (typeof featureProperties[key] == 'object') continue;

          resp[i] = { key: key, value: featureProperties[key] };
          i++;
        }

        this.featureProperties = resp;

        // CCAA (Open Data)
        if (feature.get('ccaa')) {
          console.log('Info CCAA');
          // TODO? algo distintos para CCAA cuando meta más capas?
        }

      });

    });

    // TOOLTIP
    const tooltip = document.getElementById('tooltip');
    const overlay = new Overlay({
      element: tooltip!,
      offset: [10, 0],
      positioning: 'bottom-center'
    });
    this.map?.addOverlay(overlay);

    // LISTENER POINTERMOVE a través del cual instanciaremos el tooltip
    this.map?.on('pointermove', evt => {
      if (evt.dragging) {
        tooltip!.hidden = true;
        return;
      }

      let features = this.map?.getFeaturesAtPixel(evt.pixel);
      if (features!.length <= 0) {
        tooltip!.hidden = true;
      }

      // Obtener features seleccionadas
      this.map?.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (!layer) return;

        // CCAA (Open Data)
        if (feature.get('ccaa')) {
          tooltip!.hidden = false;
          overlay.setPosition(evt.coordinate);
          tooltip!.innerHTML = `${feature.get('provincia')} (${feature.get('ccaa')})`;
        }

        return;
      });
    });

    // Quitamos el tooltip si nos movemos por el display de la información
    document.getElementById('feature-info').addEventListener('mouseenter', () => {
      tooltip!.hidden = true;
    });
  }

  ngOnDestroy(): void {
    // Eliminamos suscripciones para evitar pérdidas de memoria y rendimiento
    this.newWFSlayerSubscription$.unsubscribe();
    this.loadedLayersSubscription$.unsubscribe();
    this.configResetedSubscription$.unsubscribe();
  }

  /**
   * Calcula el zoom necesario en base a la anchura de la pantalla
   *
   * @returns zoom adecuado para la anchura de la pantalla
   */
  getZoom(): number {
    /* Algunas referencias
    236 => 4.825535095338114 => 0.0204471826073649
    445 => 5.787843592154494 => 0.0130063900947292
    971 => 6.714234718575708 => 0.0069147628409637
    1540 => 7.105328475942655 => 0.004613849659703
    1904 => 7.255328475942655 => 0.0038105716785413;
    */

    const widthRef = 600;
    const zoomRef = 5.880439327374903;
    const percentageValue = 0.008;

    const screenWidth = window.innerWidth;
    const increase = screenWidth - widthRef;
    const percentage = increase / widthRef * 100;

    return zoomRef + (percentageValue * percentage);


    /*const width = window.innerWidth;
    let increase: number;

    if (width < 445) increase = 0.0204471826073649;
    else if (width < 971) increase = 0.0130063900947292;
    else if (width < 1540) increase = 0.0069147628409637;
    else if (width < 1904) increase = 0.004613849659703;
    else increase = 0.0038105716785413;

    console.log(width);
    console.log(increase);

    return width * increase;*/
  }

  /**
   * Centra el mapa en las coordenadas por defecto y el zoom calculado en base a la anchura de la pantalla
   */
  centerMap(): void {
    this.map.getView().setCenter(this.defaultCenterCoordinates);
    this.map.getView().setZoom(this.getZoom());
  }

  /**
   * Evento lanzado por el hijo (Output EventEmitter) cuando se cierra la ventana
   *
   * @param close boolean que determinará si se cierra o no la ventana
   */
  onCloseFeatureInfo(close: boolean) {
    if (!close) return

    this.featureInfo = false;
    this.featureProperties = {};
  }

}
