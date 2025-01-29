<template>
    <v-card variant="flat" max-width="368" class="shadow" color="primary" @click="isChoosed">
        <div class="d-flex">
            <v-avatar class="ma-3" size="90" rounded="0" :image="point.images[0]">
            </v-avatar>
            <v-card-text width="100" class="overflow-hidden pa-0 my-3" style="max-width: 214px;">
                {{ point.name }}
            </v-card-text>
            <div>
                <v-checkbox v-model="isChoosed" color="accent" hide-details></v-checkbox>
            </div>
        </div>
    </v-card>
</template>

<script>
export default {
    props: {
        point: {
            type: Object,
            required: true
        },
        poiChoosed: {
            type: Array,
            required: true
        }
    },
    computed: {
        isChoosed: {
            get() {
                return this.poiChoosed.includes(this.point.id);
            },
            set(value) {
                if(value && !this.poiChoosed.includes(this.point.id)) {
                    this.poiChoosed.push(this.point.id);
                } else if(!value && this.poiChoosed.includes(this.point.id)) {
                    this.poiChoosed.splice(this.poiChoosed.indexOf(this.point.id), 1);
                }
            }
        }
    }
}
</script>

<style scoped>
.shadow {
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25) !important;
}
</style>