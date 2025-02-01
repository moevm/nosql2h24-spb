<template>
  <v-row>
      <v-col>
        <div>
          <v-btn 
            color="primary"
            @click="applyFilters"
          >
            Применить фильтры
          </v-btn>
        </div>
        <div class="pt-3">
          Найдено элементов: {{ elementsNum }}
        </div>
      </v-col>
      <v-col>
                    <DropDownFeild 
                        :items="Object.keys(this.dataBaseEntities)" 
                        v-model="this.chosenEntity" 
                        @update:data="handleUpdate"
                    />
                    <DropDownFeild 
                        :items="Object.keys(this.dataBaseEntities)" 
                        v-model="this.chosenEntity" 
                        @update:data="handleUpdate"
                    />
        <!-- <p>{{ tableData }}</p> -->
      </v-col>
  </v-row>
  <BarChart :data="chartData"/>
</template>
   

  <script> 
  export default {
    props: {
      data: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        chartData: {
          labels: [],
          datasets: [
            {
              data: []
            }
          ]
        },
        // tableData: ref([]),
        elementsNum: 0
      }
    },
    computed: {
        parsedFilterData() {
            if(this.data) {
                return Object.entries(this.data[1])[1][1]
            } else {
                return []
            }
        },
        yLabel() {
          if (this.parsedFilterData()) {
            return this.parsedFilterData().result.yLabels[0]
          }
          return ""
        },
        xLabel() {
          return ""
        }
    },
    methods: {

      getFilterValue(label, text) {
        return this.parsedFilterData.find((elem) => {
          return elem.label == label
        }).fields.find((field) => {
          return field.text == text
        }).value
      },

      async applyFilters() {
        try {
          // Формируем query параметры
          const queryParams = {
            name: this.getFilterValue("Название точки", "Введите название места") || undefined,
            description: undefined,
            fromDate: undefined,
            toDate: undefined,
            fromLat: undefined,
            toLat: undefined,
            fromLng: undefined,
            toLng: undefined
          };

          const response = await $fetch(`${this.$config.public.backendUrl}/api/poi/filtr`, {
            method: 'POST',
            body: queryParams
          });

          // Обрабатываем ответ
          // this.tableData = response.map(item => ({
          //   id: item.id.split(':')[2],
          //   poi_created_at: item.createdAt,
          //   poi_description: JSON.parse(item.description),
          //   poi_images: JSON.parse(item.images),
          //   poi_location: {
          //     x: item.location.x,
          //     y: item.location.y
          //   },
          //   poi_name: item.name
          // }));
          let labels = []
          let data = []
          response.map(item => {
            labels.push(item.name)
            data.push(item.images.length || 0)
          })
          this.elementsNum = response.length

          this.chartData = {
            labels: labels,
            datasets: [
              {
                label: 'Data One',
                backgroundColor: '#f87979',
                data: data
              }
            ]
          }

        } catch (err) {
          console.error('Ошибка фильтрации:', err);
        }
      }
    }
  }
  </script> 
   
  <style> 
  </style>