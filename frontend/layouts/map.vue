<template>
  <v-app dark>
    <Bar />
    <!-- <v-navigation-drawer
      color="blue"
      v-model="drawer"
      width="400"
      style="z-index: 1000;"
    >
    </v-navigation-drawer>
    <v-btn
      class="ma-2"
      icon
      @click="drawer = !drawer"
      style="z-index: 1001;"
    >
      <v-icon>mdi-{{ `chevron-${drawer ? 'right' : 'left'}` }}</v-icon>
    </v-btn> -->
    <v-main style="height: 100vh; overflow: hidden;">
      <slot />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'MapLayout',
  data() {
    return {
      drawer: true
    }
  }
}
</script>

<style scoped>
.v-app {
  height: 100vh;
  overflow: hidden;
}

.v-main {
  padding: 0; /* Убедитесь, что нет отступов */
  height: 100%;
  overflow: hidden;
}
</style>
