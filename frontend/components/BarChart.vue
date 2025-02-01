<template>
  <Barc :data="data" :options="options" />
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar as Barc } from 'vue-chartjs';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: 'BarChar',
  components: {
    Barc,
  },
  props: {
    data: {
      type: Object
    }
  },
  // data() {
  //   return {
  //     data: {
  //       labels: [
  //         'January',
  //         'February',
  //         'March',
  //         'April',
  //         'May',
  //         'June',
  //         'July',
  //         'August',
  //         'September',
  //         'October',
  //         'November',
  //         'December',
  //       ],
  //       datasets: [
  //         {
  //           label: 'Data One',
  //           backgroundColor: '#f87979',
  //           data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
  //         },
  //       ],
  //     },
  //   };
  // },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
};
</script>
