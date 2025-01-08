<template>
    <v-btn
        :label="label"
        color="secondary"
        class="btn font-weight-medium text-primary"
        @click="$emit('click')"
    >
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

<style>
    .btn {
        height: 55px !important;
        border-radius: 20px !important;
        width: 380px !important;
        box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.25), 0 4px 4px 0 rgba(0, 0, 0, 0.25) !important;
        max-width: 100% !important;
        .v-btn__content {
            font-size: 28px !important;
            text-transform: none;
        }
    }
</style>
