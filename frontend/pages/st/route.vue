<template>
    <v-container class="d-flex flex-column" style="height: 50vh;">
        <div class="mb-4">
            <v-card class="mb-4 pa-4" elevation="2">
                <div class="d-flex gap-4 align-center flex-wrap">

                    <v-text-field v-model="filterName" label="Поиск по названию" density="compact" clearable
                        style="max-width: 300px;" hide-details></v-text-field>

                    <v-text-field v-model="filterDescription" label="Поиск по описанию" density="compact" clearable
                        style="max-width: 300px;" hide-details></v-text-field>
                    <v-menu :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" :model-value="dateRange" readonly label="Диапазон дат"
                                density="compact" clearable style="max-width: 300px;"
                                @click:clear="filterDateRange = []" hide-details></v-text-field>
                        </template>
                        <v-date-picker v-model="dateRange" range></v-date-picker>
                    </v-menu>

                    <v-text-field v-model="filterDuration" label="Дителность (от)" type="number" density="compact"
                        clearable style="max-width: 150px;" hide-details></v-text-field>

                    <v-text-field v-model="filterDurationTo" label="Длительность (до)" type="number" density="compact"
                        clearable style="max-width: 150px;" hide-details></v-text-field>

                    <v-text-field v-model="filterLength" label="Длина (от)" type="number" density="compact" clearable
                        style="max-width: 150px;" hide-details></v-text-field>

                    <v-text-field v-model="filterLengthTo" label="Длина (до)" type="number" density="compact" clearable
                        style="max-width: 150px;" hide-details></v-text-field>


                    <v-text-field v-model="filterAuthor" label="Поиск по автару" density="compact" clearable
                        style="max-width: 300px;" hide-details></v-text-field>
                </div>
            </v-card>

            <v-col cols="12" md="3" class="d-flex align-center gap">
                <v-btn color="primary" @click="applyFilters">
                    Применить фильтры
                </v-btn>

                <v-btn color="secondary" @click="showPointsFilterDialog = true; searchPoi()">
                    Фильтр по точкам
                </v-btn>
            </v-col>
            <div class="d-flex align-center gap-4 mb-4">
                <v-chip color="primary" variant="outlined">
                    Найдено элементов: {{ tableData.length }}
                </v-chip>

                <v-alert v-if="error" type="error" dense class="ma-0">
                    Ошибка: {{ error }}
                </v-alert>

                <v-progress-linear v-if="loading" indeterminate color="primary" class="ma-0"></v-progress-linear>
            </div>
        </div>

        <div class="flex-grow-1" style="min-height: 0;">
            <v-data-table @click:row="handleRowClick" v-if="!loading && !error" :headers="columns" :items="tableData" :items-per-page="10"
                class="elevation-1" fixed-header height="54vh">

                <template #item.poi_description="{ value }">
                    <div class="description-cell">
                        {{ truncateDescription(value.join(' ')) }}
                    </div>
                </template>
            </v-data-table>
        </div>

        <v-dialog v-model="showPointsFilterDialog" max-width="600" height="70vh" scrollable>
            <v-card class="d-flex flex-column" style="height: 70vh;">
                <v-card-title class="d-flex justify-space-between align-center py-3">
                    <span>Фильтр по точкам</span>
                    <v-btn icon @click="showPointsFilterDialog = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <div class="px-4 pt-2">
                    <SearchField label="" @input="searchPoi" v-model="searchPoiValue"></SearchField>
                </div>

                <v-card-text class="pa-0 flex-grow-1 d-flex flex-column">
                    <div class="d-flex flex-column h-100 overflow-hidden">
                        <v-container class="flex-grow-1 pa-0 overflow-y-auto">
                            <v-row class="px-3 overflow-hidden w-100" style="min-height: min-content;" justify="center">
                                <v-col cols="12" md="8" class="py-0">
                                    <div class="d-flex flex-column align-center">
                                        <PointCardd v-for="item in poiData" :key="item.id" :point="item"
                                            :poiChoosed="poiChoosed" class="mb-4 handle w-100" />
                                    </div>
                                </v-col>
                            </v-row>
                        </v-container>
                    </div>
                </v-card-text>

                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn @click="showPointsFilterDialog = false">
                        Закрыть
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const filterDateRange = ref([]);
const filterDuration = ref(null);
const filterDurationTo = ref(null);
const filterLength = ref(null);
const filterLengthTo = ref(null);
const filterName = ref(null);
const filterDescription = ref(null);
const filterAuthor = ref(null);
const showPointsFilterDialog = ref(false)



