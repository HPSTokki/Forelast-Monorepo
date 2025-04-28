export function useWeatherProps() {
    return {
        city: {
            type: String,
            default: 'City Name',
            required: true
        },
        weatherIcon: {
            type: String,
            default: new URL('../assets/Weather Dashboard/animated/cloudy-day-2.svg', import.meta.url).href,
            required: true
        },
        weatherDescription: {
            type: String,
            default: 'Weather',
            required: true
        },
        temperature: {
            type: Number,
            default: 'Temperature',
            required: true
        },
        weatherMessage: {
            type: String,
            required: true,
        },
    }
}
