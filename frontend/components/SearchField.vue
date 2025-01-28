<template>
    <v-text-field :label="label" :type="type" v-model="inputValue" @input="$emit('input', $event)" variant="solo"
        density="compact" prepend-inner-icon="mdi-magnify" bg-color="primary" class="shadow">
    </v-text-field>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'text'
        },
        value: {
            type: String,
            default: ''
        },
        messages: {
            type: String,
            default: ''
        }
    },
    computed: {
        inputValue: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    }
}
</script>
<style>
.shadow .v-field {
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25), inset 0 2px 4px 0 rgba(0, 0, 0, 0.25);
}
</style>