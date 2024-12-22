<template>
    <v-app-bar
      :clipped-left="!clipped"
      fixed
      app
      color="transparent"
      class="elevation-0"
      dark
    >
      <v-spacer />
      <v-btn
        icon
        class="mx-7"
      >
        <img src="~/assets/icons/user.svg" class="icon-svg"/>
      </v-btn>

      <v-btn
        icon
        class="mx-7"
        @click="$router.push('/map')"
      >
        <img src="~/assets/icons/map.svg" />
      </v-btn>

      <v-btn
        icon
        class="mx-7"
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
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
    }
  }
}
</script>