// https://public.opendatasoft.com/api/records/1.0/search/?dataset=provincias-espanolas&q=&lang=es&sort=provincia&facet=ccaa&facet=provincia

export class MapConstants {

  // LS
  static LS_LAYERS_CONFIG_KEY = "layers_saved_config";

  // KEYS
  static KEY_DATASET = "{dataset}";
  static KEY_CCAA = "{ccaa}";
  static LAYERGROUP_CCAA_NAME = "open_data_ccaa";

  // DATASETS
  static DATASET_PROVINCIAS_ESPANOLAS = "provincias-espanolas";

  // URLS OPENDATA
  static OPENDATA_DATASET_INFO
    = "https://public.opendatasoft.com/api/datasets/1.0/" + this.KEY_DATASET + "/";

  static OPENDATA_DATASET_RECORDS
    = "https://public.opendatasoft.com/api/records/1.0/search/"
      + "?dataset=" + this.KEY_DATASET
      + "&lang=es"
      + "&rows=20"
      + "&facet=ccaa"
      + "&facet=provincia"
      + "&timezone=Europe%2FMadrid"
      + "&format=geojson"
      + "&q=ccaa%3D" + this.KEY_CCAA;
}
