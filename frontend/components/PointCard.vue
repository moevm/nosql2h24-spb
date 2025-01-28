<template>
    <v-card variant="flat" max-width="100%" class="shadow" color="primary" @click="choosed = !choosed">
        <div class="d-flex">
            <v-avatar class="ma-3" size="90" rounded="0" :image="point.main_photo">
            </v-avatar>
            <v-card-text width="100" class="overflow-hidden pa-0 my-3" style="max-width: 214px;">
                {{ point.name }}
            </v-card-text>
            <div>
                <v-checkbox v-model="choosed" color="accent" hide-details></v-checkbox>
            </div>
        </div>
    </v-card>
</template>

<script setup>
const props = defineProps({ point: { type: Object, required: true } });
props.point.selected = false;
const choosed = ref(false)
watch(choosed, () => { props.point.selected = choosed })
</script>

<style scoped>
.shadow {
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25) !important;
}
</style>