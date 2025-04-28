
<template>
  <div class="weather-metric" :class="trend">
    <h3>{{ title }}</h3>
    <div class="value">
      {{ value }}<span class="unit">{{ unit }}</span>
    </div>
    <div class="trend-indicator">
      <span v-if="trend === 'up'">↑</span>
      <span v-else-if="trend === 'down'">↓</span>
      <span v-else>→</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  unit: String,
  trend: {
    type: String,
    validator: (value) => ['up', 'down', 'steady'].includes(value),
    default: 'steady'
  }
})
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as vars;
.weather-metric {
  background: white;
  border-radius: 8px;
  font-family: vars.$primary-font;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
  }
  
  .value {
    color: vars.$font-color;
    font-size: 1.5rem;
    font-weight: bold;
    
    .unit {
      font-size: 1rem;
      margin-left: 0.25rem;
      opacity: 0.7;
    }
  }
  
  .trend-indicator {
    margin-top: 0.5rem;
    font-size: 1.2rem;
  }
  
  &.up {
    border-left: 4px solid #4CAF50;
    .trend-indicator { color: #4CAF50; }
  }
  
  &.down {
    border-left: 4px solid #F44336;
    .trend-indicator { color: #F44336; }
  }
  
  &.steady {
    border-left: 4px solid #FFC107;
    .trend-indicator { color: #FFC107; }
  }
}
</style>