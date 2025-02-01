<template>
  <v-row class="ml-5 mr-5">
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
          Обработано элементов: {{ elementsNum }}
        </div>
      </v-col>
      <v-col>
        <p>Y:</p>
        <DropDownFeild 
          v-if="data"
          :items="yLabels" 
          v-model="this.yLabel" 
          @update:data="setYLabel"
        />
      </v-col>
      <v-col>
        <p>X:</p>
        <DropDownFeild 
          v-if="data"
          :items="xLabels" 
          v-model="this.xLabel" 
          @update:data="setXLabel"
        />
      </v-col>
  </v-row>
  <BarChart :data="chartData"/>
  <!-- <v-row  v-if="this.parsedFilterData().result.type === 'chart'"> -->

  <!-- </v-row> -->
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
        elementsNum: 0,
        yLabel: ref("_Y_"),
        xLabel: ref("_X_")
      }
    },
    mounted() {
      if (this.data) {
        this.xLabel = Object.values(this.data[1].result.xLabels)[0]
        this.yLabel = Object.values(this.data[1].result.yLabels)[0]
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
        yLabels() {
          if(this.data) {
            // console.log(Object.values(this.data[1].result.yLabels))
            return Object.values(this.data[1].result.yLabels)
          } else {
            return []
          }
        },
        xLabels() {
          if(this.data) {
            return Object.values(this.data[1].result.xLabels)
          } else {
            return []
          }
        },
    },
    methods: {
      setYLabel(data) {
        this.yLabel = data
      },
      setXLabel(data) {
        this.xLabel = data
      },

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
            console.log(item.description.length)
            labels.push(this.getChartDataLabel(item))
            data.push(this.getChartDataDataset(item))
          })
          this.elementsNum = response.length

          this.chartData = {
            labels: labels,
            datasets: [
              {
                label: this.yLabel,
                backgroundColor: '#f87979',
                data: data
              }
            ]
          }

        } catch (err) {
          console.error('Ошибка фильтрации:', err);
        }
      },

      getChartDataLabel(item) {
        if (this.xLabel === "Название объекта") {
          return item.name
        } else if (this.xLabel === "Дата создания записи") {
          return item.createdAt
        }
      },
      getChartDataDataset(item) {
        if (this.yLabel === "Число изображений") {
          return item.images.length
        } else if (this.yLabel === "Длина описания") {
          return item.description.length
        }
      }

    }
  }
  </script> 
   
  <style> 
  </style>