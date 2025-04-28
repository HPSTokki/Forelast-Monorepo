<template>
    <header>
        <div class = "header-item">
            <img src = "../assets/Logos/forelast-image-logo.png" class = "header-logo">
        </div>
        <router-link to = "/home" class = "header-item" active-class = "active">
            <img src = "../assets/Home/header/house-solid.svg" class = "header-image">
            <span class = "nav-item-text">Home</span>
        </router-link>
        <router-link to = "/weather/daily" class = "header-item" :class = "{ active: $route.path.startsWith('/weather') }">
            <img src = "../assets/Home/header/cloud-solid.svg" class = "header-image">
            <span class = "nav-item-text">Weather</span>
        </router-link>
        <router-link to = "/map" class = "header-item" active-class = "active">
            <img src = "../assets/Home/header/globe-solid.svg" class = "header-image">
            <span class = "nav-item-text">Map</span>
        </router-link>
        <router-link to = "/news" class = "header-item" active-class = "active">
            <img src = "../assets/Home/header/newspaper-solid.svg" class = "header-image">
            <span class = "nav-item-text">News</span>
        </router-link>
        <router-link to = "/data/login" class = "header-item" :class = "{ active: $route.path.startsWith('/data') }">
            <img src = "../assets/Home/header/file-shield-solid.svg" class = "header-image">
            <span class = "nav-item-text">Data</span>
        </router-link>
    </header>
</template>

<style scoped lang = "scss">
@use '@/styles/_header-mixin.scss' as header;

header {
    @include header.header;
}
</style>