<template>
    <section class="forecast-container">
        <div class="forecast-panels">
            <div class="weekly-forecast">
                <WeeklyForecast :forecastData="forecastData" :city="city"/>
            </div>
            <div class="rainfall">
                <h3>RAINFALL<br>PROBABILITY</h3>
                <p>{{ rainfallProbability }}%</p>
            </div>
            <div class="wind-speed">
                <h3>WIND SPEED</h3>
                <p>{{ formattedWindSpeed }} km/h</p>
            </div>
            <div class="optimal-activities">
                <h3>OPTIMAL ACTIVITIES</h3>
                <div class="activity-container">
                    <div v-for="activity in filteredActivities" :key="activity.name" class="activity-items">
                        <img :src="activity.image" :alt="activity.name">
                        <h3>{{ activity.name }}</h3>
                        <p>{{ activity.description }}</p>
                    </div>
                    <p v-if="filteredActivities.length === 0">No activities suggested for this weather.</p>
                </div>
            </div>
            <div class="feels-like">
                <h3>FEELS LIKE</h3>
                <p>{{ feelsLike }}°C</p>
            </div>
            <div class="humidity">
                <h3>HUMIDITY</h3>
                <p>{{ formattedHumidity }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import WeeklyForecast from '@/components/WeeklyForecast.vue';

const props = defineProps({
    weatherDescription: {
        type: String,
        default: '--'
    },
    temperature: {
        type: [String, Number],
        default: '--'
    },
    humidity: {
        type: [String, Number],
        default: '--'
    },
    city: {
        type: String,
        default: 'Quezon City'
    },
    forecastData: {
        type: Array,
        default: () => []
    },
    precip: {
        type: [String, Number],
        default: '--',
        validator: (value) => value === '--' || !isNaN(parseFloat(value))
    },
    windSpeed: {
        type: [String, Number],
        default: '--'
    }
});

const formattedHumidity = computed(() => {
    if (props.humidity === '--') return '--';
    
    const humidityValue = parseFloat(props.humidity);
    if (isNaN(humidityValue)) return '--';
    
    // Remove decimal places for humidity
    return Math.round(humidityValue).toString();
});

const formattedWindSpeed = computed(() => {
    if (props.windSpeed === '--') return '--';
    
    const windValue = parseFloat(props.windSpeed);
    if (isNaN(windValue)) return '--';
    
    // Round to nearest whole number for wind speed
    return Math.round(windValue).toString();
});

const rainfallProbability = computed(() => {
    // Return actual precipitation value if available
    if (props.precip !== '--') {
        return Math.min(100, Math.round(parseFloat(props.precip)));
    } 
    
    // Fallback to weather-based estimation if no data
    if (props.weatherDescription === 'Rainy') return 80;
    if (props.weatherDescription === 'Partly Cloudy') return 30;
    if (props.weatherDescription === 'Cloudy') return 50;
    return 10;
});

const windSpeed = computed(() => {
    if (props.weatherDescription === 'Rainy') return 16;
    if (props.weatherDescription === 'Windy') return 20;
    return 8;
});

const feelsLike = computed(() => {
    if (props.temperature === '--') return '--';
    
    const temp = parseFloat(props.temperature);
    if (isNaN(temp)) return '--';

    let adjustedTemp = temp;
    if (props.weatherDescription.toLowerCase().includes('rain')) adjustedTemp = temp - 2;
    if (props.weatherDescription.toLowerCase().includes('sun')) adjustedTemp = temp + 2;

    // Format to 1 decimal place, removing trailing .0 if needed
    const formatted = adjustedTemp.toFixed(1);
    return formatted.endsWith('.0') ? formatted.split('.')[0] : formatted;
});

const getActivityImage = (name) => {
    const images = {
        'goout': 'activities-goout.svg',
        'workout': 'activities-workout.svg',
        'gardening': 'activities-gardening.svg',
        'hobbies': 'activities-hobbies.svg',
        'beach': 'activities-beach.svg',
        'paragliding': 'activities-paragliding.svg',
        'photography': 'activities-photography.svg',
        'relax': 'activities-relax.svg',
        'pottery': 'activities-pottery.svg',
        'picnic': 'activities-picnic.svg',
        'bicycling': 'activities-bicycling.svg',
        'movies': 'activities-movies.svg',
        'cooking': 'activities-cooking.svg',
        'books': 'activities-books.svg',
        'kite': 'activities-kite.svg',
        'running': 'activities-running.svg',
        'sailing': 'activities-sailing.svg',
        'puzzle': 'activities-puzzle.svg',
        'windmill': 'activities-windmill.svg',
        'yoga': 'activities-yoga.svg'
    };
    return new URL(`/src/assets/Weather Dashboard/optimal-activities/${images[name]}`, import.meta.url).href;
};

const activityData = {
    hot: [
        { name: 'Stay under the shade', description: 'Stay hydrated and avoid going outdoors', image: getActivityImage('goout') },
        { name: 'Swimming', description: 'Perfect weather for a refreshing swim', image: getActivityImage('beach') },
        { name: 'Stay indoors', description: 'Keep cool in air-conditioned spaces', image: getActivityImage('movies') }
    ],
    warm: [
        { name: 'Picnic', description: 'Enjoy outdoor dining in pleasant weather', image: getActivityImage('picnic') },
        { name: 'Hiking', description: 'Explore nature trails in comfortable temps', image: getActivityImage('goout') },
        { name: 'Gardening', description: 'Great conditions for tending to your garden', image: getActivityImage('gardening') }
    ],
    mild: [
        { name: 'Pottery', description: 'The possibilities with clay are endless.', image: getActivityImage('pottery')},
        { name: 'Cycling', description: 'Enjoy a bike ride in mild conditions', image: getActivityImage('bicycling') },
        { name: 'Outdoor sports', description: 'Play your favorite outdoor sports', image: getActivityImage('workout') }
    ],
    cool: [
        { name: 'Jogging', description: 'Refresh with a cool-weather run', image: getActivityImage('running') },
        { name: 'Relax', description: 'Take it easy. Breathe', image: getActivityImage('relax') },
        { name: 'Light hiking', description: 'Explore with light layers', image: getActivityImage('goout') }
    ],
    rainy: [
        { name: 'Reading', description: 'Cozy up with a good book', image: getActivityImage('books') },
        { name: 'Movie Marathon', description: 'Perfect for binge-watching', image: getActivityImage('movies') },
        { name: 'Baking', description: 'Warm up the kitchen with baked goods', image: getActivityImage('cooking') },
        { name: 'Puzzles', description: 'Train your mental capacity with puzzles', image: getActivityImage('puzzle')},
    ],
    windy: [
        { name: 'Kite Flying', description: 'Take advantage of the breeze', image: getActivityImage('kite') },
        { name: 'Sailing', description: 'Great conditions for water sports', image: getActivityImage('sailing') },
        { name: 'Wind farm visit', description: 'Learn about renewable energy', image: getActivityImage('windmill') }
    ]
};

const filteredActivities = computed(() => {
    if (props.weatherDescription === '--' || props.temperature === '--') {
        return [];
    }
    
    const temp = parseFloat(props.temperature) || 0;
    const condition = props.weatherDescription.toLowerCase();
    
    // First check for special conditions
    if (condition.includes('rain')) return activityData.rainy;
    if (condition.includes('wind')) return activityData.windy;
    
    // Then check temperature ranges
    if (temp > 30) return activityData.hot;
    if (temp > 25) return activityData.warm;
    if (temp > 18) return activityData.mild;
    return activityData.cool;
});

const activities = computed(() => {
    const condition = props.weatherDescription.toLowerCase();
    if (condition.includes('rain')) return activityData.rainy;
    if (condition.includes('sun')) return activityData.sunny;
    if (condition.includes('wind')) return activityData.windy;
    return activityData.cloudy;
});
</script>

<style scoped lang="scss">
@use '@/styles/_dashboard.scss';
</style>