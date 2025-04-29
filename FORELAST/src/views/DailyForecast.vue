<template>
    <div class="daily-forecast">
        <section class="dashboard-header">
            <DashboardHeader 
                :city="currentCity"
                :weatherDescription="currentWeather.weather_condition"
                :temperature="currentWeather.temperature"
                :weatherIcon="currentWeatherIcon"
                @city-selected="handleCitySelected"
            />
        </section>
        <section class="dashboard">
            <Dashboard 
                :weatherDescription="currentWeather.weather_condition"
                :temperature="currentWeather.temperature"
                :humidity="currentWeather.humidity"
                :city="currentCity"
                :forecastData="weeklyForecast"
                :precip="currentWeather.precipitation"
                :windSpeed="currentWeather.windSpeed"
            />
        </section>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import DashboardHeader from '@/components/DashboardHeader.vue';
import Dashboard from '@/components/Dashboard.vue';

const currentCity = ref('Quezon City');
const currentWeather = ref({
    temperature: '--',
    weather_condition: '--',
    humidity: '--',
    last_updated: null,
    weatherIcon: ''
});

const weeklyForecast = ref([]);


// Import weather icons
import sunnyIcon from '@/assets/Weather Dashboard/animated/day.svg';
import cloudyDay1 from '@/assets/Weather Dashboard/animated/cloudy-day-1.svg';
import cloudyDay3 from '@/assets/Weather Dashboard/animated/cloudy-day-3.svg';
import rainyIcon from '@/assets/Weather Dashboard/animated/rainy-1.svg';

// Compute weather icon based on temperature
const currentWeatherIcon = computed(() => {
    const temp = parseFloat(currentWeather.value.temperature) || 0;
    if (currentWeather.value.weather_condition === 'Rainy') return rainyIcon;
    if (temp > 30) return sunnyIcon;
    if (temp > 25) return cloudyDay1;
    return cloudyDay3;
});

// Fetch current weather data
const fetchCurrentWeather = async (city) => {
    try {
        const normalizedCity = city.toLowerCase().replace(' ', '_').replace('ñ', 'n');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internal/current/${normalizedCity}/`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        currentWeather.value = {
            temperature: data.temperature || '--',
            weather_condition: data.weather_condition || '--',
            humidity: data.humidity || '--',
            last_updated: data.last_updated || new Date().toISOString(),
            precipitation: data.precip || '--',
            windSpeed: data.windspeed || '--',
        };
        console.log('Current weather data:', currentWeather.value);
    } catch (error) {
        console.error('Error fetching current weather:', error);
        currentWeather.value = {
            temperature: '--',
            weather_condition: '--',
            humidity: '--',
            last_updated: null
        };
    }
};

// Fetch weekly forecast data
const fetchWeeklyForecast = async (city) => {
    try {
        const normalizedCity = city.toLowerCase().replace(' ', '_').replace('ñ', 'n');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internal/analytics/${normalizedCity}/`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        weeklyForecast.value = processForecastData(data.forecast);
    } catch (error) {
        console.error('Error fetching weekly forecast:', error);
        weeklyForecast.value = [];
    }
};

// Process forecast data for weekly display
const processForecastData = (forecastData) => {
    if (!forecastData || !forecastData.dates) return [];
    
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const today = new Date().getDay();
    
    return days.map((day, index) => {
        const dayIndex = (today + index) % 7;
        const forecastIndex = index < forecastData.dates.length ? index : forecastData.dates.length - 1;
        
        return {
            id: index + 1,
            name: day,
            temperature: forecastData.temp?.[forecastIndex] || '--',
            weather_condition: getWeatherCondition(
                forecastData.temp?.[forecastIndex],
                forecastData.precip?.[forecastIndex]
            )
        };
    });
};

// Determine weather condition similar to backend logic
const getWeatherCondition = (temp, precip) => {
    temp = parseFloat(temp) || 0;
    precip = parseFloat(precip) || 0;
    
    if (precip > 5) return 'Rainy';
    if (temp > 30) return 'Sunny';
    if (temp > 25) return 'Partly Cloudy';
    return 'Cloudy';
};

// Handle city selection from SearchBar
const handleCitySelected = (selectedCity) => {
    currentCity.value = selectedCity.city; // Extract string from object
    fetchCurrentWeather(selectedCity.city);
    fetchWeeklyForecast(selectedCity.city);
};

// Initial load
onMounted(() => {
    fetchCurrentWeather(currentCity.value);
    fetchWeeklyForecast(currentCity.value);
});
</script>

<style scoped lang="scss">
.daily-forecast {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>