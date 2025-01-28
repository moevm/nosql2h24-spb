<template>
    <v-btn :label="label" color="secondary" class="shadow text-h5 text-capitalize text-primary rounded-xl"
        density="default" size="x-large">
        {{ label }}
    </v-btn>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true
        }
    }
}
</script>

<style scoped>
.shadow {
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.25), 0 4px 4px 0 rgba(0, 0, 0, 0.25) !important;
}
</style>
