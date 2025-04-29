<template>
    <section class = "news-section">
        <marquee>
            <span v-for="(article, index) in marqueeNews" :key="index">
                {{ article.title }}
                •
            </span>
        </marquee>
        <div class = "news-grid">
            <div class = "featured" v-if = "featured.length">
                <h2>FEATURED NEWS</h2>
                <div v-for="(article, index) in featured" :key = "index">
                    <h3>{{ article.title }}</h3>
                    <p><strong>Source:</strong> {{ article.source.name }}</p>
                    <p><strong>Published on:</strong> {{ formatDate(article.publishedAt) }}</p>
                    <img :src="article.urlToImage" alt="News image" v-if="article.urlToImage" />
                    <p>{{ article.description }}</p>
                    <a :href="article.url" target="_blank">Read full article →</a>
                </div>
            </div>
            <div class = "other-news">
                <h4>PREVIOUS NEWS</h4>
                <div v-if="others.length" class = "news-card">
                    <div class = "card-content" @click="goToArticle(others[0].url)" :style="{ backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${others[0].urlToImage})`,backgroundSize: 'cover', 
                    backgroundPosition: 'center', height: '150px' }">
                        <h5>{{ others[0].title }}</h5>
                        <p> {{ formatDate(others[0].publishedAt) }} / {{ others[0].source.name }}</p>
                    </div>
                </div>
            </div>
            <aside class = "top-stories">
                <h4>TOP STORIES</h4>
                <div v-for="(article, index) in topStories" :key="index" class="news-card">
                    <div class = "card-content" @click="goToArticle(article.url)" :style="{ backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${article.urlToImage})`,backgroundSize: 'cover', 
                    backgroundPosition: 'center', height: '100px' }">
                        <h5>{{ article.title }}</h5>
                        <p> {{ formatDate(article.publishedAt) }} / {{ article.source.name }}</p>
                    </div>
                </div>
            </aside>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const key = import.meta.env.VITE_NEWS_API_KEY
const url = `https://newsapi.org/v2/everything?q=philippines+weather+climate+heat&language=en&sortBy=publishedAt&apiKey=${key}`;
const featured = ref([])  
const others = ref([])
const topStories = ref([])
const marqueeNews = ref([])

console.log('API URL:', url)
console.log('API Key:', key)

// News Date Format
const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
    })
}

// News Card Link Redirectory
const goToArticle = (url) => {
    window.open(url, '_blank');
}

// News API Slices
onMounted(async () => {
    const res = await fetch(url, {
        headers: {
            'user-agent': 'Mozilla/5.0'
        }
    })
    const data = await res.json()

    if (data.articles.length) {
        const filteredArticles = data.articles.filter(article => article.title.length <= 80)

        featured.value = filteredArticles.slice(0, 2)  
        others.value = filteredArticles.slice(2, 3)
        topStories.value = filteredArticles.slice(3, 6)
        marqueeNews.value = filteredArticles.slice(0, 10)
    }
})
</script>

<style scoped lang="scss">
@use '@/styles/news.scss';
</style>