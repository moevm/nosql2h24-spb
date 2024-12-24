import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('ol', {
    Map,
    View,
    TileLayer,
    OSM,
    fromLonLat
  });
});
