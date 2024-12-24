<template>
    <v-text-field
    :label="label"
    :type="type"
    v-model="inputValue"
    @input="$emit('input', $event)"
    class="text-field"
    variant="solo"
    elevation="4"
    :messages="messages"
    >
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
    .text-field {
        border-radius: 20px;
        width: 380px;
        box-shadow: none;
        box-shadow: none;
        /* padding: 0 0; */
        background-color: transparent;
    }
    .text-field .v-field {
        border-radius: 20px;
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25), inset 0 2px 4px 0 rgba(0, 0, 0, 0.25) !important;
        background-color: transparent;
    }
    .text-field .v-label {
        color: #DEDEDF;
        font-size: 20px;
    }
    .text-field .v-input__slot {
        height: 55px;
        /* background: red !important; */
        /* box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25) !important; */
        border-radius: 20px;
    }
    .text-field .v-messages {
        color: #B65B5B; /* Устанавливаем цвет текста в красный */
        font-size: 14px;
        margin-top: 4px;
    }
    .text-field .v-input__control .v-input__slot input {
        font-size: 20px; /* Устанавливаем размер текста в поле ввода */
    }
</style>