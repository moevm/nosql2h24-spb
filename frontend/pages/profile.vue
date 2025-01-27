<template>
  <v-row justify="center" align="center">
    <v-col cols="16" sm="15" md="12">
      <v-card class="profile-card" color="background">
        <div class="d-flex justify-lg-space-between">
          <v-card-title class="headline text-center d-flex text-h5 pb-0">
            {{ user.name }}
          </v-card-title>
          <v-btn icon class="ma-5 mb-0" @click="logout()">
            <img src="~/assets/icons/logout.svg" alt="Выход" />
          </v-btn>
        </div>
        <v-card-text class="text-decoration-underline text-h6 py-0">
          {{ user.email }}
        </v-card-text>
        <v-card-text class="pt-0">{{ formatDate(user.createdAt) }}</v-card-text>
        <div class="w-50 d-flex" style="width: 50%;">
          <TextField class="mx-5" label="Поиск маршрута"/>
          <v-btn class="mt-2">Показать фильтры</v-btn>
        </div>
        <v-card-text class="pb-0">Отображено маршрутов: {{ routes.length }}</v-card-text>
        <v-card-title>Перечень найденных маршрутов:</v-card-title>
        <v-col align="center">
          <v-card v-for="route of routes" :key="route.id" class="d-flex ma-5" max-width="75%" >
            <v-avatar rounded="0">
              <img :src="route.points[0].images[0]" alt="Изображение маршрута"/>
            </v-avatar>
            <v-card-title :to="`/routes/${route.id}`" class="text-h6">{{ route.name }}</v-card-title>
          </v-card>
        </v-col>
      </v-card>

    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ProfilePage',

  data() {
    return {
      user: {},
      routes: []
    }
  },
 
  async asyncData({ $axios, redirect }) {
    try {
      const userResponse = await $axios.get(`/api/users/${localStorage.getItem('user_id')}`);
      const user = userResponse.data

      const routesResponse = await $axios.get('/api/routes');
      const routes = routesResponse.data;
      routes.map(route => {
        route.points.map(poi => {
          poi.images = JSON.parse(poi.images)
        })
      })

      return { user: user, routes: routes }
    }
    catch (e) {
      console.log(e.toString())
      if (e.response.status == 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id')
        redirect('/signin');
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
    logout() {
      localStorage.removeItem('user_id')
      localStorage.removeItem('access_token')
      this.$router.push('/signin');
    }
  }
}
</script>

<style scoped>
.registration-card {
  background-color: primary;
  border-radius: 20px;
  padding: 27px;
}

.custom-margin {
  margin-top: 0;
  margin-bottom: 28px;
}
</style>