const dateRange = computed({
    get() {
        return filterDateRange.value
    },
    set(newDate) {
        const currentDates = [...filterDateRange.value]
        const newTimestamp = new Date(newDate).getTime()
        if (!currentDates.length) {
            filterDateRange.value = [newDate]
            return filterDateRange.value
        }
        if (currentDates[0] === newDate) {
            filterDateRange.value.splice(0, 1)
            return filterDateRange.value
        }
        if (currentDates.length < 2) {
            filterDateRange.value = [...currentDates, newDate].sort()
            return filterDateRange.value
        }
        if (currentDates[1] === newDate) {
            filterDateRange.value.splice(1, 1)
            return filterDateRange.value
        }
        const [start, end] = currentDates.map(d => new Date(d).getTime())
        const diffToStart = Math.abs(newTimestamp - start)
        const diffToEnd = Math.abs(newTimestamp - end)
        const newDates = diffToStart < diffToEnd
            ? [newDate, currentDates[1]]
            : [currentDates[0], newDate]

        filterDateRange.value = newDates.sort((a, b) =>
            new Date(a) - new Date(b))

        return filterDateRange.value
    }
})

const config = useRuntimeConfig();
const loading = ref(false);
const error = ref(null);
const tableData = ref([]);
const poiData = ref([]);
const searchPoiValue = ref('')
const columns = ref([
    { title: 'ID', key: 'id' },
    { title: 'Название', key: 'route_name' },
    { title: 'Описание', key: 'route_description' },
    { title: 'Дата создания', key: 'route_created_at' },
    { title: 'Длительность', key: 'route_duration' },
    { title: 'Длина', key: 'route_length' },
    { title: 'Автор', key: 'route_author.name' },
    { title: 'Кол. точек', key: 'route_count' },

]);

const handleRowClick = (event, { item }) => {
  navigateTo(`/map#${item.longid}`);
};

const truncateDescription = (text) => {
    const maxLength = 100;
    return text.length > maxLength
        ? text.substring(0, maxLength) + '...'
        : text;
};

const poiChoosed = ref([])

const searchPoi = async () => {
    try {
        error.value = null;

        const queryParams = {
            name: searchPoiValue.value || undefined,
            description: searchPoiValue.value || undefined,
            fromDate: undefined,
            toDate: undefined,
            fromLat: undefined,
            toLat: undefined,
            fromLng: undefined,
            toLng: undefined
        };

        const response = await $fetch(`${config.public.backendUrl}/api/poi/filtr`, {
            method: 'POST',
            body: queryParams
        });

        poiData.value = response.map(poi => {
            poi.images = JSON.parse(poi.images)
            poi.choosed = false
            return poi
        })

    } catch (err) {
        error.value = err.message || 'Ошибка фильтрации';
        console.error('Ошибка фильтрации:', err);
    }
}

const loadData = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response = await $fetch(`${config.public.backendUrl}/api/routes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        tableData.value = response.map(item => ({
            id: item.id.split(':')[2],
            longid: item.id,
            route_created_at: item.createdAt,
            route_description: item.description,
            route_duration: ~~item.duration,
            route_length: ~~item.length,
            route_name: item.name,
            route_points: item.points,
            route_count: item.points.length,
            route_author: item.author
        }));

    } catch (err) {
        error.value = err.message || 'Неизвестная ошибка';
        console.error('Ошибка загрузки данных:', err);

        if (err.response?.status === 401) {
            localStorage.removeItem('access_token');
            navigateTo('/signin');
        }
    } finally {
        loading.value = false;
    }
};
loadData();

const applyFilters = async () => {
    try {
        loading.value = true;
        error.value = null;
        const queryParams = {
            name: filterName.value || undefined,
            description: filterDescription.value || undefined,
            fromDate: filterDateRange.value?.[0] ? new Date(filterDateRange.value[0]).toISOString() : undefined,
            toDate: filterDateRange.value?.[1] ? new Date(filterDateRange.value[1]).toISOString() : undefined,
            fromDuration: filterDuration.value || undefined,
            toDuration: filterDurationTo.value || undefined,
            fromLength: filterLength.value || undefined,
            toLength: filterLengthTo.value || undefined,
            author: filterAuthor.value || undefined,
            points: poiChoosed.value || undefined
        };

        const response = await $fetch(`${config.public.backendUrl}/api/routes/filtr`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: queryParams
        });
        tableData.value = response.map(item => ({
            id: item.id.split(':')[2],
            longid: item.id,
            route_created_at: item.createdAt,
            route_description: item.description,
            route_duration: ~~item.duration,
            route_length: ~~item.length,
            route_name: item.name,
            route_points: item.points,
            route_count: item.points.length,
            route_author: item.author
        }));

    } catch (err) {
        error.value = err.message || 'Ошибка фильтрации';
        console.error('Ошибка фильтрации:', err);

        if (err.response?.status === 401) {
            localStorage.removeItem('access_token');
            navigateTo('/signin');
        }
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
:deep(.v-data-table__wrapper) {
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(2px);
}

.description-cell {
    max-width: 300px;
    white-space: normal;
    word-break: break-word;
}

.gap-2 {
    gap: 8px;
}

.text-decoration-underline {
    text-decoration: underline;
    color: primary;
    cursor: pointer;
}
</style>