<template>
    <footer class = "footer">
        <div class = "footer-top">
            <div class = "column">
                <h4>CONTACT US</h4>
                <img src = "@/assets/Logos/forelast-text-logo.svg">
                <p>Have questions or feedback? We're here to help — reach out anytime!</p>
                <form @submit.prevent = "submitSuggestion">
                    <textarea v-model = "form.message" placeholder = "Your message here..." required></textarea>
                    <button type = "submit">Send Email</button>
                </form>
            </div>
            <div class = "column">
                <h4>ABOUT US</h4>
                <p>Wondering if you’ll need an umbrella? We’ve got you.
                    FORELAST is a system that predicts current and upcoming 
                    weekly weather using API data and LSTM, a neural network 
                    model for time series, by processing and analyzing past 
                    weather patterns
                </p>
            </div>
            <div class = "column">
                <h4>NAVIGATE</h4>
                <ul>
                    <li><a href = "/home">Home</a></li>
                    <li><a href = "/weather">Weather</a></li>
                    <li><a href = "/map">Map</a></li>
                    <li><a href = "/news">News</a></li>
                    <li><a href = "/data">Data</a></li>
                    <li><a href = "/feedback">User Feedback</a></li>
                </ul>
            </div>
        </div>
        <div class = "footer-bottom">
            <p><span>FORELAST</span> · Quezon City University · 673 Quirino Hwy, Novaliches, Quezon City, Metro Manila</p>
            <div class = "footer-links">
                <a href = "/privacy">Privacy Policy</a>
                <a href = "/terms">Terms of Use</a>
                <p> © {{ new Date().getFullYear() }} FORELAST</p>
            </div>
            <Modal :isOpen = "modalOpen" @close = "closeModal">
                <template #header>
                    <h2>Sent Successfully</h2>
                </template>
                <template #image>
                    <img src = "@/assets/Home/footer/sent-icon.svg">
                </template>
                <template #body>
                    <p>Your suggestion has been successfully sent.</p>
                </template>
            </Modal>
            <Modal :isOpen = "warningModal" @close = "closeModal">
                <template #header>
                    <h2>Heads up!</h2>
                </template>
                <template #image>
                    <img src = "@/assets/Home/quick forecast section/alert.svg">
                </template>
                <template #body>
                    <p>You can only send one (1) suggestion per day.</p>
                </template>
            </Modal>
        </div>
    </footer>
</template>

<script setup>
import Modal from './Modal.vue'
import { ref } from 'vue'

const form = ref({
    message: ''
})

const modalOpen = ref(false)
const warningModal = ref(false)

const submitSuggestion = async () => {
    const lastSentDate = localStorage.getItem("lastSuggestionDate")
    const today = new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD

    if (lastSentDate === today) {
        warningModal.value = true
        return
    }

    try {
        const formData = new FormData()
        formData.append("message", form.value.message)

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/send-suggestion/`, {
            method: "POST",
            body: formData
        })

        const result = await response.json()
        if (result.status === "success") {
            localStorage.setItem("lastSuggestionDate", today) 
            form.value.message = ""
            modalOpen.value = true
        } else {
            alert("Something went wrong.")
        }
    } catch (err) {
        console.error(err)
        alert("Error connecting to server.")
    }
}

const closeModal = () => {
    modalOpen.value = false  
    warningModal.value = false
}
</script>

<style scoped lang = "scss">
@use '@/styles/_footer-mixin.scss' as footer;

footer {
    @include footer.footer;
}

</style>