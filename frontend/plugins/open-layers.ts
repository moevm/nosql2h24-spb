import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { LineString } from 'ol/geom';
import { Vector as VectorSource } from 'ol/source.js';
import { Cluster } from 'ol/source.js';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay.js';


import {
  Circle,
  Fill,
  Stroke,
  Style,
  Text,
  Icon
} from 'ol/style.js';

const singleStyle = function (feature: any) {
  const color = feature.values_.poi.choosed ? 'rgba(93,128,122,1)' : 'rgba(182, 91, 91, 1)'
  if (feature.values_.poi.choosed) {
  }
  return new Style({
  image: new Icon({
    src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" viewBox="0 0 20 30" fill="${color}"><path d="M10 0C15.5 0 20 5 20 10C20 15 10 30 10 30C10 30 0 15 0 10C0 5 4.5 0 10 0Z"/></svg>`,

    scale: 1
  }),
})}

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
      text: size.toString(),
    }),
  });
}

const pointStyle = function (feature: any) {
  const features = feature.get('features');
  const i = features.length;
  if (i > 1) {
    return clusterStyle(i);
  } else {
    return singleStyle(features[0]);
  }
}

const routeStyle = new Style({
  stroke: new Stroke({
    color: 'rgba(93,128,122,1)',
    width: 5
  })
})

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
    pointStyle,
    Overlay,
    LineString,
    routeStyle
  });
});
