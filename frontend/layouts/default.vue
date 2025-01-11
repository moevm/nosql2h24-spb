<template>
  <v-app dark>
    <Bar />
    <v-main>
      <v-container class="h-100">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  }
}
</script>



<style scoped>
#app {
  margin: 0;
  padding: 0;
  height: 100vh;
  background-image: url("~/assets/background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>