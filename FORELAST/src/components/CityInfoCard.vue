<!-- components/CityInfoCard.vue -->
<template>
    <div class="city-info-card">
      <div class="current-city">
        <h3>Current City</h3>
        <div class="city-display">
          <span class="city-name">{{ currentCity }}</span>
          <span class="current-temp">{{ currentTemp }}°C</span>
        </div>
      </div>
      
      <div class="top-cities" v-if="topCities.length > 0">
        <h3>Hottest Cities</h3>
        <ul>
          <li v-for="(city, index) in topCities" :key="index">
            <span class="rank">{{ index + 1 }}.</span>
            <span class="name">{{ city.city }}</span>
            <span class="temp">{{ city.temp }}°C</span>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    currentCity: String,
    currentTemp: [String, Number],
    topCities: {
      type: Array,
      default: () => []
    }
  })
  </script>
  
  <style scoped>
  .city-info-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    margin-bottom: 1rem;
  }
  
  .current-city h3, .top-cities h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
  }
  
  .city-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .city-name {
    font-weight: bold;
    font-size: 1.2rem;
  }
  
  .current-temp {
    font-size: 1.5rem;
    font-weight: bold;
    color: #e63946;
  }
  
  .top-cities ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .top-cities li {
    display: flex;
    justify-content: space-between;
    padding: 0.3rem 0;
    border-bottom: 1px solid #eee;
  }
  
  .top-cities li:last-child {
    border-bottom: none;
  }
  
  .rank {
    color: #666;
    width: 20px;
  }
  
  .name {
    flex-grow: 1;
  }
  
  .temp {
    font-weight: bold;
    color: #e63946;
  }
  
  @media (max-width: 768px) {
    .city-info-card {
      margin: 0.5rem 0;
    }
  }
  </style>