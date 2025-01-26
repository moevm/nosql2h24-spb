<template>
  <v-app dark>
    <!-- <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-app-bar
      :clipped-left="!clipped"
      fixed
      app
      color="transparent"
      class="elevation-0"
      dark
    >
      <v-spacer />
      <!-- <v-btn
        icon
        @click.stop="drawer = !drawer"
        class="mx-7"
      >
        <v-icon>mdi-{{ `chevron-${drawer ? 'left' : 'right'}` }}</v-icon>
      </v-btn> -->

      <v-btn
        icon
        class="mx-7"
      >
        <img src="~/assets/icons/user.svg" class="icon-svg"/>
      </v-btn>

      <v-btn
        icon
        class="mx-7"
      >
        <img src="~/assets/icons/map.svg" />
      </v-btn>

      <v-btn
        icon
        class="mx-7"
        to="statistics"
      >
      <img src="~/assets/icons/bar-chart.svg" />
      </v-btn>

      <v-btn
        icon
        class="mx-7"
      >
        <img src="~/assets/icons/download.svg" />
      </v-btn>

      <v-btn
        icon
        class="mx-7"
      >
        <img src="~/assets/icons/upload.svg" />
      </v-btn>

      <v-spacer />
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <!-- <v-navigation-drawer
      v-model="rightDrawer"
      :right="right"
      temporary
      fixed
    >
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <!-- <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer> -->
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
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