[file name]: WeatherChart.vue
[file content begin]
<template>
  <div class="weather-chart">
    <h2>{{ title }}</h2>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  title: String,
  chartData: Object
})

const chartCanvas = ref(null)
let chartInstance = null

const renderChart = () => {
  if (!props.chartData || !chartCanvas.value) return
  
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: props.chartData.labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: props.chartData.temp,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: 'Humidity (%)',
          data: props.chartData.humidity,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3,
          yAxisID: 'y1'
        },
        {
          label: 'Precipitation (mm)',
          data: props.chartData.precip,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3,
          yAxisID: 'y2'
        },
        {
          label: 'Wind Speed (km/h)',
          data: props.chartData.windspeed,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.3,
          yAxisID: 'y3'
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'Temperature (°C)' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Humidity (%)' }
        },
        y2: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Precipitation (mm)' }
        },
        y3: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Wind Speed (km/h)' }
        }
      }
    }
  })
}

onMounted(renderChart)
watch(() => props.chartData, renderChart, { deep: true })
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as vars;
.weather-chart {
  font-family: vars.$primary-font;
  height: 100%;
  width: 100%;
  
  canvas {
    width: 100% !important;
    background-color: vars.$panel-color;
    border-radius: $border-radius;
  }
}

// Mobile-Specific Styles 
@media (max-width: 768px) {
  .weather-chart {
    canvas {
      height: 100px;
    }
  }
}

// Larger Screens
@media (min-width: 769px) {
  .weather-chart {
    canvas {
      object-fit: contain;
      height: 350px !important;
    }
  }
}
</style>
[file content end]