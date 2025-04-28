import { createRouter, createWebHistory } from 'vue-router'

// Main Webpages
import Home from '@/views/Home.vue'
import WeatherDashboard from '@/views/WeatherDashboard.vue'
import DailyForecast from '@/views/DailyForecast.vue'
import Analytics from '@/views/Analytics.vue'
import Map from '@/views/Map.vue'
import NewsSection from '@/views/NewsSection.vue'
import Data from '@/views/Data.vue'
import DataLogin from '@/views/DataLogin.vue'
import DataRegister from '@/views/DataRegister.vue'


// Other Webpages
import UserFeedback from '@/views/Other Views/UserFeedback.vue'
import TermsOfUse from '@/views/TermsOfUse.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import DataDownload from '@/views/DataDownload.vue'

const routes = [
    { path: '/', redirect: '/home'},
    { path: '/home', component: Home, meta: { title: 'FORELAST - Home'}},
    {
        path: '/weather', 
        redirect: '/weather/daily',
        component: WeatherDashboard,
        children: [
            { path: 'daily', component: DailyForecast, meta: { title: 'FORELAST - Daily Forecast'} },
            { path: 'analytics', component: Analytics, meta: { title: 'FORELAST - Analytics'} },
            { 
                path: 'analytics/:city', 
                component: WeatherDashboard, 
                meta: { title: 'FORELAST - City Analytics'},
                props: true
            },
        ]
    },
    { path: '/map', component: Map, meta: { title: 'FORELAST - Map'}},
    { path: '/news', component: NewsSection, meta: { title: 'FORELAST - News'}},
    { 
        path: '/data', redirect: '/data/login',
        component: Data, 
        meta: { title: 'FORELAST - Data'},
        children: [
            { path: 'login', component: DataLogin, meta: { title: 'FORELAST - Data Login'} },
            { path: 'register', component: DataRegister, meta: { title: 'FORELAST - Data Register'} },
            { path: 'csvdownload', component: DataDownload, meta: { title: 'FORELAST - Data Download'}},
        ]
    },
    
    // Other paths.
    { path: '/feedback', component: UserFeedback},
    { path: '/terms', component: TermsOfUse },
    { path: '/privacy', component: PrivacyPolicy },
    
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {

    document.title = to.meta.title || 'FORELAST';
    next();
});

export default router
