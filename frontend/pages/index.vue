<template>
  <v-row justify="center" class="h-100 pb-16">
    <v-col cols="12" sm="12" md="10">
      <v-sheet color="primary" class="px-14 py-4">
        <div class="d-flex flex-column ga-5">
          <div class="d-flex justify-space-between">
            <div class="d-flex flex-column">
              <span class="text-h5">Егор Зимов</span>
              <span style="text-decoration: underline;">e.zimov_letov@pochta.su</span>
              <span>27.10.2025</span>
            </div>
            <v-btn icon color="transparent" elevation="0">
              <img src="~/assets/icons/Log out.svg" @click="console.log('click')" />
            </v-btn>
          </div>
          <div class="d-flex align-center ga-2">
            <SearchField hide-details rounded="xl" density="comfortable"></SearchField>
            <Btn density="comfortable" label="Фильтры"></Btn>
          </div>
          <div>
            Всего маршрутов: 3
          </div>
          <div class="text-h5">
            Перечень маршрутов
          </div>
          <v-row class="px-3 overflow-auto">
            <RouteCard v-for="obj in routeList" :route="obj" :key="obj.id" class="mb-4"></RouteCard>
          </v-row>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      email: '',
      name: '',
      registration_date: '',
      routeList: [
        {
          main_photo: 'https://p0.citywalls.ru/thumb0_586-600700.jpg?mt=1674505477',
          name: 'Мегамаршрут',
          points_name: [
            'Станция метро "Чёрная речка"',
            'Место последней дуэли А.С, Пушкина',
            'Мемориальный музей-квартира им. А.С Пушкина'
          ],
          length: '1.5 км',
          duration: '30 мин',
          description: 'Этот увлекательный маршрут по историческим местам Санкт-Петербурга и его окрестностям позволит вам погрузиться в мир великого русского поэта Александра Сергеевича Пушкина. Начнем с посещения дома на Мойке, где поэт жил и творил, вдохнув жизнь в свои знаменитые произведения. Далее мы направимся к Летнему саду, олицетворяющему классическую красоту и вдохновение, отразившееся в его лирике.'
        }
      ]
    }
  }
}
</script>
