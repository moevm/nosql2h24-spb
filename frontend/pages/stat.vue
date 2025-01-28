<template>
    <v-container class="d-flex flex-column" style="height: 50vh;">
        <!-- Верхняя часть с управлением -->
        <div class="mb-4">
            <v-select v-model="selectedTable" :items="tables" label="Выберите таблицу" :disabled="loading"
                class="mb-4"></v-select>

            <!-- Панель фильтров -->
            <v-card class="mb-4 pa-4" elevation="2">
                <div class="d-flex gap-4 align-center flex-wrap">
                    <!-- Существующие фильтры -->
                    <v-text-field v-model="filterName" label="Поиск по названию" density="compact" clearable
                        style="max-width: 300px;" hide-details></v-text-field>

                    <v-text-field v-model="filterDescription" label="Поиск по описанию" density="compact" clearable
                        style="max-width: 300px;" hide-details></v-text-field>

                    <!-- Фильтр по дате -->
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" :model-value="dateRange" readonly label="Диапазон дат"
                                density="compact" clearable style="max-width: 300px;" @click:clear="filterDateRange = []" hide-details></v-text-field>
                        </template>
                        <v-date-picker v-model="dateRange" range></v-date-picker>
                    </v-menu>

                    <!-- Фильтр по широте -->
                    <v-text-field v-model="filterLatitude" label="Широта (от)" type="number" density="compact" clearable
                        style="max-width: 150px;" hide-details></v-text-field>

                    <v-text-field v-model="filterLatitudeTo" label="Широта (до)" type="number" density="compact"
                        clearable style="max-width: 150px;" hide-details></v-text-field>

                    <!-- Фильтр по долготе -->
                    <v-text-field v-model="filterLongitude" label="Долгота (от)" type="number" density="compact"
                        clearable style="max-width: 150px;" hide-details></v-text-field>

                    <v-text-field v-model="filterLongitudeTo" label="Долгота (до)" type="number" density="compact"
                        clearable style="max-width: 150px;" hide-details></v-text-field>
                </div>
            </v-card>

            <v-card-actions class="mb-4">
    <v-btn 
      color="primary"
      :loading="loading"
      :disabled="selectedTable !== 'pointsofinterest'"
      @click="applyFilters"
    >
      Применить фильтры
    </v-btn>
  </v-card-actions>

            <!-- Счетчик и статус -->
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

        <!-- Область таблицы -->
        <div class="flex-grow-1" style="min-height: 0;">
            <v-data-table v-if="!loading && !error" :headers="columns" :items="tableData" :items-per-page="10"
                class="elevation-1" fixed-header height="54vh">
                <!-- Кастомный формат для изображений -->
                <template #item.poi_images="{ value }">
                    <div v-if="value.length" class="d-flex align-center gap-2">
                        <template v-for="(img, index) in value.slice(0, maxImages)" :key="index">
                            <a :href="img" target="_blank" class="text-decoration-underline">
                                {{ index + 1 }}
                            </a>
                        </template>
                        <span v-if="value.length > maxImages">
                            ... ({{ value.length }})
                        </span>
                    </div>
                    <span v-else>Нет изображений</span>
                </template>

                <!-- Формат для широты и долготы -->
                <template #item.poi_location.y="{ value }">
                    {{ value.toFixed(4) }}
                </template>

                <template #item.poi_location.x="{ value }">
                    {{ value.toFixed(4) }}
                </template>

                <!-- Формат для описания -->
                <template #item.poi_description="{ value }">
                    <div class="description-cell">
                        {{ truncateDescription(value.join(' ')) }}
                    </div>
                </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const filterDateRange = ref([]);
const filterLatitude = ref(null);
const filterLatitudeTo = ref(null);
const filterLongitude = ref(null);
const filterLongitudeTo = ref(null);
const filterName = ref(null);
const filterDescription = ref(null);


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
const tables = ref(['pointsofinterest', 'othertable1', 'othertable2']);
const selectedTable = ref('pointsofinterest');
const tableData = ref([]);
const maxImages = 4;
const columns = ref([
    { title: 'ID', key: 'id' },
    { title: 'Название', key: 'poi_name' },
    { title: 'Описание', key: 'poi_description' },
    { title: 'Изображения', key: 'poi_images' },
    { title: 'Широта', key: 'poi_location.y' },
    { title: 'Долгота', key: 'poi_location.x' },
    { title: 'Дата создания', key: 'poi_created_at' },
]);


const truncateDescription = (text) => {
    const maxLength = 100;
    return text.length > maxLength
        ? text.substring(0, maxLength) + '...'
        : text;
};

const loadData = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response = await $fetch(`${config.public.backendUrl}/api/poi`, {
            method: 'GET'
        });

        tableData.value = response.map(item => ({
            id: item.id.split(':')[2],
            poi_created_at: item.createdAt,
            poi_description: JSON.parse(item.description),
            poi_images: JSON.parse(item.images),
            poi_location: {
                x: item.location.x,
                y: item.location.y
            },
            poi_name: item.name
        }));

    } catch (err) {
        error.value = err.message || 'Неизвестная ошибка';
        console.error('Ошибка загрузки данных:', err);
    } finally {
        loading.value = false;
    }
};

// Загрузка данных при монтировании
loadData();

// Следим за изменением выбранной таблицы
watch(selectedTable, (newVal) => {
    if (newVal === 'pointsofinterest') {
        loadData();
    } else {
        // Логика для других таблиц
        tableData.value = [];
    }
});
const applyFilters = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Формируем query параметры
    const queryParams = {
      name: filterName.value || undefined,
      description: filterDescription.value || undefined,
      fromDate: filterDateRange.value?.[0] ? new Date(filterDateRange.value[0]).toISOString() : undefined,
      toDate: filterDateRange.value?.[1] ? new Date(filterDateRange.value[1]).toISOString() : undefined,
      fromLat: filterLatitude.value || undefined,
      toLat: filterLatitudeTo.value || undefined,
      fromLng: filterLongitude.value || undefined,
      toLng: filterLongitudeTo.value || undefined
    };

    const response = await $fetch(`${config.public.backendUrl}/api/poi/filtr`, {
      method: 'POST',
      body: queryParams
    });

    // Обрабатываем ответ
    tableData.value = response.map(item => ({
      id: item.id.split(':')[2],
      poi_created_at: item.createdAt,
      poi_description: JSON.parse(item.description),
      poi_images: JSON.parse(item.images),
      poi_location: {
        x: item.location.x,
        y: item.location.y
      },
      poi_name: item.name
    }));

  } catch (err) {
    error.value = err.message || 'Ошибка фильтрации';
    console.error('Ошибка фильтрации:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
:deep(.v-data-table__wrapper) {
    overflow-y: auto;
    background: rgba(255, 255, 255, 0.9);
    /* Полупрозрачный фон */
    backdrop-filter: blur(2px);
    /* Размытие для эффекта "матового стекла" */
}

/* Остальные стили остаются без изменений */
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