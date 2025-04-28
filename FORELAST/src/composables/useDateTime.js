// Date Formatter Script
import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useDateTime() {
    const currentDate = ref(new Date())

    const formattedDateTime = computed(() => {
        const options = {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
        }
        return currentDate.value.toLocaleDateString('en-US', options)
    })

    let interval

    onMounted(() => {
        updateCurrentDate()
        interval = setInterval(updateCurrentDate, 1000)
    })

    onUnmounted(() => {
        clearInterval(interval)
    })

    const updateCurrentDate = () => {
        currentDate.value = new Date()
    }

    return {
        currentDate,
        formattedDateTime,
        updateCurrentDate
    }
}
