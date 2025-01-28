<template>
  <v-app-bar app fixed color="transparent" class="elevation-0">
    <v-spacer />
    <v-btn icon class="mx-7" @click="navigateTo('/')">
      <img src="~/assets/icons/user.svg" class="icon-svg" />
    </v-btn>

    <v-btn icon class="mx-7" @click="navigateTo('/map')">
      <img src="~/assets/icons/map.svg" />
    </v-btn>

    <v-btn icon class="mx-7" @click="navigateTo('/statistics')">
      <img src="~/assets/icons/bar-chart.svg" />
    </v-btn>

    <v-btn @click="exportDialog = true; createExportLink()" icon class="mx-7">
      <img src="~/assets/icons/download.svg" />
    </v-btn>
    <v-dialog v-model="exportDialog" class="export-dialog d-flex align-center justify-center" max-width="400">
      <v-card class="d-flex flex-column overflow-hidden">
        <v-card-title>Экспорт данных</v-card-title>
        <v-card-subtitle v-if="exportResults.ready">
          Экспортировано: {{ exportResults.nodes }} узлов и {{ exportResults.relationships }} отношений.
        </v-card-subtitle>
        <v-row justify="end" align="end" class="ma-5">
          <v-btn class="mx-5" @click="exportDialog = false; exportResults.ready = false; exportJsonReady = false">
            Отмена
          </v-btn>
          <v-btn @click="exportResults.ready = true" id="export-btn" :disabled="!exportJsonReady" download="export.json"
            :href="exportLink">Экспорт</v-btn>

        </v-row>
      </v-card>
    </v-dialog>

    <v-btn icon class="mx-7">
      <img src="~/assets/icons/upload.svg" />
    </v-btn>

    <v-spacer />
  </v-app-bar>
</template>

<script setup>
const exportDialog = ref(false);
const exportJsonReady = ref(false);
const exportLink = ref('');
const exportResults = reactive({
  nodes: 0,
  relationships: 0,
  ready: false
})

const { $config } = useNuxtApp();
function createExportLink() {
  $api(`${$config.public.backendUrl}/api/database/export`, {
    onResponse: ({ request, response, options }) => {
      if (response.status == 200) {
        exportResults.nodes = response._data.nodesCount.low;
        exportResults.relationships = response._data.relationshipsCount.low;
        const exportJson = response._data.data;
        exportLink.value = 'data:text/json;charset=UTF-8,' + encodeURIComponent(exportJson);
        exportJsonReady.value = true;
        exportResults.ready = true;
      }
      else if (response.status == 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        navigateTo('/signin')
      }

    }
  });
}

</script>