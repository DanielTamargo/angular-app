// https://public.opendatasoft.com/api/records/1.0/search/?dataset=provincias-espanolas&q=&lang=es&sort=provincia&facet=ccaa&facet=provincia

export class MapConstants {
  
  static OPENDATA_PROVINCIAS 
    = " https://public.opendatasoft.com/api/records/1.0/search/" 
      + "?dataset=provincias-espanolas" 
      + "&lang=es" 
      + "&rows=52" 
      + "&sort=provincia" 
      + "&timezone=Europe%2FMadrid"
      + "&format=geojson"; 
  // static OPENDATA_PROVINCIAS = "https://api.npoint.io/0fed625f711338db64b0";

  // KEYS
  static KEY_DATASET = "{dataset}";
  static KEY_CCAA = "{ccaa}";

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
      color: "rgb(252, 197, 101)"
    },
    {
      key: "Castilla - La Mancha",
      color: "rgb(57, 174, 132)"
    },
    {
      key: "Andalucía",
      color: "rgb(125, 101, 129)"
    },
    {
      key: "Cataluña",
      color: "rgb(162, 109, 54)"
    },
    {
      key: "Galicia",
      color: "rgb(71, 235, 83)"
    },
    {
      key: "Aragón",
      color: "rgb(63, 54, 96)"
    },
    {
      key: "Comunitat Valenciana",
      color: "rgb(126, 145, 162)"
    },
    {
      key: "País Vasco",
      color: "rgb(184, 51, 76)"
    },
    {
      key: "Canarias",
      color: "rgb(41, 119, 178)"
    },
    {
      key: "Extremadura",
      color: "rgb(138, 188, 65)"
    },
    {
      key: "Asturias, Principado de",
      color: "rgb(211, 177, 142)"
    },
    {
      key: "Cantabria",
      color: "rgb(46, 136, 124)"
    },
    {
      key: "Ceuta",
      color: "rgb(77, 117, 16)"
    },
    {
      key: "Comunidad Foral de Navarra",
      color: "rgb(93, 114, 243)"
    },
    {
      key: "Comunidad de Madrid",
      color: "rgb(56, 150, 230)"
    },
    {
      key: "Illes Balears",
      color: "rgb(114, 228, 145)"
    },
    {
      key: "Melilla",
      color: "rgb(96, 179, 157)"
    },
    {
      key: "Región de Murcia",
      color: "rgb(77, 245, 188)"
    },
    {
      key: "Rioja, La",
      color: "rgb(133, 154, 244)"
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