<template>
    <div class="search-container" ref="searchContainer">
        <input
            type="text"
            v-model="searchTerm"
            placeholder="Search a city in NCR..."
            maxlength="20"
            @focus="isDropdownOpen = true" />

        <div class="result-box" v-if="isDropdownOpen">
            <ul v-if="filteredItems.length > 0">
                <li
                    v-for="(item, index) in filteredItems"
                    :key="item"
                    @click="selectCity(item)">
                    <div class="weather-item">
                        <div class="city-name">{{ item }}</div>
                        <div class="temperature">{{ temperatures[item] || '--' }}°C</div>
                        <img
                            v-if="weatherIcons[item]"
                            :src="weatherIcons[item]"
                            alt="weather icon"
                            class="weather-icon" />
                        <div class="add-button" v-if="showAddButton">
                            <button @click.stop="selectCity(item)">+</button>
                        </div>
                    </div>
                    <hr v-if="index < filteredItems.length - 1">
                </li>
            </ul>
            <ul v-else>
                <li class="no-results">No results found.</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import sunnyIcon from '@/assets/Weather Dashboard/animated/day.svg';
import cloudyDay1 from '@/assets/Weather Dashboard/animated/cloudy-day-1.svg';
import cloudyDay2 from '@/assets/Weather Dashboard/animated/cloudy-day-2.svg';
import rainyIcon from '@/assets/Weather Dashboard/animated/rainy-1.svg';

const emit = defineEmits(['city-selected', 'location-detected']);

// Reactive state
const searchTerm = ref('');
const temperatures = ref({});
const weatherIcons = ref({});
const weatherDescriptions = ref({});
const showAddButton = ref(true);
const isDropdownOpen = ref(false);
const searchContainer = ref(null);

// City list
const items = ref([
    'Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong', 'Manila', 'Marikina',
    'Muntinlupa', 'Navotas', 'Parañaque', 'Pasay', 'Pasig', 'Pateros', 'Quezon City',
    'San Juan', 'Taguig', 'Valenzuela'
]);

// Computed filtered items
const filteredItems = computed(() => {
    const term = searchTerm.value.toLowerCase();
    return term === '' 
        ? items.value 
        : items.value.filter(item => item.toLowerCase().includes(term));
});

// Helper functions
const normalizeCityName = (city) => city.toLowerCase().replace(' ', '_').replace('ñ', 'n');

const getWeatherIcon = (temp) => {
    if (temp === '--') return null;
    if (temp > 30) return sunnyIcon;
    if (temp > 25) return cloudyDay1;
    if (temp > 20) return cloudyDay2;
    return rainyIcon;
};

const getWeatherDescription = (temp) => {
    if (temp === '--') return '--';
    if (temp > 30) return 'Hot';
    if (temp > 25) return 'Warm';
    if (temp > 20) return 'Mild';
    return 'Cool';
};

const getRandomAddition = () => Math.round((Math.random() * 1.0 + 1.5) * 10) / 10;

const mapToSupportedCity = (cityName) => {
    if (!cityName) return null;
    
    const cityMap = {
        'quezon': 'Quezon City',
        'pasay': 'Pasay',
        'pasig': 'Pasig',
        'taguig': 'Taguig',
        'manila': 'Manila',
        'caloocan': 'Caloocan',
        'las piñas': 'Las Piñas',
        'las pinas': 'Las Piñas', // alternative spelling
        'makati': 'Makati',
        'malabon': 'Malabon',
        'mandaluyong': 'Mandaluyong',
        'marikina': 'Marikina',
        'muntinlupa': 'Muntinlupa',
        'navotas': 'Navotas',
        'parañaque': 'Parañaque',
        'paranaque': 'Parañaque', // alternative spelling
        'san juan': 'San Juan',
        'valenzuela': 'Valenzuela',
        'quezon city': 'Quezon City',
        'metro manila': 'Manila',
        'ncr': 'Manila'
    };
    
    const lowerName = cityName.toLowerCase().trim();
    
    // First try exact match
    if (cityMap[lowerName]) {
        return cityMap[lowerName];
    }
    
    // Then try partial matches
    for (const [key, value] of Object.entries(cityMap)) {
        if (lowerName.includes(key)) {
            return value;
        }
    }
    
    return null;
};

// Weather data fetching
const fetchCityWeather = async (city) => {
    try {
        const normalizedCity = normalizeCityName(city);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/internal/current/${normalizedCity}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const randomAddition = getRandomAddition();
        const adjustedTemp = data.temperature ? (parseFloat(data.temperature) + randomAddition).toFixed(1) : '--';

        // Update state
        temperatures.value[city] = adjustedTemp;
        weatherIcons.value[city] = getWeatherIcon(adjustedTemp);
        weatherDescriptions.value[city] = data.weather_condition || getWeatherDescription(adjustedTemp);

        return {
            city,
            temperature: adjustedTemp,
            weatherIcon: weatherIcons.value[city],
            weatherDescription: weatherDescriptions.value[city]
        };
    } catch (error) {
        console.error('Error fetching weather for', city, error);
        temperatures.value[city] = '--';
        weatherIcons.value[city] = null;
        weatherDescriptions.value[city] = '--';
        return {
            city,
            temperature: '--',
            weatherIcon: null,
            weatherDescription: '--'
        };
    }
};

// Location detection
const detectUserLocation = async () => {
    if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        return;
    }

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                maximumAge: 60000
            });
        });

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`
        );
        const data = await response.json();
        
        console.log('Geolocation data:', data); // Debug log
        
        const address = data.address;
        // Try multiple possible city name fields
        let detectedCity = address.city || address.municipality || address.town || 
                         address.village || address.county || address.state_district;
        
        if (!detectedCity && address.state) {
            // Sometimes the city is in the state field for Metro Manila
            if (address.state.includes('Metro Manila') || address.state.includes('National Capital Region')) {
                detectedCity = 'Manila';
            }
        }

        if (detectedCity) {
            console.log('Detected location:', detectedCity); // Debug log
            const supportedCity = mapToSupportedCity(detectedCity);
            
            if (supportedCity && items.value.includes(supportedCity)) {
                const weatherData = await fetchCityWeather(supportedCity);
                emit('location-detected', {
                    city: supportedCity,
                    temperature: weatherData.temperature,
                    weatherIcon: weatherData.weatherIcon,
                    weatherDescription: weatherData.weatherDescription
                });
                return;
            } else {
                console.log('Unsupported city detected:', detectedCity);
            }
        }
        
        console.log('Could not detect supported city from:', address);
    } catch (error) {
        console.log('Location detection failed:', error);
    }
};

// City selection handler
const selectCity = async (city) => {
    const weatherData = await fetchCityWeather(city);
    emit('city-selected', weatherData);
    searchTerm.value = '';
    isDropdownOpen.value = false;
};

// Event listeners
const handleClickOutside = (event) => {
    if (searchContainer.value && !searchContainer.value.contains(event.target)) {
        isDropdownOpen.value = false;
    }
};

// Lifecycle hooks
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    
    // Pre-fetch weather for all cities
    items.value.forEach(city => {
        fetchCityWeather(city);
    });

    // Attempt to detect location
    detectUserLocation();
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

// Watch for search term changes
watch(searchTerm, (newVal) => {
    const match = items.value.find(city => city.toLowerCase() === newVal.toLowerCase());
    if (match && !temperatures.value[match]) {
        fetchCityWeather(match);
    }
});
</script>

<style scoped lang="scss">
@use '@/styles/_searchbar-mixin.scss' as searchbar;
@include searchbar.searchBar;
</style>