<template>
    <iframe 
        class = "weather-map"
        src = "https://www.meteoblue.com/en/weather/maps/widget?windAnimation=1&gust=0&satellite=1&cloudsAndPrecipitation=1&temperature=1&sunshine=0&extremeForecastIndex=1&lat=14.5995&lon=120.9842&tempunit=C&windunit=km%2Fh&lengthunit=metric&zoom=10&autowidth=manu"
        frameborder = "0"
        scrolling = "YES"
        allowtransparency = "true"
        sandbox = "allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox">
    </iframe>
    <div class = "link">
        <a href = "https://www.meteoblue.com/en/weather/maps/index?utm_source=map_widget&utm_medium=linkus&utm_content=map&utm_campaign=Weather%2BWidget"
        target = "_blank"
        rel = "noopener">
        meteoblue
        </a>
    </div>
</template>

<script setup>

</script>

<style scoped lang = "scss">
@use '@/styles/_map.scss';
</style>