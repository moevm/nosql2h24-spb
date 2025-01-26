<template>
    <v-card variant="flat" max-width="100%" class="shadow w-100 py-5 px-6" color="background">
        <div class="d-flex ga-6">
            <v-avatar size="120" rounded="0" :image="route.main_photo">
            </v-avatar>
            <v-sheet class="d-flex flex-column w-100" color="secondary">
                <div class="text-h5">{{ route.name }}</div>

                <div class="d-flex ga-3">
                    <v-sheet class="d-flex flex-column flex-1-1-0" color="accent">
                        Основные точки маршрута:
                        <div class="ml-5 points-container text-caption">
                            <div v-for="point in route.points_name" :key="point.id">
                                {{ point }}
                            </div>
                        </div>
                    </v-sheet>
                    <v-sheet class="d-flex flex-column flex-1-1-0 justify-center" color="error">
                        Характеристики маршрута:
                        <div class="ml-5">
                            <div>Длина: {{ route.length }}</div>
                            <div>Длительность: {{ route.duration }}</div>
                        </div>
                    </v-sheet>
                </div>


                <!-- <div class="d-flex ga-3">
                    <v-sheet class="d-flex flex-column flex-1-1-0" color="accent">
                        <div class="font-weight-bold">Основные точки маршрута:</div>
                        <div class="ml-5 points-container">
                            <div v-for="point in route.points_name" :key="point.id">
                                {{ point }}
                            </div>
                        </div>
                    </v-sheet>
                    <v-sheet class="d-flex flex-column flex-1-1-0 justify-center" color="secondary">
                        <div class="ml-5">
                            <div>Длина: {{ route.length }}</div>
                            <div>Длительность: {{ route.duration }}</div>
                        </div>
                    </v-sheet>
                </div> -->
            </v-sheet>
        </div>
    </v-card>
</template>

<script>
export default {
    props: {
        route: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            choosed: false
        }
    }
}
</script>
<style scoped>
.shadow {
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25) !important;
}

/* .points-container {
    max-height: 3em;
    overflow-y: auto;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
} */
</style>