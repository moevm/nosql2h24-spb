// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      backendHost: process.env.BACKEND_HOST,
      backendPort: process.env.BACKEND_PORT,
      backendUrl: `http://${process.env.BACKEND_HOST}:${process.env.BACKEND_PORT}`
    }
  },
  nitro: {
    prerender: {
      failOnError: false
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', undefined],
  vuetify: {
    vuetifyOptions: {
      theme: {
        themes: {
          light: {
            colors: {
              background: '#FFFFFF',
              primary: '#F5F5F5',
              secondary: '#9FADBF',
              soft: '#DEDEDF',
              accent: '#5D807A',
              error: '#B65B5B',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FFC107'
            }
          }
        }
      }
    }
  },
  plugins: ['~/plugins/open-layers.ts', '~/plugins/vue-draggable.client.ts'],
  // build: {
  //   transpile: ['ol/map, ol/View', 'ol/layer/Tile', 'ol/source', 'ol/source/OSM']
  // }
  
})