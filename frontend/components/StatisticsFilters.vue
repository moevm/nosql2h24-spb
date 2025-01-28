<template>
        <v-row cols="12" justify="center" class="ml-5 mr-5 title">
            <v-col 
                md="4" 
                v-for="block in parsedFilterData" :key="block.label"
            >
                {{ block.label }}
                <div
                    v-for="field in block.fields" :key="field.text"
                    class="body-1"
                >
                    <div v-if="field.type == 'number'">
                        {{ field.text }}
                        <TextField
                            v-model="field.value"
                            type="number"
                        />
                    </div>
                    <div v-else-if="field.type == 'decimal'">
                        {{ field.text }}
                        <TextField
                            step="0.1"
                            v-model="field.value"
                            type="number"
                        />
                    </div>
                    <div v-else-if="field.type == 'date'">
                        <TextField class="data-feild"
                            :label="field.text"
                            v-model="field.value"
                            type="date"
                        />
                    </div>
                </div>
            </v-col>
        </v-row>
</template>

<script>
export default {
    props: ['filterData'], 
    // data() {
    //     return {
    //         filterData: null
    //     }
    // },
    // created() {},
    computed: {
        parsedFilterData() {
            if(this.filterData) {
                return Object.entries(this.filterData[1])[1][1]
            } else {
                return []
            }
        }
    },
    methods: {
        updateFilterData() {
            if (this.validateData()) {
                this.$emit('update:filterData', filterData); // Обновляем значение 
            }
        },
        validateData() {
            let obj = this.parsedFilterData()
            obj.forEach((blockOfFields) => {
                blockOfFields.fields.forEach((field) => {
                    if (field.type === "number") {
                        if (field.value < 0) return false
                    } else if (field.type === "decimal") {
                        if (field.value < 0) return false
                    } else if (field.type === "date") {
                        if (!field.value) {
                            let cd = new Date()
                            field.value = `${cd.getFullYear()}-01-01`
                        }
                    }
                })
                if (blockOfFields.rule === "range") {
                    let min = blockOfFields.fields[0].value
                    let max = blockOfFields.fields[1].value
                    if (min > max) return false
                }
            })
            return true
        },
    }
}
</script>

<!-- <style>
    .text-field {
        border-radius: 20px;
        width: 380px;
        box-shadow: none;
        box-shadow: none;
        /* padding: 0 0; */
        background-color: transparent;
    }
    .text-field .v-label {
        color: #DEDEDF;
        font-size: 20px;
    }
    .text-field .v-input__slot {
        height: 55px;
        background: red !important;
        /* box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25) !important; */
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25), inset 0 2px 4px 0 rgba(0, 0, 0, 0.25) !important;
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
</style> -->