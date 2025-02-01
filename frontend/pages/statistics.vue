<template>
    <v-card>
        <v-card-title justify="center" class="statistic-card-title headline">Статистика</v-card-title>
        <v-card-text class="mt-3">
            <v-row justify="center">
                <v-col cols="12" md="3">
                    <DropDownFeild 
                        :items="Object.keys(this.dataBaseEntities)" 
                        v-model="this.chosenEntity" 
                        @update:data="handleUpdate"
                    />
                </v-col>
            </v-row>
            <!-- {{ filterData }} -->
            <v-row class="ml-5 mr-5 headline">
                <v-col>
                    <p>Фильтры</p>
                </v-col>
            </v-row>
            <StatisticsFilters 
                :filterData="filterData"
                v-model="filterData"
            />
            <StatisticsChart :data="filterData" />
        </v-card-text>
    </v-card>

</template>

<script>
export default {
    name: "statisticsPage",
    data() { 
        return { 
            pageStructure: {
                user: {
                    entity: "Пользователь (В разработке)",
                    params: [
                        {
                            label: "Пройденное расстояние",
                            rule: "range",
                            fields: [
                                {
                                    type: "decimal",
                                    text: "Мин. расстояние (км)",
                                    value: 0.1
                                },
                                {
                                    type: "decimal",
                                    text: "Макс. расстояние (км)",
                                    value: 10
                                },
                            ]
                        },
                        {
                            label: "Пройденное время",
                            fields: [
                                {
                                    type: "number",
                                    text: "Мин. время (мин)",
                                    value: 20
                                },
                                {
                                    type: "number",
                                    text: "Макс. время (мин)",
                                    value: 300
                                },
                            ]
                        },
                        {
                            label: "Пройденно маршрутов",
                            fields: [
                                {
                                    type: "number",
                                    text: "Мин. кол. маршрутов",
                                    value: 2
                                },
                                {
                                    type: "number",
                                    text: "Макс. кол. маршрутов",
                                    value: 100
                                },
                            ]
                        },
                        {
                            label: "Дата регистрации",
                            fields: [
                                {
                                    type: "date",
                                    text: "С",
                                    value: "2000-01-01"
                                },
                                {
                                    type: "date",
                                    text: "До",
                                    value: this.todayDate
                                },
                            ]
                        },
                    ],
                    result: {
                        type: "chart",
                        xLabels: [
                            "Название объекта",
                            "Дата создания записи"
                        ],
                        yLabels: [
                            "Число изображений",
                            "Длина описания"
                        ]
                    }
                },
                route: {
                    entity: "Маршрут (В разработке)",
                    params: [
                        {
                            label: "Длина",
                            fields: [
                                {
                                    type: "decimal",
                                    text: "Мин. длина (км)",
                                    value: 0.1
                                },
                                {
                                    type: "decimal",
                                    text: "Макс. длина (км)",
                                    value: 10
                                },
                            ]
                        },
                        {
                            label: "Длительность",
                            fields: [
                                {
                                    type: "number",
                                    text: "Мин. время (мин)",
                                    value: 20
                                },
                                {
                                    type: "number",
                                    text: "Макс. время (мин)",
                                    value: 300
                                },
                            ]
                        },
                        {
                            label: "Количество точек интереса",
                            fields: [
                                {
                                    type: "number",
                                    text: "Мин. кол. точек",
                                    value: 2
                                },
                                {
                                    type: "number",
                                    text: "Макс. кол. точек",
                                    value: 100
                                },
                            ]
                        },
                        {
                            label: "Дата создания",
                            fields: [
                                {
                                    type: "date",
                                    text: "С",
                                    value: "2000-01-01"
                                },
                                {
                                    type: "date",
                                    text: "До",
                                    value: this.todayDate
                                },
                            ]
                        },
                        {
                            label: "Автор",
                            fields: [
                                {
                                    type: "checkbox",
                                    text: "Только мои маршруты",
                                    value: false
                                },
                                {
                                    type: "text",
                                    text: "",
                                    value: ""
                                },
                            ]
                        },
                        {
                            label: "Основные точки маршрута:",
                            fields: [
                                {
                                    type: "button",
                                    text: "Добавить точек",
                                    value: []
                                },
                            ]
                        },
                    ],
                    result: {
                        type: "chart",
                        xLabels: [
                            "Название объекта",
                            "Дата создания записи"
                        ],
                        yLabels: [
                            "Число изображений",
                            "Длина описания"
                        ]
                    }
                },
                searchShortestPath: {
                    entity: "Поиск кратчайшего пути между точками (В разработке)",
                    params: [
                        {
                            label: "Исходная и конечная точки",
                            fields: [
                                {
                                    type: "button",
                                    text: "Добавить исходную точку",
                                    value: null
                                },
                                {
                                    type: "button",
                                    text: "Добавить конечную точку",
                                    value: null
                                },
                            ]
                        },
                    ],
                    result: {
                        type: "chart",
                        xLabels: [
                            "Название объекта",
                            "Дата создания записи"
                        ],
                        yLabels: [
                            "Число изображений",
                            "Длина описания"
                        ]
                    }
                },
                searchPoint: {
                    entity: "Поиск точки",
                    params: [
                        {
                            label: "Название точки",
                            fields: [
                                {
                                    type: "text",
                                    text: "Введите название места",
                                    value: ""
                                }
                            ]
                        },
                    ],
                    result: {
                        type: "chart",
                        xLabels: [
                            "Название объекта",
                            "Дата создания записи"
                        ],
                        yLabels: [
                            "Число изображений",
                            "Длина описания"
                        ]
                    }
                },
                countRouteLength: {
                    entity: "Расчёт длины маршрута (В разработке)",
                    params: [
                        {
                            label: "Исходная и конечная точки",
                            fields: [
                                {
                                    type: "button",
                                    text: "Добавить исходную точку",
                                    value: null
                                },
                                {
                                    type: "button",
                                    text: "Добавить конечную точку",
                                    value: null
                                },
                            ]
                        },
                    ],
                    result: {
                        type: "chart",
                        xLabels: [
                            "Название объекта",
                            "Дата создания записи"
                        ],
                        yLabels: [
                            "Число изображений",
                            "Длина описания"
                        ]
                    }
                },
                renewRouteLength: {
                    entity: "Обновление длины маршрута (В разработке)",
                    params: [
                        {
                            label: "Исходная и конечная точки",
                            fields: [
                                {
                                    type: "button",
                                    text: "Добавить исходную точку",
                                    value: null
                                },
                                {
                                    type: "button",
                                    text: "Добавить конечную точку",
                                    value: null
                                },
                            ],
                            label: "Новая длина",
                            fields: [
                                {
                                    type: "number",
                                    text: "Указать новую длину (км)",
                                    value: 0
                                },
                            ],
                        },
                    ],
                    result: {
                        type: "chart",
                        xLabels: [
                            "Название объекта",
                            "Дата создания записи"
                        ],
                        yLabels: [
                            "Число изображений",
                            "Длина описания"
                        ]
                    }
                },
                topFastestUsers: {
                    entity: "20 самых быстрых пользователей (Прогулки больше часа) (В разработке)",
                    params: [
                        {
                            label: "Число лучших пользователей",
                            fields: [
                                {
                                    type: "number",
                                    text: "Сколько пользователей войдут в топ",
                                    value: 20
                                },
                            ],
                            label: "Время прогулки",
                            fields: [
                                {
                                    type: "number",
                                    text: "Указать минимальное время прогулки (мин)",
                                    value: 60
                                },
                                {
                                    type: "number",
                                    text: "Указать максимальное время прогулки (мин)",
                                    value: 4000
                                },
                            ],
                        },
                    ],
                    result: {
                        type: "chart",
                        xLabels: [
                            "Дата прогулки",
                            "Пользователь"
                        ],
                        yLabels: [
                            "Среднее время прогулки",
                        ]
                    }
                },

            },
            dataBaseEntities: {},
            chosenEntity: null,
            todayDate: "2001-01-01"
        }; 
    },
    created() {
        this.getEntitiesListFromStructure(this.pageStructure)
        this.setTodayDate()
    },
    computed: {
        filterData() {
            return Object.entries(this.pageStructure).find(elem => elem[1].entity == this.chosenEntity)
        },
    },
    methods: {
        getEntitiesListFromStructure(struct) {
            let entries = Object.entries(struct)
            entries.forEach((item, index) => {
                // console.log(item[1], index, item[0].entity, item[0].params)
                this.dataBaseEntities[item[1].entity] = item[1].params
            })
        },
        handleUpdate(data) {
            this.chosenEntity = data;
        },
        setTodayDate() {
            let cd = new Date()
            // this.todayDate = `${cd.getFullYear()}-${cd.getMonth()}-${cd.getDate()}`
            this.todayDate =  `2020-01-21`
        }
    } 
}
</script>

<style scoped>
.statistic-card-title {
    text-align: center;
    display: block !important;
    box-shadow: 0 4px 4px rgba(0,0,0,0.25);
}

.statistic-card-body {
    border: 20px, solid, red;
    color:red;
}
</style>
