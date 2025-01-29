<template>
  <v-sheet v-if="point" variant="flat" max-width="100%" color="background">
    <div class="d-flex align-center">
      <v-avatar class="ma-0" size="72" rounded="0" :image="point.images[0]"></v-avatar>
      <v-card-text class="pa-0 mx-2"
        style="max-width: 116px; overflow-y: auto; overflow-x: hidden; text-overflow: ellipsis; height: 72px;">
        {{ point.name }}
      </v-card-text>
      <v-checkbox v-model="isChoosed" @click="updateFunction" color="accent" hide-details></v-checkbox>
    </div>
  </v-sheet>
</template>
<script>
export default {
  props: {
    point: {
      type: Object,
      required: true
    },
    poiChoosed: {
      type: Array,
      required: true
    },
    updateFunction: {
      type: Function,
      required: true
    }
  },
  computed: {
    isChoosed: {
      get() {
        return this.poiChoosed.includes(this.point.id);
      },
      set(value) {
        if (value && !this.poiChoosed.includes(this.point.id)) {
          this.poiChoosed.push(this.point.id);
          this.updateFunction();
        } else if (!value && this.poiChoosed.includes(this.point.id)) {
          this.poiChoosed.splice(this.poiChoosed.indexOf(this.point.id), 1);
          this.updateFunction();
        }
      }
    }
  }
}
</script>
