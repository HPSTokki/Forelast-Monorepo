<template>
    <section class = "weather-analytics">
        <div class = "search-bar">
            <CitySearch @city-selected = "fetchWeatherData" />
        </div>
        <div class = "analytics-grid">
            <div class="chart-area">
                <template v-if="loading">
                    <div class="loading-state">
                        <div class="spinner"></div>
                        <p>Loading weather data...</p>
                    </div>
                </template>
                <template v-else>
                    <div class="weather-chart-container">
                        <WeatherChart 
                        v-if="activeView === 'historical' && historicalData"
                        :title="`Past 14 Days Weather for ${city}`"
                        :chartData="historicalData"
                    />
                    <WeatherChart 
                        v-if="activeView === 'forecast' && forecastData"
                        :title="`Next 7 Days Forecast for ${city}`"
                        :chartData="forecastData"
                    />
                    <WeatherChart 
                        v-if="activeView === 'combined' && combinedData"
                        :title="`21-Day Weather View for ${city}`"
                        :chartData="combinedData"
                    />
                    <CityInfoCard
                        :current-city="typeof city === 'object' ? city.city : city"
                        :current-temp="currentMetrics.temp"
                        :top-cities="topCities"
                    
                    />
                    </div>
                    <div class = "time-range-selector">
                        <button 
                        @click = "activeView = 'historical'" 
                        :class = "{ active: activeView === 'historical' }"
                        >
                        Past 14 Days
                        </button>
                        <button 
                        @click = "activeView = 'forecast'" 
                        :class = "{ active: activeView === 'forecast' }"
                        >
                        Next 7 Days
                        </button>
                        <button 
                        @click = "activeView = 'combined'" 
                        :class = "{ active: activeView === 'combined' }"
                        >
                        21-Day View
                        </button>
                    </div>
                </template>
            </div>
            <div class = "aside-panel">
            </div>
            <div v-if = "historicalData" class = "metrics-grid">
                <WeatherMetric 
                title = "Current Temp"
                :value = "currentMetrics.temp"
                unit = "°C"
                :trend = "currentMetrics.tempTrend"
                />
                <WeatherMetric 
                title = "Humidity"
                :value = "currentMetrics.humidity"
                unit = "%"
                :trend = "currentMetrics.humidityTrend"
                />
                <WeatherMetric 
                title = "Precipitation"
                :value = "currentMetrics.precip"
                unit = "mm"
                :trend = "currentMetrics.precipTrend"
                />
                <WeatherMetric 
                title = "Wind Speed"
                :value = "currentMetrics.windspeed"
                unit = "km/h"
                :trend = "currentMetrics.windspeedTrend"
                />
            </div>
        </div>
    </section>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import CitySearch from '@/components/CitySearch.vue'
import WeatherChart from '@/components/WeatherChart.vue'
import WeatherMetric from '@/components/WeatherMetric.vue'
import CityInfoCard from '@/components/CityInfoCard.vue'
import SearchBar from '@/components/SearchBar.vue'


const route = useRoute()
const city = ref(route.params.city || 'Quezon City')
const activeView = ref('combined')
const loading = ref(false) 
const topCities = ref([])
const historicalData = ref(null)
const forecastData = ref(null)
const combinedData = ref(null)

const fetchWeatherData = async (selectedCity) => {
    loading.value = true
    city.value = selectedCity || city.value
    
    try {
        const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/weather/analytics/${city.value}`,
        {
            headers: {
            'Accept': 'application/json'
            }
        }
    )
    
    console.log("API RESPONSE:", response.data)

    historicalData.value = formatChartData(response.data.historical)
    forecastData.value = formatChartData(response.data.forecast)
    combinedData.value = formatChartData(response.data.combined)

    await fetchTopCities()

    } catch (error) {
        console.error('Error fetching weather data:', error)
    } finally {
        loading.value = false
    }
}

const formatChartData = (apiData) => {
    if (!apiData) return null
    return {
        labels: apiData.dates,
        temp: apiData.temp,
        humidity: apiData.humidity,
        precip: apiData.precip,
        windspeed: apiData.windspeed
    }
}

const fetchTopCities = async () => {
    try {
        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/weather/top-cities`,
            { headers: { 'Accept': 'application/json' } }
        )
        topCities.value = response.data.top_cities
    } catch (error) {
        console.error('Error fetching top cities:', error)
        topCities.value = [] // Fallback empty array
    }
}

