import { ref, computed } from 'vue'

export function useWeatherIcons() {
    const weatherCondition = ref('')

    const weatherIcon = computed (() => {
        switch (weatherCondition.value) {
            case 'sunny':
                return new URL('@/assets/Weather Dashboard/animated/cloudy-day-1.svg', import.meta.url).href
            case 'rainy':
                return new URL('@/assets/Weather Dashboard/animated/rainy-6.svg', import.meta.url).href
            case 'cloudy':
                return new URL('@/assets/Weather Dashboard/animated/cloudy.svg', import.meta.url).href
            case 'windy':
                
        }   
    })
}