<template>
    <row>
        <p>row</p>
    </row>
</template>

<script>
export default { 
    props: {
        filterData: {
            type: Object,
            required: true
        }
    },
    methods: {
        updateFilterData() {
            this.$emit('update:filterData', filterData); // Обновляем значение 
        }
    }
}
</script>