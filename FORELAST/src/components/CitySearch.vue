<template>
  <div class="city-search">
    <input 
      type="text" 
      v-model="searchQuery" 
      placeholder="Search for a city..."
      @input="onSearch"
    />
    <ul class="suggestions" v-if="filteredCities.length">
      <li 
        v-for="city in filteredCities" 
        :key="city"
        @click="selectCity(city)"
      >
        {{ city }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const filteredCities = ref([])
const emit = defineEmits(['city-selected'])

const cities = [
  'Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig',
  'Mandaluyong', 'San Juan', 'Caloocan', 'Valenzuela',
  'Malabon', 'Navotas', 'Parañaque', 'Las Piñas',
  'Muntinlupa', 'Marikina', 'Pasay'
]

const onSearch = () => {
  if (searchQuery.value.length > 1) {
    filteredCities.value = cities.filter(city =>
      city.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  } else {
    filteredCities.value = []
  }
}

const selectCity = (city) => {
  searchQuery.value = city
  filteredCities.value = []
  emit('city-selected', city)
}
</script>

<style scoped lang="scss">
.city-search {
  position: relative;
  
  input {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 250px;
  }
  
  .suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    list-style: none;
    padding: 0;
    margin: 0;
    z-index: 100;
    
    li {
      padding: 0.5rem 1rem;
      cursor: pointer;
      
      &:hover {
        background: #f0f0f0;
      }
    }
  }
}
</style>
[file content end]