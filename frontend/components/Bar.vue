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

    <v-btn icon class="mx-7">
      <img src="~/assets/icons/download.svg" />
    </v-btn>

    <v-btn icon class="mx-7">
      <img src="~/assets/icons/upload.svg" />
    </v-btn>

    <v-spacer />
  </v-app-bar>
</template>