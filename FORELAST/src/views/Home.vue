<template>
    <section class = "quick-forecast">
        <div class = "search-bar-section">
            <SearchBar @city-selected = "addQuickForecast"/>
        </div>
        <div class = "quick-forecast-text">
            <h2>Quick Forecasts</h2>
            <div class = "current-time">
                <img src = "../assets/Home/quick forecast section/time.svg">
                <p>{{ formattedDateTime }} </p>
            </div>
            <p class = "quick-forecast-caption">Quickly access weather information for your favorite cities. Tap a card for a more detailed forecast.</p>
        </div>
        <div class = "weather-cards">
            <TransitionGroup name = "forecast" tag="div" class="weather-cards">
                <WeatherCard 
                v-for="cityData in quickForecasts"
                :key="`${cityData.city}-${Date.now()}`"
                :city="cityData.city"
                :temperature="cityData.temperature"
                :weatherIcon="cityData.weatherIcon"
                :weatherDescription="cityData.weatherDescription"
                @remove="removeQuickForecast"
            />
            </TransitionGroup>
        </div>
        <Modal :isOpen = "modalOpen" @close = "closeModal">
            <template #header>
                <h2>Heads up!</h2>
            </template>
            <template #image>
                <img src = "@/assets/Home/quick forecast section/alert.svg">
            </template>
            <template #body>
                <p>You can only add a maximum of 5 quick forecast cards.</p>
            </template>
            <template #footer>
                <p></p>
            </template>
        </Modal>
        <div class = "about-forelast">
            <div class = "what-is-forelast">
                <h3>About FORELAST</h3>
                <p>
                FORELAST is a system which is designed to provide a prediction for the current and 
                following days in a week using API and LSTM (Long Short-Term Memory), a type of Recurrent 
                Neural Network commonly used with Time Series Data, by gathering, normalizing, and preprocessing 
                the previous weather data to create future predictions.
                </p>
            </div>
            <div class = "features">
                <h3>Features</h3>
                <div class = "list">
                    <figure>
                        <img src = "../assets/Home/about forelast section/features-lstm.svg">
                        <figcaption>Employs LSTM</figcaption>
                    </figure>
                    <figure>
                        <img src = "../assets/Home/about forelast section/features-chatbot.svg">
                        <figcaption>Zephyr AI</figcaption>
                    </figure>
                    <figure>
                        <img src = "../assets/Home/about forelast section/features-analytics.svg">
                        <figcaption>Predictive Analytics</figcaption>
                    </figure>
                </div>
            </div>
        </div>
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

// Adding and Removing of Quick Forecasts Script
onMounted(() => {
    const savedCities = localStorage.getItem('quickForecasts')
    if (savedCities) {
        quickForecasts.value = JSON.parse(savedCities)
    }
})

const saveToLocalStorage = () => {
    localStorage.setItem('quickForecasts', JSON.stringify(quickForecasts.value))
}

const addQuickForecast = (cityData) => {
    // Check if city already exists by name
    console.log("BEFORE STORING:", cityData);
    const exists = quickForecasts.value.some(item => item.city === cityData.city)
    
    const processedData = {
        city: cityData.city,
        temperature: cityData.temperature !== '--' ? 
            Math.round(Number(cityData.temperature)) : '--',
        weatherIcon: cityData.weatherIcon || '--',
        weatherDescription: cityData.weatherDescription || '--'
    };
    
    console.log("AFTER STORING:", processedData);

    if (!exists && quickForecasts.value.length < 5) {
        quickForecasts.value.push(processedData)
        saveToLocalStorage()
    } else if (quickForecasts.value.length >= 5) {
        modalOpen.value = true
    }
}

const removeQuickForecast = (cityToRemove) => {
    quickForecasts.value = quickForecasts.value.filter(cityData => cityData.city !== cityToRemove)
    saveToLocalStorage()
}
</script>

<style scoped lang = "scss">
@use '@/styles/_quickforecast-mixin.scss' as quickforecast;
@include quickforecast.quickForecast;
</style>
