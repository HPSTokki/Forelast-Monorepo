<template>
    <div class="line-chart">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import Chart from 'chart.js/auto'
  
  const props = defineProps({
    labels: Array,
    data: Array,
    backgroundColor: String,
    borderColor: String
  })
  
  const chartCanvas = ref(null)
  let chartInstance = null
  
  const renderChart = () => {
    if (chartInstance) {
      chartInstance.destroy()
    }
    
    if (chartCanvas.value && props.labels && props.data) {
      chartInstance = new Chart(chartCanvas.value, {
        type: 'line',
        data: {
          labels: props.labels,
          datasets: [{
            label: '',
            data: props.data,
            backgroundColor: props.backgroundColor,
            borderColor: props.borderColor,
            borderWidth: 2,
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      })
    }
  }
  
  onMounted(renderChart)
  watch(() => [props.labels, props.data], renderChart)
  </script>
  
  <style scoped>
  .line-chart {
    position: relative;
    height: 250px;
    width: 100%;
  }
  </style>