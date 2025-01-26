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
                        {{ filterData }}
                </v-col>
            </v-row>
            <v-row class="ma-5 headline">
                <v-col>
                    <p>Фильтры</p>
                    <StatisticsFilters 
                        v-model="filterData"
                    />
                </v-col>
            </v-row>
            <!-- <AccordionFeild /> -->
            <!-- <p>Статистика</p> -->
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
                    entity: "Пользователь",
                    params: [
                        {
                            label: "Пройденное расстояния",
                            feilds: [
                                {
                                    type: "number",
                                    text: "Мин. расстояние (км)",
                                    value: 0.1
                                },
                                {
                                    type: "number",
                                    text: "Макс. расстояние (км)",
                                    value: 10
                                },
                            ]
                        },
                        {
                            label: "Пройденное время",
                            feilds: [
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
                            feilds: [
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
                            feilds: [
                                {
                                    type: "date",
                                    text: "С",
                                    value: 0
                                },
                                {
                                    type: "date",
                                    text: "До",
                                    value: new Date()
                                },
                            ]
                        },
                    ]
                },
                route: {
                    entity: "Маршрут",
                    params: [
                        {
                            label: "Длина",
                            feilds: [
                                {
                                    type: "number",
                                    text: "Мин. длина (км)",
                                    value: 0.1
                                },
                                {
                                    type: "number",
                                    text: "Макс. длина (км)",
                                    value: 10
                                },
                            ]
                        },
                        {
                            label: "Длительность",
                            feilds: [
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
                            feilds: [
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
                            feilds: [
                                {
                                    type: "date",
                                    text: "С",
                                    value: 0
                                },
                                {
                                    type: "date",
                                    text: "До",
                                    value: new Date()
                                },
                            ]
                        },
                        {
                            label: "Автор",
                            feilds: [
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
                            feilds: [
                                {
                                    type: "button",
                                    text: "Добавить точек",
                                    value: []
                                },
                            ]
                        },
                    ]
                }
            },
            dataBaseEntities: {},
            chosenEntity: null
        }; 
    },
    created() {
        this.getEntitiesListFromStructure(this.pageStructure)
    },
    computed: {
        filterData() {
            return Object.entries(this.pageStructure).find(elem => elem[1].entity == this.chosenEntity)
        }
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
