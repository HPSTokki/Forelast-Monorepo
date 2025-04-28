<template>
    <div class = "card">
        <figure class = "weather-icon">
            <div class = "imgContainer">
                <img v-if="isSvgIcon(weatherIcon)" :src="weatherIcon" :alt="weatherDescription" class="weather-svg">
            </div>
            <figcaption class = "city-name">{{ city }}</figcaption>
            <figcaption>{{ weatherDescription }}</figcaption>
            <figcaption>{{ temperature}}°C</figcaption> <!-- Display temperature -->
        </figure>
        <button class= "remove-button" @click="$emit('remove', city)">x</button>
    </div>
</template>

<script>

export default {
    props: {
        city: {
            type: String,
            required: true
        },
        temperature: {
            type: [String, Number],
            required: true
        },
        weatherIcon: {
            type: String,
            default: '--'
        },
        weatherDescription: {
            type: String,
            default: '--'
        }
    },
    methods: {
        removeCard() {
            console.log('Emitting remove for city:', this.city)
            this.$emit('remove', this.city);
        },
        isSvgIcon(icon) {
            return icon && icon !== '--' && (icon.endsWith('.svg') || icon.includes('<svg'));
        }
    },
    computed: {
        displayTemp() {
            return this.temperature === '--' ? '--' : `${this.temperature}°C`;
        }
    },
}
</script>

<style scoped lang = "scss">
@use '@/styles/_weathercard-mixin.scss' as weathercard;
@include weathercard.weatherCard;
</style>