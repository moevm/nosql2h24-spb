<template>
  <v-row justify="center" class="h-100 pb-16">
    <v-col cols="12" sm="12" md="10">
      <v-sheet color="primary" class="px-14 py-4">
        <div class="d-flex flex-column ga-5">
          <div class="d-flex justify-space-between">
            <div class="d-flex flex-column">
              <span class="text-h5">{{ user?.name }}</span>
              <span style="text-decoration: underline;">{{ user?.email }}</span>
              <span>{{ formatDate(user?.createdAt) }}</span>
            </div>
            <v-btn icon color="transparent" elevation="0">
              <img src="~/assets/icons/Log out.svg" @click="logout()" />
            </v-btn>
          </div>
          <div class="d-flex align-center ga-2">
            <SearchField hide-details rounded="xl" density="comfortable" v-model="filters.search"></SearchField>
            <Btn density="comfortable" label="Фильтры"></Btn>
          </div>
          <div>
            Всего маршрутов: {{ routes.length }}
          </div>
          <div class="text-h5">
            Перечень маршрутов
          </div>
          <v-row class="px-3 overflow-auto">
            <RouteCard v-for="obj in routes" :route="obj" :key="obj.id" class="mb-4"></RouteCard>
          </v-row>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>


<script setup>
const { $config } = useNuxtApp();

const user = ref(null);
const routes = ref([]);
const filters = reactive({
  search: "",
  minDate: null,
  maxDate: null,
  minLength: null,
  maxLength: null,
  minDuration: null,
  maxDuration: null,
  points: [],

});

watch(filters, () => {
  $api(`${$config.public.backendUrl}/api/routes?filters=${JSON.stringify(filters)}`, {

    onResponse: ({ request, response, options }) => {
      console.log(request);
      if (response.status == 200) {
        routes.value = response._data;
        routes.value.map(route => {
          route.points.map(poi => {
            poi.images = JSON.parse(poi.images)
          })
        })
      }
      else if (response.status == 401) {
        logout();
      }
    }

  }
  )
})

onMounted(() => {
  $api(`${$config.public.backendUrl}/api/users/${localStorage.getItem('user_id')}`, {
    onResponse: (({ request, response, options }) => {
      if (response.status == 200) {
        user.value = response._data;
      }
      else if (response.status == 401) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('access_token');
        navigateTo('/signin')
      }
    })
  })

  $api(`${$config.public.backendUrl}/api/routes`, {
    onResponse: (({ request, response, options }) => {
      if (response.status == 200) {
        routes.value = response._data;
        routes.value.map(route => {
          route.points.map(poi => {
            poi.images = JSON.parse(poi.images)
          })
        })
      }
      else if (response.status == 401) {
        logout();
      }
    })
  })
})

function logout() {
  localStorage.removeItem('user_id');
  localStorage.removeItem('access_token');
  navigateTo('/signin');
}

function formatDate(date) {
  if (date == null) {
    return ""
  }
  const [dateString, timeString] = date.split('T')
  const [year, month, day] = dateString.split('-')
  const [hours, minutes] = timeString.split(':')
  return `${day}.${month}.${year} ${hours}:${minutes}`
}
</script>
