import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Cluster } from 'ol/source.js';
import VectorLayer from 'ol/layer/Vector';


import {
  Circle,
  Fill,
  Stroke,
  Style,
  Text,
  Icon
} from 'ol/style.js';

// const point_style = function (feature: any) {
//   const size = feature.get('features').length;
//   let style = new Style({
//     image: new CircleStyle({
//       radius: 10,
//       stroke: new Stroke({
//         color: '#fff',
//       }),
//       fill: new Fill({
//         color: '#3399CC',
//       }),
//     }),
//     text: new Text({
//       text: size.toString(),
//       fill: new Fill({
//         color: '#fff',
//       }),
//     }),
//   });
//   return style;
// }

// const point_style = function () {
//   return new Style({
//     image: new Circle({
//       radius: 2,
//       fill: new Fill({color: 'red'})
//     })
//   })
// }

const singleStyle = new Style({
  image: new Icon({
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" viewBox="0 0 20 30" fill="red"><path d="M10 0C15.5 0 20 5 20 10C20 15 10 30 10 30C10 30 0 15 0 10C0 5 4.5 0 10 0Z"/></svg>',
    scale: 1,
  }),
});

const clusterStyle = function (size: number) {
  return new Style({
    image: new Circle({
      radius: 13,
      fill: new Fill({color: 'rgba(0, 0, 255, 0.6)'}),
      stroke: new Stroke({color: 'white', width: 2}),
    }),
    text: new Text({
      font: 'bold 12px Arial',
      fill: new Fill({color: 'white'}),
      stroke: new Stroke({color: 'black', width: 2}),
      // Количество объектов в кластере
      text: size.toString(),
    }),
  });
}

const pointStyle = function (feature: any) {
  const i = feature.get('features').length;
  if (i > 1) {
    return clusterStyle(i);
  } else {
    // Если это одиночная метка, используем стиль для одиночных меток
    return singleStyle;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('ol', {
    Map,
    View,
    TileLayer,
    OSM,
    fromLonLat,
    Feature,
    Point,
    VectorSource,
    Cluster,
    VectorLayer,
    pointStyle
  });
});
