<template>
    <main>
        <section class = "dashboard-navbar">
            <DashboardNavbar />
        </section>
        <router-view :key = "$route.fullPath" />
    </main>
    
</template>

<script setup>
import DashboardNavbar from '@/components/DashboardNavbar.vue'
</script>

