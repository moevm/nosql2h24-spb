<template>
    <v-btn
        color="#9FADBF"
        class="btn"
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
        /* color: #9FADBF !important; */
        height: 55px !important;
        border-radius: 20px !important;
        width: 380px !important;
        box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.25), 0 4px 4px 0 rgba(0, 0, 0, 0.25) !important;
        max-width: 100% !important;
        .v-btn__content {
            font-size: 20px !important;
        }
    }
</style>
  
  