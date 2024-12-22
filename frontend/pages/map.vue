<template>
  <v-container fluid style="position: relative;">
    <v-navigation-drawer
      v-model="drawer"
      app
      width="400"
    >
      <!-- Содержимое панели навигации -->
    </v-navigation-drawer>
    <v-btn
      class="ma-2"
      absolute
      icon
      @click="drawer = !drawer"
    >
      <v-icon>mdi-{{ `chevron-${drawer ? 'right' : 'left'}` }}</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'MapPage',
  layout: 'map',
  data () {
    return {
      drawer: true
    }
  }
}
</script>

Найти еще
