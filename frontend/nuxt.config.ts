// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      backendHost: process.env.BACKEND_HOST,
      backendPort: process.env.BACKEND_PORT,
      backendUrl: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', undefined],
  vuetify: {},
  plugins: ['~/plugins/open-layers.ts'],
  // build: {
  //   transpile: ['ol/map, ol/View', 'ol/layer/Tile', 'ol/source', 'ol/source/OSM']
  // }
  
})