<template>
    <v-card variant="flat" max-width="100%" class="shadow w-100 py-5 px-6" color="background">
        <div class="d-flex ga-6">
        <router-link :to="'/routes/' + route.id"><v-avatar size="120" rounded="0" :image="route.points[0].images[0]">
            </v-avatar></router-link>
            <v-sheet class="d-flex flex-column w-100">
                <div class="text-h5"><router-link class="text-decoration-none text-black" :to="'/routes/' + route.id">{{ route.name }}</router-link></div>

                <div class="d-flex ga-3">
                    <v-sheet class="d-flex flex-column flex-1-1-0">
                        Основные точки маршрута:
                        <div class="ml-5 points-container text-caption">
                            <div v-for="point in route.points.slice(0, 5)" :key="point.id">
                                {{ point.name }}
                            </div>
                        </div>
                    </v-sheet>
                    <v-sheet class="d-flex flex-column flex-1-1-0">
                        Характеристики маршрута:
                        <div class="ml-5">
                            <div>Длина: {{ (route.length / 1000).toFixed(1) }} км</div>
                            <div>Длительность: {{ (route.duration / 60).toFixed(0) }} ч {{ (route.duration % 60).toFixed(0) }} мин</div>
                        </div>
                    </v-sheet>
                </div>
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