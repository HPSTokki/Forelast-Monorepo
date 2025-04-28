<template>
    <section class = "DataLogin">
        <div class = "header">
            <h2>Historical Weather Data</h2>
            <p>Looking for past weather data? Login to download it here in .csv format — quick, easy, and ready to go!</p>
        </div>

        <div class = "loginForm">
            <div class = "login">
                <h2>Sign in</h2>

                <form @submit.prevent = "submitLogin">
                    <div class = "name">
                        <label for = "email">Email:</label>
                        <input type = "text" id = "email" name = "email" v-model = "email" required>
                    </div>

                    <div class = "pass">
                        <label for = "password">Password:</label>
                        <input type = "password" id = "password" name = "password" v-model = "password" required>
                        <div class = "forgot-password"><a href = "#" @click.prevent = "openModal">Forgot Password?</a></div>
                        <ForgotPasswordModal v-if = "isModalOpen" @close = "isModalOpen = false" />
                        <p class = "validation-message">{{ validationMessage }}</p>
                    </div>

                    <div class = "loginbt">
                        <button type = "submit" class = "btn">Sign in</button>
                    </div>
                </form>

                <div class = "regs">
                    <div class = "reg">Don't have an account? <router-link to = "/data/register">Sign up.</router-link></div>
                    <div class = "terms"><router-link to = "/privacy">Terms and Conditions</router-link></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import ForgotPasswordModal from '@/components/ForgotPasswordModal.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const isModalOpen = ref(false)
const email = ref('')
const password = ref('')
const validationMessage = ref('')

function openModal() {
    isModalOpen.value = true;
}

async function submitLogin() {
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/login/', {
            email: email.value,
            password: password.value
        })
    validationMessage.value = '' 
        console.log('Login successful:', response.data)
        router.push('/data/csvdownload')
    } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
            validationMessage.value = error.response.data.detail
        } else {
            validationMessage.value = 'Login failed. Please check your credentials.'
        }
    }
}
</script>


<style scoped lang = "scss">
@use "@/styles/_DataLogin_mixin.scss" as dataLogin;

.DataLogin {
    @include dataLogin.DataLogin;
}
</style>