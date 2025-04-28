<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ZephyrChatbot from '@/components/ZephyrChatbot.vue';
</script>

<template>
  <div id = "app">
    <div class = "layout">
    <header>
      <Header />
    </header>
    
    <ZephyrChatbot />
    <transition name = "fade">
      <router-view></router-view>
    </transition>
    
    <footer>
      <Footer />
    </footer>
    </div>
  </div>
</template>

<style lang = "scss">
@use '@/styles/_layout.scss';
</style>
