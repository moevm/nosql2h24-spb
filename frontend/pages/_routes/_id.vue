<template>


  <v-row justify="center" align="center">
    <v-dialog v-model="dialog" class="deletion-dialog d-flex align-center justify-center" max-width="400">
      <v-card width="400" height="200" class="d-flex flex-column overflow-hidden">
        <v-card-title>Подтверждение удаления</v-card-title>
        <v-card-text class="font-weight-bold">Вы уверены, что хотите удалить маршрут?</v-card-text>
        <v-row justify="end" align="end" class="ma-5">
          <v-btn class="mx-5" @click="dialog = false;">Отмена</v-btn>
          <v-btn @click="dialog = false; deleteRoute()">Ок</v-btn>
        </v-row>
      </v-card>
    </v-dialog>
    <v-col cols="16" sm="15" md="12">
      <v-card class="route-card" color="background">
        <v-container class="justify-space-between d-flex">
          <div class="d-flex flex-row w-66 pr-20 pl-0">
            <v-avatar size="150">
              <img :src="route.points[0].images[0]" alt="Изображение маршрута">
            </v-avatar>
            <v-col class="pl-10 align-center" justify="center">
              <v-card-title class="text-h5 font-weight-bold">{{ route.name }}</v-card-title>
              <v-col justify="center" align="center"><v-btn>Посмотреть на карте</v-btn></v-col>
            </v-col>
          </div>
          <v-col></v-col>
          <v-col>
            <v-row justify="end">
              <v-btn icon @click="dialog = true">
                <img src="~/assets/icons/delete.svg" alt="Выход" />
              </v-btn>

            </v-row>
            <v-col justify="end" class="mt-15">
              <div class="text-right">
                <v-card-subtitle class="ma-0 pa-0">Автор: <span class="font-weight-bold">{{ route.author.name
                    }}</span></v-card-subtitle>
                <v-card-subtitle class="ma-0 pa-0">Создан: {{ formatDate(route.createdAt) }}</v-card-subtitle>
              </div>
            </v-col>
          </v-col>
        </v-container>
      </v-card>

      <v-card class="route-details-card" color="background">
        <v-col align="center" justify="center">
          <div class="mx-15">
            <v-card-title>Основные характеристики:</v-card-title>
            <div class="justify-space-between d-flex px-5">
              <v-card-subtitle>Длина:</v-card-subtitle>
              <v-card-subtitle>{{ (route.length / 1000).toFixed(1) }} км</v-card-subtitle>
            </div>
            <div class="justify-space-between d-flex px-5">
              <v-card-subtitle>Длительность:</v-card-subtitle>
              <v-card-subtitle>{{ (route.duration / 60).toFixed(0) }} ч {{ (route.duration % 60).toFixed(0) }}
                мин</v-card-subtitle>
            </div>
          </div>
          <div class="mx-15">
            <v-card-title>Описание:</v-card-title>
            <v-card-text class="text-left">
              {{ route.description }}
            </v-card-text>
          </div>
          <div class="d-flex flex-column justify-center align-center my-10">
            <v-card-title>Точки маршрута</v-card-title>
            <v-col>
              <v-card v-for="poi of route.points" width="33%" height="100" :key="poi.id"
                class="text-left overflow-hidden ma-3 pa-5 d-flex align-center">
                <v-avatar size="75" rounded="0">
                  <img :src="poi.images[0]" alt="" />
                </v-avatar>
                <v-card-text class="px-3 font-weight-bold">{{ poi.name }}</v-card-text>
              </v-card>
            </v-col>
          </div>
        </v-col>
      </v-card>
    </v-col>

  </v-row>

</template>

<script>
export default {
  name: "RoutePage",
  data() {
    return {
      route: {},
      dialog: false,
    }
  },
  async asyncData({ $axios, redirect, params }) {
    try {
      const response = await $axios.get(`/api/routes/${params.id}`)
      const route = response.data
      route.points.map(point => {
        point.images = JSON.parse(point.images)
      })

      return { route: route }
    } catch (e) {
      if (e.response.status == 401) {
        localStorage.removeItem('access_token')
        redirect('/signin')
      }
    }
  },
  methods: {
    formatDate(date) {
      const [dateString, timeString] = date.split('T')
      const [year, month, day] = dateString.split('-')
      const [hours, minutes] = timeString.split(':')
      return `${day}.${month}.${year} ${hours}:${minutes}`
    },
    async deleteRoute() {
      await this.$axios.$delete(`/api/routes/${this.$route.params.id}`);
      this.$router.push('/');
    }
  }
}
</script>