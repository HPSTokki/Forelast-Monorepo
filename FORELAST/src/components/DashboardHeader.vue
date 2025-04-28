<template>
    <section class="dashboard-header">
        <div class="search-bar-section">
            <SearchBar 
                :showAddButton="false"
                @city-selected="handleCitySelected" 
            />
        </div>
        <div class="forecast-details">
            <div class="left-section">
                <h4>TODAY'S FORECAST</h4>
                <p>{{ formattedDateTime }}</p>
                <p>{{ weatherDescription }}</p>
                <p>{{ temperature }}</p>
            </div>
            <div class="vertical-line"></div>
            <div class="right-section">
                <div class="location">
                    <img 
                        src="../assets/Weather Dashboard/todayforecast-location.png" 
                        class="locationIcon"
                    >
                    <h3>{{ city }}</h3>
                    <img 
                        :src="weatherIcon" 
                        class="weatherIcon"
                    >
                    <div 
                        class="i-message" 
                        @mouseover="isMessageVisible = true" 
                        @mouseleave="isMessageVisible = false"
                    >
                        <img src="../assets/Weather Dashboard/todayforecast-info.png">
                        <transition name="fade">
                            <div v-if="isMessageVisible" class="message">
                                <p>{{ getWeatherMessage }}</p>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import SearchBar from '@/components/SearchBar.vue';
import { useDateTime } from '@/composables/useDateTime.js';
import { ref, computed } from 'vue';

const props = defineProps({
    city: {
        type: String,
        default: 'Quezon City'
    },
    weatherDescription: {
        type: String,
        default: '--'
    },
    temperature: {
        type: [String, Number],
        default: '--'
    },
    weatherIcon: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['city-selected']);

// Date Time Formatter Imported Script
const { formattedDateTime } = useDateTime();

const isMessageVisible = ref(false);

const handleCitySelected = (selectedCity) => {
    emit('city-selected', selectedCity);
};

const getWeatherMessage = computed(() => {
    const messages = {
        sunny: [
            "Today is a sunny day, a good day to go out.",
            "Sunshine on your skin, happiness in your heart — soak it all in."
        ],
        rainy: [
            "Raindrops falling, hearts calming — finding peace in every drizzle.",
            "Dancing in the rain reminds us that joy can bloom from any storm."
        ],
        cloudy: [
            "Embrace the calm before the sunshine — every cloud has its story.",
            "The clouds may linger, but they make the sky more beautiful."
        ],
        windy: [
            "Let the wind carry your worries away — breathe in the fresh breeze.",
            "The wind whispers freedom — let it guide your thoughts to peace."
        ]
    };

    const condition = props.weatherDescription.toLowerCase();
    let weatherType = 'cloudy';
    
    if (condition.includes('rain')) weatherType = 'rainy';
    else if (condition.includes('sun')) weatherType = 'sunny';
    else if (condition.includes('wind')) weatherType = 'windy';

    const conditionMessages = messages[weatherType];
    const randomIndex = Math.floor(Math.random() * conditionMessages.length);
    return conditionMessages[randomIndex];
});
</script>

<style scoped lang="scss">
@use '@/styles/_dashboardheader-mixin.scss' as dashboardheader;
@include dashboardheader.dashboardHeader;
</style>