<template>
    <v-container class="d-flex flex-column" style="height: 50vh;">
        <div class="mb-4">
            <v-card class="mb-4 pa-4" elevation="2">
                <div class="d-flex gap-4 align-center flex-wrap">

                    <v-text-field v-model="filterName" label="Поиск по имени" density="compact" clearable
                        style="max-width: 300px;" hide-details></v-text-field>

                    <v-text-field v-model="filterEmail" label="Поиск по почте" density="compact" clearable
                        style="max-width: 300px;" hide-details></v-text-field>

                    <v-menu :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                            <v-text-field v-bind="props" :model-value="dateRange" readonly label="Диапазон дат"
                                density="compact" clearable style="max-width: 300px;"
                                @click:clear="filterDateRange = []" hide-details></v-text-field>
                        </template>
                        <v-date-picker v-model="dateRange" range></v-date-picker>
                    </v-menu>
                </div>
            </v-card>

            <v-card-actions class="mb-4">
                <v-btn color="primary" :loading="loading" @click="applyFilters">
                    Применить фильтры
                </v-btn>
            </v-card-actions>


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
            <v-data-table v-if="!loading && !error" :headers="columns" :items="tableData" :items-per-page="10"
                class="elevation-1" fixed-header height="54vh">

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

                <template #item.poi_location.y="{ value }">
                    {{ value.toFixed(4) }}
                </template>

                <template #item.poi_location.x="{ value }">
                    {{ value.toFixed(4) }}
                </template>

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
const filterName = ref('');
const filterEmail = ref('');


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
const columns = ref([
    { title: 'ID', key: 'id' },
    { title: 'Имя', key: 'name' },
    { title: 'Почта', key: 'email' },
    { title: 'Дата создания', key: 'created_at' },
]);

const loadData = async () => {
    try {
        loading.value = true;
        error.value = null;

        const response = await $fetch(`${config.public.backendUrl}/api/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });

        tableData.value = response.map(item => ({
            id: item.id.split(':')[2],
            name: item.name,
            email: item.email,
            created_at: item.createdAt
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
            email: filterEmail.value || undefined,
            fromDate: filterDateRange.value?.[0] ? new Date(filterDateRange.value[0]).toISOString() : undefined,
            toDate: filterDateRange.value?.[1] ? new Date(filterDateRange.value[1]).toISOString() : undefined
        };
        const response = await $fetch(`${config.public.backendUrl}/api/users/filtr`, {
            method: 'POST',
            body: queryParams,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        });
        tableData.value = response.map(item => ({
            id: item.id.split(':')[2],
            name: item.name,
            email: item.email,
            created_at: item.createdAt
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