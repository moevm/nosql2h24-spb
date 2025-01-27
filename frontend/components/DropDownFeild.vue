<template> 
    <div class="dropdown"> 
      <button class="dropdown-toggle" @click="toggleDropdown"> 
        {{ this.selectedItem }}
      </button> 
      <div class="dropdown-menu" v-if="isOpen"> 
        <div 
          class="dropdown-item" 
          v-for="(item, index) in items" 
          :key="index" 
          @click="selectItem(item)" 
        > 
          {{ item }} 
        </div> 
      </div> 
    </div> 
  </template> 
   
  <script> 
  export default { 
    props: {
        items: {
            type: Array,
            default: ['Элемент 1', 'Элемент 2', 'Элемент 3'],
        }
    },
    data() { 
      return { 
        isOpen: false, 
        selectedItem: null, 
        // items: this.items, 
      }; 
    }, 
    created() {
        this.setDefaultSelectedItem()
    },
    methods: { 
        updateValue(item) { 
            // console.log(this.selectedItem)
            this.$emit('update:data', item); // Обновляем значение 
        },
        setDefaultSelectedItem() {
            if (this.selectedItem) {
                this.selectedItem = this.selectedItem
            } else if (this.items.length) {
                this.selectedItem = this.items[0]
                // this.selectedItem = this.selectedItem
            } else {
                this.selectedItem = "Error. No items founded in DropDownFeild"
            }
            this.updateValue(this.selectedItem)
        },
      toggleDropdown() { 
        this.isOpen = !this.isOpen; 
      }, 
      selectItem(item) { 
        this.selectedItem = item; 
        this.isOpen = false; // Закрыть меню после выбора 
        this.updateValue(item);
      }, 
    }, 
  }; 
  </script> 
   
  <style> 
  .dropdown { 
    width: 100%;
    position: relative; 
    display: inline-block; 
  } 
   
  .dropdown-toggle { 
    width: 100%;
    padding: 10px; 
    /* background-color: #007bff;  */
    /* color: white;  */
    /* border: none;  */ 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    cursor: pointer; 
  } 
   
  .dropdown-menu { 
    width: 100%;
    position: absolute; 
    background-color: white; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    margin-top: 5px; 
    z-index: 1; 
  } 
   
  .dropdown-item { 
    padding: 8px 12px; 
    cursor: pointer; 
  } 
   
  .dropdown-item:hover { 
    background-color: #f1f1f1; 
  } 
  </style>