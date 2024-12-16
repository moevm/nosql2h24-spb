<template>
    <v-btn class="icon-btn">
        <!-- <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg> -->
        <svg class="icon" width="48" height="48" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 42V38C40 35.8783 39.1571 33.8434 37.6569 32.3431C36.1566 30.8429 34.1217 30 32 30H16C13.8783 30 11.8434 30.8429 10.3431 32.3431C8.84285 33.8434 8 35.8783 8 38V42M32 14C32 18.4183 28.4183 22 24 22C19.5817 22 16 18.4183 16 14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14Z" stroke="#B65B5B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </v-btn>
</template>
  
<script>
    export default {
        name: 'IconButton',
    };
</script>
  
<style scoped>
    .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 10px;
        transition: all 0.3s ease;
    }
    
    .icon {
        width: 24px;
        height: 24px;
        transition: all 0.3s ease;
        fill: currentColor; /* Используем текущий цвет текста для заполнения */
    }
    
    .icon-btn:hover .icon {
        stroke: currentColor; /* Подсветка контура при наведении */
        fill: transparent; /* Убираем заполнение при наведении */
        stroke-width: 2; /* Толщина контура */
    }
</style>
  