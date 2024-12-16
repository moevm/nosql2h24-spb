<template>
    <v-btn
        color="accent"
        class="btn"
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
        border-radius: 20px;
        width: 380px;
        box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.25), 0 4px 4px 0 rgba(0, 0, 0, 0.25);
        max-width: 100%;
        .v-btn__content {
            font-size: 20px;
        }
    }
</style>
  
  