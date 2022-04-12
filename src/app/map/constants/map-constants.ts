// https://public.opendatasoft.com/api/records/1.0/search/?dataset=provincias-espanolas&q=&lang=es&sort=provincia&facet=ccaa&facet=provincia

export class MapConstants {

  // LS
  static LS_LAYERS_CONFIG_KEY = "layers_saved_config";

  // KEYS
  static KEY_DATASET = "{dataset}";
  static KEY_CCAA = "{ccaa}";
  static LAYERGROUP_CCAA_NAME = "open_data_ccaa";

  // Comunidades Autónomas
  static CCAA = [
    "Castilla y León",
    "Castilla - La Mancha",
    "Andalucía",
    "Cataluña",
    "Galicia",
    "Aragón",
    "Comunitat Valenciana",
    "País Vasco",
    "Canarias",
    "Extremadura",
    "Asturias, Principado de",
    "Cantabria",
    "Ceuta",
    "Comunidad Foral de Navarra",
    "Comunidad de Madrid",
    "Illes Balears",
    "Melilla",
    "Región de Murcia",
    "Rioja, La",
  ];
  static CCAA_COLORS: {key: string, color: string}[] = [
    {
      key: "Castilla y León",
      color: "rgba(252, 197, 101, 0.4)"
    },
    {
      key: "Castilla - La Mancha",
      color: "rgba(57, 174, 132, 0.4)"
    },
    {
      key: "Andalucía",
      color: "rgba(125, 101, 129, 0.4)"
    },
    {
      key: "Cataluña",
      color: "rgba(162, 109, 54, 0.4)"
    },
    {
      key: "Galicia",
      color: "rgba(71, 235, 83, 0.4)"
    },
    {
      key: "Aragón",
      color: "rgba(63, 54, 96, 0.4)"
    },
    {
      key: "Comunitat Valenciana",
      color: "rgba(126, 145, 162, 0.4)"
    },
    {
      key: "País Vasco",
      color: "rgba(184, 51, 76, 0.4)"
    },
    {
      key: "Canarias",
      color: "rgba(41, 119, 178, 0.4)"
    },
    {
      key: "Extremadura",
      color: "rgba(138, 188, 65, 0.4)"
    },
    {
      key: "Asturias, Principado de",
      color: "rgba(211, 177, 142, 0.4)"
    },
    {
      key: "Cantabria",
      color: "rgba(46, 136, 124, 0.4)"
    },
    {
      key: "Ceuta",
      color: "rgba(77, 117, 16, 0.4)"
    },
    {
      key: "Comunidad Foral de Navarra",
      color: "rgba(93, 114, 243, 0.4)"
    },
    {
      key: "Comunidad de Madrid",
      color: "rgba(56, 150, 230, 0.4)"
    },
    {
      key: "Illes Balears",
      color: "rgba(114, 228, 145, 0.4)"
    },
    {
      key: "Melilla",
      color: "rgba(96, 179, 157, 0.4)"
    },
    {
      key: "Región de Murcia",
      color: "rgba(77, 245, 188, 0.4)"
    },
    {
      key: "Rioja, La",
      color: "rgba(133, 154, 244, 0.4)"
    },
  ];

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
