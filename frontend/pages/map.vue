<template>
  <v-container fluid style="position: relative;">
    <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 10px;" :style="{
      position: 'absolute',
      top: '74px',
      left: drawer ? '410px' : '10px',
      transition: 'left 0.2s ease',
    }">
      <v-btn icon @click="drawer = !drawer">
        <v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>
      <v-btn icon @click="zoomIn">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn icon @click="zoomOut">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </div>

    <v-navigation-drawer v-model="drawer" location="left" width="400" disable-route-watch disable-resize-watcher
      disable-overlay style="position: absolute; top: 0; left: 0; bottom: 0;" overlay-opacity="0"
      overlay-color="transparent">
      <v-list>
        <v-list-item>
          <v-list-item-title>Панель</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Элемент 1</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>Элемент 2</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <div ref="mapContainer" class="map-container"></div>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: 'map',
})

import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const mapContainer = ref(null);
const { $ol } = useNuxtApp();

let map = null

onMounted(() => {
    let ar = [0, 0, 0, 0]
    ar[0] = $ol.fromLonLat([30.025229406233464, 59.99887545438301])[0]
    ar[2] = $ol.fromLonLat([30.56635849194519, 59.970916647107124])[0]
    ar[3] = $ol.fromLonLat([30.368067897435544, 60.091246896287224])[1]
    ar[1] = $ol.fromLonLat([30.299556772693194, 59.786349700664246])[1]
    const view = new $ol.View({
        center: $ol.fromLonLat([30.316229, 59.938732]),
        zoom: 17,
        extent: ar,
    });

    map = new $ol.Map({
        target: mapContainer.value,
        layers: [
            new $ol.TileLayer({
                source: new $ol.OSM()
            })
        ],
        view: view,
        controls: []
    });
});

const zoomIn = () => {
  map.getView().setZoom(map.getView().getZoom() + 1);
};
const zoomOut = () => {
  map.getView().setZoom(map.getView().getZoom() - 1);
};

const drawer = ref(false)
</script>

<style scoped>
.v-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.map-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.v-navigation-drawer {
  z-index: 1000;
  height: 100% !important;
}

.v-btn {
  z-index: 1001;
}
</style>
