<template>
    <v-card variant="flat" max-width="100%" class="shadow" color="primary" @click="isChoosed">
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

<script setup>
const props = defineProps({ point: { type: Object, required: true }, updateFunction: { type: Function, required: true } , poiChoosed: { type: Array, required: true }});
props.point.selected = false;
const choosed = ref(false)
watch(choosed, () => { props.point.selected = choosed })

const isChoosed = computed({
  get: () => props.poiChoosed.includes(props.point.id),
  set: (value) => {
    if (value && !props.poiChoosed.includes(props.point.id)) {
      props.poiChoosed.push(props.point.id)
      props.updateFunction()
    } else if (!value && props.poiChoosed.includes(props.point.id)) {
      props.poiChoosed.splice(props.poiChoosed.indexOf(props.point.id), 1)
      props.updateFunction()
    }
  }
})
</script>

<style scoped>
.shadow {
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25) !important;
}
</style>