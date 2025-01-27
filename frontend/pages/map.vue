<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" color="secondary" width="400" floating>
      <div class="d-flex flex-column overflow-hidden" style="height: 100%;">
        <SearchField class="mx-4 mt-4 flex-0-0"></SearchField>
        <v-container class="flex-grow-1 d-flex flex-column overflow-auto">

          <v-row class="px-3 overflow-auto">
            <draggable v-model="column" tag="div" v-bind="dragOptions">
              <PointCard v-for="obj in poi" :point="obj" :updateFunction="pointUpdate" :key="obj.id" class="mb-4"></PointCard>
            </draggable>
          </v-row>

        </v-container>
        <v-toolbar color="secondary" class="pa-4">
          <v-spacer />
          <v-btn icon class="mx-7" @click="dialog = true">
            <img src="~/assets/icons/Save.svg" class="icon-svg" />
          </v-btn>
          <v-btn icon class="mx-7" @click="console.log('click')">
            <img src="~/assets/icons/directions_walk.svg" class="icon-svg" />
          </v-btn>
          <v-btn icon class="mx-7" @click="console.log('click')">
            <img src="~/assets/icons/close.svg" class="icon-svg" />
          </v-btn>
          <v-spacer />
        </v-toolbar>
      </div>
    </v-navigation-drawer>

    <v-dialog v-model="dialog" width="auto">
      <v-card class="rounded-xl" color="primary">
        <v-container class="pa-8">
          <div class="d-flex flex-column ga-5">
            <div class="d-flex ga-5 align-center">
              <v-avatar size="160" rounded="0" :image="route_photo">
              </v-avatar>
              <div class="d-flex flex-column ga-9 fill-height">
                <div class="text-h5">
                  Создание записи о маршруте
                </div>
                <!-- <v-text-field label="Название маршрута" v-model="route_name" hide-details density="comfortable" variant="solo" rounded="xl"></v-text-field> -->
                <TextField label="Название маршрута" v-model="route_name" variant="solo" hide-details
                  density="comfortable"></TextField>
              </div>
            </div>
            <TextArea label="Описание маршрута" v-model="route_description" z>

            </TextArea>
            <div class="d-flex justify-end ga-5">
              <Btn label="Отменить" class="custom-margin" @click="dialog = false" density="comfortable"></Btn>
              <Btn label="Сохранить" class="custom-margin" @click="dialog = false" density="comfortable"></Btn>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <Bar />
    <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 10px;" :style="{
      position: 'absolute',
      top: '74px',
      left: drawer ? '410px' : '10px',
      transition: 'left 0.2s ease',
    }">
      <v-btn icon @click="drawer = !drawer" color="primary">
        <v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>
      <v-btn icon @click="zoomIn" color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn icon @click="zoomOut" color="primary">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </div>
    <v-main>
      <v-container>
        <div ref="mapContainer" class="map-container"></div>
      </v-container>


      <div id="popup" ref="popup" class="ol-popup">
        <MapPoint :point="mappoint" :updateFunction="pointUpdate"></MapPoint>
      </div>


    </v-main>
  </v-app>
</template>

<script setup>
import MapPoint from '~/components/MapPoint.vue';

definePageMeta({
  layout: false,
})

import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const mapContainer = ref(null);
const poi = ref(null);
const mappoint = ref(null);
const { $ol, $config } = useNuxtApp();

let map = null
let pointsLayer = null

const drawPoints = (points) => {
  var features = []
  points.forEach(poi => {
    features.push(new $ol.Feature({
      geometry: new $ol.Point($ol.fromLonLat([poi.location.x, poi.location.y])),
      poi: poi
    }))
  })
  console.log('features:', features);
  const cluster = new $ol.Cluster({
    distance: 40,
    // minDistance: 20,
    source: new $ol.VectorSource({ features })
  })
  const veclayer = new $ol.VectorLayer({
    source: cluster,
    style: $ol.pointStyle
  })
  map.addLayer(veclayer)
  pointsLayer = veclayer
}

const popup = ref(null);
const popupContent = ref(null);

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

  const overlay = new $ol.Overlay({
    element: popup.value,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });
  map.addOverlay(overlay);

  map.on('singleclick', (evt) => {
    const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) { return feature })
    if (!feature || feature.get('features').length > 1) {
      overlay.setPosition(undefined);
      closer.blur();
      return false;
    }
    mappoint.value = feature.get('features')[0].values_.poi
    const coordinate = evt.coordinate;
    // popupContent.value.innerHTML = '<p>Всплывающее окно!</p>'
    overlay.setPosition(coordinate);
  });

  map.on('pointermove', function (e) {
    const i = map.forEachFeatureAtPixel(e.pixel, function (feature) {
      return feature.get('features').length;
    })
    if (i > 1) {
      return
    }
    const hit = map.hasFeatureAtPixel(e.pixel);
    map.getTarget().style.cursor = hit ? 'pointer' : '';
  });

  $fetch(`${$config.public.backendUrl}/api/poi`, {
    method: 'GET'
  }).then(res => {
    poi.value = res.map(poi => {
      poi.images = JSON.parse(poi.images)
      poi.choosed = false
      return poi
    })
    // mappoint.value = poi.value[0]
    console.log('res:', res);
    drawPoints(poi.value)
    // drawPoints([[30.316229, 59.938732]])
  })
});


const zoomIn = () => {
  console.log('poi:', poi.value);
  map.getView().animate({
    zoom: map.getView().getZoom() + 1,
    duration: 200
  });
};
const zoomOut = () => {
  map.getView().animate({
    zoom: map.getView().getZoom() - 1,
    duration: 200
  });
};
const pointUpdate = () => {
  pointsLayer.changed()
}
</script>

<script>
export default {
  data() {
    return {
      drawer: false,
      dialog: false,
      mappoint: {},
      poi: [],
      route_photo: 'https://sun9-34.userapi.com/s/v1/if1/Vk16_2miu_8rH8feSCI9JQqKKo95_us3mpBj29yfl7eGlxTrhlsvHG1e4woP7zhL2ebmcqOY.jpg?quality=96&as=32x24,48x36,72x54,108x81,160x121,240x181,360x272,480x362,540x408,640x483,720x543,848x640&from=bu&u=uAHL8XlnpBJYoXpEVgSlF6bfJuPn356m_8Ct00hdzxc&cs=848x640'
    }
  }
}
</script>

<style scoped>
.map-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.registration-card {
  border-radius: 20px;
  padding: 27px;
}

.dialog-card {
  padding: 27px;
}

.v-btn {
  z-index: 1001;
}

.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}

.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}

.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
</style>