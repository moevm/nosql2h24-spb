<template>
  <v-dialog v-model="dialog" class="poi-add-dialog d-flex align-center justify-center" max-width="400">
    <v-card class="d-flex flex-column overflow-hidden">
      <v-card-title>Выбор точек</v-card-title>
      <SearchField label="Название точки" class="mx-4 mt-4 flex-0-0" v-model="searchPoi"></SearchField>
      <v-container class="flex-grow-1 d-flex flex-column overflow-auto">
        <v-row class="px-3 overflow-auto">
          <PointCard v-for="obj in points_column" :point="obj" :key="obj.id" class="mb-4 w-100"></PointCard>
        </v-row>
      </v-container>
      <v-row justify="end" align="end" class="ma-5">
        <v-btn class="mx-5" @click="dialog = false;">Отмена</v-btn>
        <v-btn @click="dialog = false; addPoints()">Ок</v-btn>
      </v-row>
    </v-card>
  </v-dialog>
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
              <img src="~/assets/icons/Log out.svg" @click="logout()" alt="Кнопка выхода" />
            </v-btn>
          </div>
          <div class="d-flex justify-space-between">
            <Btn label="Точки интереса" to="/st/poi" density="comfortable"></Btn>
            <Btn label="Маршруты" to="/st/route" density="comfortable"></Btn>
            <Btn label="Пользователи" to="/st/user" density="comfortable"></Btn>
          </div>
          <div class="d-flex align-center ga-2">
            <SearchField hide-details rounded="xl" density="comfortable" v-model="filters.search"></SearchField>
            <Btn @click="openFilters()" density="comfortable" label="Фильтры"></Btn>
          </div>
          <v-card v-if="filtersOpened" color="secondary" height="auto" class="pa-3">
            <v-row>
              <v-col>
                <v-card-text>Длина, м</v-card-text>
                <div class="d-flex justify-space-between">
                  <v-card-text>От</v-card-text>
                  <TextField v-model="filters.minLength"></TextField>
                </div>

                <div class="d-flex justify-space-between">
                  <v-card-text>До</v-card-text>
                  <TextField v-model="filters.maxLength"></TextField>
                </div>

              </v-col>

              <v-col>
                <v-card-text>Длительность, мин</v-card-text>
                <div class="d-flex justify-space-between">
                  <v-card-text>От</v-card-text>
                  <TextField v-model="filters.minDuration"></TextField>
                </div>

                <div class="d-flex justify-space-between">
                  <v-card-text>До</v-card-text>
                  <TextField v-model="filters.maxDuration"></TextField>
                </div>
              </v-col>

              <v-col>
                <v-card-text>Количество точек интереса</v-card-text>
                <div class="d-flex justify-space-between">
                  <v-card-text>От</v-card-text>
                  <TextField v-model="filters.minPoiCount"></TextField>
                </div>

                <div class="d-flex justify-space-between">
                  <v-card-text>До</v-card-text>
                  <TextField v-model="filters.maxPoiCount"></TextField>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-card-text>Дата создания</v-card-text>
                <div class="d-flex justify-space-between">
                  <v-card-text>От</v-card-text>
                  <TextField type="date" v-model="filters.minDate"></TextField>
                </div>

                <div class="d-flex justify-space-between">
                  <v-card-text>До</v-card-text>
                  <TextField type="date" v-model="filters.maxDate"></TextField>
                </div>

              </v-col>

              <v-col>
                <v-card-text>Автор</v-card-text>
                <v-checkbox v-model="onlyUserRoutes" label="Только мои маршруты"></v-checkbox>
                <TextField v-model="filters.author" label="Имя пользователя"></TextField>

              </v-col>

              <v-col justify="center" align="center">
                <v-card-text>Основные точки маршрута</v-card-text>
                <v-btn @click="dialog = true" rounded="xl">Выбрать точки</v-btn>
              </v-col>
            </v-row>
          </v-card>
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

const dialog = ref(false)

const user = ref(null);
const onlyUserRoutes = ref(false);
const routes = ref([]);

const points_column = ref([])
const searchPoi = ref("")

const filtersOpened = ref(false)
const filters = reactive({
  search: "",
  minDate: null,
  maxDate: null,
  minLength: null,
  maxLength: null,
  minDuration: null,
  maxDuration: null,
  minPoiCount: null,
  maxPoiCount: null,
  author: "",
  points: [],
});

function openFilters() {
  filtersOpened.value = !filtersOpened.value
}

watch(searchPoi, () => {
  $api(`${$config.public.backendUrl}/api/poi?search=${searchPoi.value}`, {
    onResponse: ({ request, response, options }) => {
      if (response.status == 200) {
        points_column.value = response._data;
        points_column.value.map(poi => {
          poi.main_photo = JSON.parse(poi.images)[0]
        })
      }
      else if (response.status == 401) {
        logout();
      }
    }
  })
})

watch(onlyUserRoutes, () => {
  if (onlyUserRoutes.value) {
    filters.author = user.value.name
  } else {
    filters.author = ''
  }
})


watch(filters, () => {
  const numMinLength = parseFloat(filters.minLength)
  const numMaxLength = parseFloat(filters.maxLength)
  const numMinDuration = parseFloat(filters.minDuration)
  const numMaxDuration = parseFloat(filters.MaxDuration)
  const numMinPoiCount = parseInt(filters.minPoiCount)
  const numMaxPoiCount = parseInt(filters.maxPoiCount)
  filters.minLength = isNaN(numMinLength) ? undefined : numMinLength
  filters.maxLength = isNaN(numMaxLength) ? undefined : numMaxLength
  filters.minDuration = isNaN(numMinDuration) ? undefined : numMinDuration
  filters.maxDuration = isNaN(numMaxDuration) ? undefined : numMaxDuration
  filters.minPoiCount = isNaN(numMinPoiCount) ? undefined : numMinPoiCount
  filters.maxPoiCount = isNaN(numMaxPoiCount) ? undefined : numMaxPoiCount
  filters.minDate = filters.minDate ? filters.minDate: undefined
  filters.maxDate = filters.maxDate ? filters.maxDate: undefined
  

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

  $api(`${$config.public.backendUrl}/api/poi?search=${searchPoi.value}`, {
    onResponse: ({ request, response, options }) => {
      if (response.status == 200) {
        points_column.value = response._data;
        points_column.value.map(poi => {
          poi.main_photo = JSON.parse(poi.images)[0]
          poi.selected = false;
        })
      }
      else if (response.status == 401) {
        logout();
      }
    }
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

function addPoints() {
  const selectedPoints = points_column.value.filter(poi => poi.selected);
  filters.points = selectedPoints.map(poi => poi.id);
}
</script>
