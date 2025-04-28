<template>
    <section class="weekly-forecast">
        <div class="header">
            <h3>WEEKLY FORECAST</h3>
            <div class="toggle-container" @click="toggle">
                <div class="toggle-switch" :class="{ 'active': isCelsius }"></div>
                <span :class="{ 'active-text': !isCelsius }">F</span>
                <span :class="{ 'active-text': isCelsius }">C</span>
            </div>
        </div>
        <div class="body">
            <div v-for="day in weatherData" :key="day.id" class="day">
                <div class="day-name">{{ day.name }}</div>
                <img :src="getWeatherIcon(day.weather_condition, day.temperature)" alt="Weather Icon" class="weather-icon">
                <div class="temperature">
                    {{ isCelsius ? day.temperature : celsiusToFahrenheit(day.temperature) }}
                    {{ isCelsius ? '°C' : '°F' }}
                </div> 
            </div>
        </div>
        <div class="footer">
            <p>Have some comments?
                <router-link to="/feedback">Leave a feedback.</router-link>
            </p>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import sunnyIcon from '@/assets/Weather Dashboard/animated/day.svg';
import cloudyDay1 from '@/assets/Weather Dashboard/animated/cloudy-day-1.svg';
import cloudyDay2 from '@/assets/Weather Dashboard/animated/cloudy-day-2.svg';
import rainyIcon from '@/assets/Weather Dashboard/animated/rainy-1.svg';

const props = defineProps({
    forecastData: {
        type: Array,
        default: () => []
    },
    city: {
        type: String,
        default: 'Quezon City'
    }
});

const isCelsius = ref(true);

const toggle = () => {
    isCelsius.value = !isCelsius.value;
};

const celsiusToFahrenheit = (celsius) => {
    if (celsius === '--') return '--';
    const temp = parseFloat(celsius);
    return Math.round((temp * 9/5) + 32);
};

const getWeatherIcon = (condition, temp) => {
    // If no condition or default value, use temperature
    if (!condition || condition === '--') {
        const tempNum = parseFloat(temp) || 0;
        if (tempNum >= 28) return sunnyIcon;
        if (tempNum >= 24) return cloudyDay1;
        if (tempNum >= 20) return cloudyDay1;
        return cloudyDay2;
    }

    // Convert condition to lowercase for case-insensitive comparison
    const conditionLower = condition.toString().toLowerCase().trim();

    // Exact matches first
    if (conditionLower === 'Sunny' || conditionLower === 'Clear') return sunnyIcon;
    if (conditionLower === 'Partly Cloudy') return cloudyDay1;
    if (conditionLower === 'Cloudy') return cloudyDay2;
    
    // Then partial matches
    if (conditionLower.includes('rain')) return rainyIcon;
    if (conditionLower.includes('shower')) return rainyIcon;
    if (conditionLower.includes('drizzle')) return rainyIcon;
    if (conditionLower.includes('thunder')) return rainyIcon; // or thunderIcon if available
    
    // Default to sunny for any other conditions
    return sunnyIcon;
};

const weatherData = computed(() => {
    if (props.forecastData.length > 0) {
        return props.forecastData.map(day => ({
            ...day,
            // Ensure temperature is properly formatted
            temperature: day.temperature !== '--' ? 
                parseFloat(day.temperature).toFixed(1) : '--'
        }));
    }
    // Fallback data if no forecast data
    return [
        {id: 1, name: 'SUN', weather_condition: '--', temperature: '--'},
        {id: 2, name: 'MON', weather_condition: '--', temperature: '--'},
        {id: 3, name: 'TUE', weather_condition: '--', temperature: '--'},
        {id: 4, name: 'WED', weather_condition: '--', temperature: '--'},
        {id: 5, name: 'THU', weather_condition: '--', temperature: '--'},
        {id: 6, name: 'FRI', weather_condition: '--', temperature: '--'},
        {id: 7, name: 'SAT', weather_condition: '--', temperature: '--'},
    ];
});
</script>

<style scoped lang="scss">
@use '@/styles/_weeklyforecast-mixin.scss' as weeklyforecast;
@include weeklyforecast.weeklyForecast;
</style>