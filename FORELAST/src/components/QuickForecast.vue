<template>
    <section class="quick-forecast">
        <div class="search-bar-section">
            <SearchBar 
                @city-selected="addQuickForecast"
                @location-detected="handleLocationDetected"
            />
        </div>
        <hr>
        <div class="quick-forecast-text">
            <h2>Quick Forecasts</h2>
            <div class="current-time">
                <img src="../assets/Home/quick forecast section/time.svg">
                <p>{{ formattedDateTime }}</p>
            </div>
            <p class="quick-forecast-caption">Quickly access weather information for your favorite cities. Tap a card for a more detailed forecast.</p>
        </div>
        <div class="weather-cards">
            <TransitionGroup name="forecast" tag="div" class="weather-cards">
                <WeatherCard 
                    v-for="cityData in quickForecasts"
                    :key="`${cityData.city}-${cityData.timestamp || 0}`"
                    :city="cityData.city"
                    :temperature="cityData.temperature"
                    :weatherIcon="cityData.weatherIcon"
                    :weatherDescription="cityData.weatherDescription"
                    @remove="removeQuickForecast"
                />
            </TransitionGroup>
        </div>
        <Modal :isOpen="modalOpen" @close="closeModal">
            <template #header>
                <h2>Heads up!</h2>
            </template>
            <template #image>
                <img src="@/assets/Home/quick forecast section/alert.svg">
            </template>
            <template #body>
                <p>You can only add a maximum of 5 quick forecast cards.</p>
            </template>
        </Modal>
    </section>
</template>

<script setup>
import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import Modal from '@/components/Modal.vue'
import { useDateTime } from '@/composables/useDateTime.js'
import { ref, onMounted } from 'vue'

const { formattedDateTime } = useDateTime()

// Modal
const quickForecasts = ref([])
const modalOpen = ref(false)
const closeModal = () => {
    modalOpen.value = false
}

// Load saved cities on mount
onMounted(() => {
    const savedCities = localStorage.getItem('quickForecasts')
    if (savedCities) {
        quickForecasts.value = JSON.parse(savedCities)
    }
})

const saveToLocalStorage = () => {
    localStorage.setItem('quickForecasts', JSON.stringify(quickForecasts.value))
}

// Handle manually added cities
const addQuickForecast = (cityData) => {
    // Check if city already exists by name
    const exists = quickForecasts.value.some(item => item.city === cityData.city)
    
    const processedData = {
        city: cityData.city,
        temperature: cityData.temperature !== '--' ? 
            Math.round(Number(cityData.temperature)) : '--',
        weatherIcon: cityData.weatherIcon || '--',
        weatherDescription: cityData.weatherDescription || '--',
        timestamp: Date.now()
    };

    if (!exists) {
        if (quickForecasts.value.length < 5) {
            quickForecasts.value.unshift(processedData) // Add to beginning
            saveToLocalStorage()
        } else {
            modalOpen.value = true
        }
    }
}

// Handle auto-detected location
const handleLocationDetected = (locationData) => {
    const exists = quickForecasts.value.some(item => item.city === locationData.city)
    
    const processedData = {
        city: locationData.city,
        temperature: locationData.temperature !== '--' ? 
            Math.round(Number(locationData.temperature)) : '--',
        weatherIcon: locationData.weatherIcon || '--',
        weatherDescription: locationData.weatherDescription || '--',
        timestamp: Date.now()
    };

    if (!exists) {
        // If we have space, add the location
        if (quickForecasts.value.length < 5) {
            quickForecasts.value.unshift(processedData)
        } else {
            // If full, replace the oldest card (last in array)
            quickForecasts.value.pop()
            quickForecasts.value.unshift(processedData)
        }
        saveToLocalStorage()
    }
}

const removeQuickForecast = (cityToRemove) => {
    quickForecasts.value = quickForecasts.value.filter(cityData => cityData.city !== cityToRemove)
    saveToLocalStorage()
}
</script>

<style scoped lang="scss">
@use '@/styles/_quickforecast-mixin.scss' as quickforecast;
@include quickforecast.quickForecast;
</style>