<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" color="secondary" width="400" floating>
      <div class="d-flex flex-column overflow-hidden" style="height: 100%;">
        <SearchField class="mx-4 mt-4 flex-0-0"></SearchField>
        <v-container class="flex-grow-1 d-flex flex-column overflow-auto">

          <v-row class="px-3 overflow-auto">
            <draggable v-model="column" tag="div" v-bind="dragOptions">
              <PointCard v-for="obj in column" :point="obj" :key="obj.id" class="mb-4"></PointCard>
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
    </v-main>
  </v-app>
</template>

<script setup>
definePageMeta({
  layout: false,
})

import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const mapContainer = ref(null);
const poi = ref(null);
const { $ol, $config } = useNuxtApp();

let map = null

const drawPoints = (points) => {
  var features = []
  points.forEach(poi => {
    console.log('poi:', poi);
    features.push(new $ol.Feature(new $ol.Point($ol.fromLonLat(poi))))
  })
  console.log('features:', features);
  const cluster = new $ol.Cluster({
    distance: 30,
    minDistance: 20,
    source: new $ol.VectorSource({ features })
  })
  const veclayer = new $ol.VectorLayer({
    source: cluster,
    style: $ol.pointStyle
  })
  map.addLayer(veclayer)
}

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

  $fetch(`${$config.public.backendUrl}/api/poi`, {
    method: 'GET'
  }).then(res => {
    poi.value = res
    drawPoints(res.map(poi => [poi.location.x, poi.location.y]))
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
</script>

<script>
export default {
  data() {
    return {
      drawer: false,
      dialog: false,
      poi: [],
      route_photo: 'https://sun9-34.userapi.com/s/v1/if1/Vk16_2miu_8rH8feSCI9JQqKKo95_us3mpBj29yfl7eGlxTrhlsvHG1e4woP7zhL2ebmcqOY.jpg?quality=96&as=32x24,48x36,72x54,108x81,160x121,240x181,360x272,480x362,540x408,640x483,720x543,848x640&from=bu&u=uAHL8XlnpBJYoXpEVgSlF6bfJuPn356m_8Ct00hdzxc&cs=848x640',
      column: [
        {
          id: 1,
          name: 'Училище правоведения',
          main_photo: 'https://p0.citywalls.ru/thumb0_586-600700.jpg?mt=1674505477'
        },
        {
          id: 2,
          name: 'Особняк Е. М. Бутурлиной',
          main_photo: 'https://p0.citywalls.ru/thumb0_0-32.jpg?mt=1273625807'
        },
        {
          id: 3,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 4,
          name: 'Особняк князя Л. В. Кочубеяgggggddddddddddddddddggggg gggggggggg ggggggggg',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 5,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 6,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 7,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 8,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 9,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 10,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 11,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 12,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 13,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 14,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        },
        {
          id: 15,
          name: 'Особняк князя Л. В. Кочубея',
          main_photo: 'https://p0.citywalls.ru/thumb0_545-559084.jpg?mt=1650825491'
        }
      ]
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
</style>