const currentMetrics = computed(() => {
    if (!combinedData.value) return {}
    
    const getTrend = (values) => {
        if (!values || values.length < 2) return 'steady'
        const diff = values[0] - values[1]
        if (diff > 0) return 'up'
        if (diff < 0) return 'down'
        return 'steady'
    }
    
    return {
        temp: combinedData.value.temp?.[0] || '--',
        humidity: combinedData.value.humidity?.[0] || '--',
        precip: combinedData.value.precip?.[0] || '--',
        windspeed: combinedData.value.windspeed?.[0] || '--',
        tempTrend: getTrend(combinedData.value.temp),
        humidityTrend: getTrend(combinedData.value.humidity),
        precipTrend: getTrend(combinedData.value.precip),
        windspeedTrend: getTrend(combinedData.value.windspeed)
    }
})

onMounted(fetchWeatherData)
</script>

<style scoped lang = "scss">
@use '@/styles/variables.scss' as vars;

.weather-analytics {
    font-family: 'Poppins', sans-serif;
    display: flex;
    flex-direction: column;

    .analytics-grid {
        display: grid;

        .chart-area {
            color: vars.$font-color;
            grid-area: chart-area;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;

            .weather-chart-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .loading-state {
                grid-area: loading-area;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;

                .spinner {
                    width: 2rem;
                    height: 2rem;
                    border: 3px solid #ccc;
                    border-top: 3px solid vars.$accent-color;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;

                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                }

                p {
                    font-family: vars.$primary-font;
                    margin-top: 1rem;
                }
            }

            .time-range-selector {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                width: 100%;
            
                button {
                    padding: .5rem 2rem;
                    background: #f0f0f0;
                    border: none;
                    border-radius: vars.$border-radius;
                    font-family: vars.$primary-font;
                    text-wrap: nowrap;
                    cursor: pointer;

                    &.active {
                        background: vars.$accent-color;
                        color: white;
                    }
                }
            }
        }

        .aside-panel {
            grid-area: aside-panel;
        }

        .metrics-grid {
            grid-area: metrics-grid;
        }
    }
}

@media (max-width: 768px) {
    .weather-analytics {
        .search-bar {
            height: 0;
            padding: 1rem;
        }

        .analytics-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;

            .chart-area {
                width: 100%;
                
                .loading-state {
                    padding: 2rem 1rem;
                    width: 100%;
                    text-align: center;

                    p {
                        font-size: vars.$mobile-fsize;
                    }
                }

                .time-range-selector {
                    flex-direction: column;
                    gap: .5rem;
                    button {
                        width: 100%;
                        font-size: vars.$mobile-fsize;
                        padding: .5rem;
                    }
                }
            }

            .aside-panel {
                width: 100%;
                min-height: 100px; // or auto if content-based
            }

            .metrics-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 1rem;
            }
        }
    }
}

// Larger Screens
@media (min-width: 769px) {
    .weather-analytics {
        .search-bar {
            height: 1.5rem;
        }

        .analytics-grid {
            grid-template-areas:
                "header-area aside-panel"
                "chart-area chart-area" // Change to "chart-area aside-panel" after checking!
                "metrics-grid metrics-grid";
            grid-template-columns: 2fr 1fr;
            grid-template-rows: auto auto auto auto;
            gap: .5rem;
            padding: 1.5rem;

            .chart-area {
                .loading-state {
                    padding: 2rem;
                    height: 403px; 
                    width: 100%;

                    p {
                        font-size: vars.$larger-fsize;
                    }
                }

                .time-range-selector {
                    padding: .5rem;
                    gap: 1rem;
                
                    button {
                        padding: .5rem 2rem;
                        font-size: vars.$larger-smalltext;
                    }
                }
            }

            

            .metrics-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 1rem;
            }
        }
    }
}


</style>