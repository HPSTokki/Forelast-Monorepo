<template>
    <div class = "dashboard-tabs">
        <router-link 
            to = "/weather/daily" 
            class = "daily-forecast"
            :class = "{ active: $route.path === 'weather/daily'}"
            >DAILY FORECAST</router-link>
        <router-link 
            to = "/weather/analytics" 
            class = "forecast-analytics"
            :class = "{ active: $route.path === 'weather/analytics'}"
            >ANALYTICS</router-link>
    </div>
</template>

<script>
import { useRoute } from 'vue-router';

export default {
    setup() {
    const $route = useRoute();
    return { $route };
    },
};
</script>

<style scoped lang = "scss">
@use '@/styles/_dashboardnavbar-mixin.scss' as dashboardNavbar;
@include dashboardNavbar.dashboardNavbar
</style>