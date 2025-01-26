<template>
  <v-app class="bg-img">
    <Bar />
    <v-main>
      <v-container class="h-100">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.bg-img {
  background: url("/background.png");
  background-size: cover;
  background-position: center;
}
</style>
