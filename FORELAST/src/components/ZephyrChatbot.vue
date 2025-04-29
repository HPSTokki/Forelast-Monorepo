<template>
	<div class="chatbot-toggle" @click="toggleChat">
	  <img src="@/assets/Home/Zephyr AI.png">
	</div>
	<div class="chatbot-container" v-if="isOpen">
	  <div class="header">
		<h4>Zephyr AI</h4>
		<div class="interaction-buttons">
		  <button @click="closeChat">✖</button>
		</div>
	  </div>
	  <div class="quick-questions">
		<button @click="sendMessage('What is FORELAST?')">What is FORELAST?</button>
		<button @click="sendMessage('Hello!')">Hello!</button>
		<button @click="sendMessage('Who is Zephyr?')">Who is Zephyr?</button>
		<button @click="sendMessage('Show me weather in Manila')">Manila Weather</button>
	  </div>
	  <div class="chat-log" ref="chatLog">
		<div
		  v-for="(message, index) in messages"
		  :key="index"
		  :class="['message-container', message.sender]"
		>
		  <div v-if="message.sender === 'user'" class="user-message">
			{{ message.text }}
		  </div>
		  <div v-else class="bot-message-container">
			<div class="bot-name">Zephyr AI</div>
			<div class="bot-info">
			  <div class="bot-icon">
				<img src="@/assets/Home/Zephyr AI.png">
			  </div>
			  <div class="bot-message">
				<div v-if="message.isWeatherData" class="weather-data">
				  <h4>{{ message.structured_data.city }} Weather</h4>
				  <div class="weather-grid">
					<div class="weather-item">
					  <span class="label">Temperature:</span>
					  <span class="value">{{ message.structured_data.temperature || '--' }}</span>
					</div>
					<div class="weather-item">
					  <span class="label">Condition:</span>
					  <span class="value">{{ message.structured_data.condition || '--' }}</span>
					</div>
					<div class="weather-item">
					  <span class="label">Humidity:</span>
					  <span class="value">{{ message.structured_data.humidity || '--' }}</span>
					</div>
					<div class="weather-item">
					  <span class="label">Precipitation:</span>
					  <span class="value">{{ message.structured_data.precipitation || '--' }}</span>
					</div>
					<div class="weather-item">
					  <span class="label">Wind Speed:</span>
					  <span class="value">{{ message.structured_data.windspeed || '--' }}</span>
					</div>
				  </div>
				  <button 
					class="download-btn"
					@click="navigateToDataDownload(message.structured_data.city)"
				  >
					Download Full Data
				  </button>
				</div>
				<template v-else>
				  {{ message.text }}
				</template>
			  </div>
			</div>
		  </div>
		</div>
		<div v-if="isTyping" class="bot-message-container typing-indicator-container">
		  <div class="bot-name">Zephyr AI</div>
		  <div class="bot-info">
			<div class="bot-icon">
			  <img src="@/assets/Home/Zephyr AI.png">
			</div>
			<p class="typing-indicator">Zephyr AI is typing...</p>
		  </div>
		</div>
	  </div>
	  <div class="input-area">
		<textarea
		  v-model="newMessage"
		  placeholder="Ask about weather in any NCR city..."
		  @keyup.enter="sendMessage()"
		  class="no-focus-border"
		></textarea>
		<img src="@/assets/Home/send.svg" @click="sendMessage()">
	  </div>
	</div>
  </template>
  
  <script setup>
  import { ref, nextTick } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import '@/styles/_chatbot.scss'
  
  const router = useRouter()
  const isOpen = ref(false)
  const messages = ref([])
  const newMessage = ref('')
  const chatLog = ref(null)
  const isTyping = ref(false)
  
  const VITE_ZEPHYR_API = import.meta.env.VITE_ZEPHYR_API
  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  const apiURL = `${VITE_API_BASE_URL}/api/zephyr/chat/`
  
  const toggleChat = () => {
	isOpen.value = !isOpen.value
	if (isOpen.value) scrollToBottom()
  }
  
  const closeChat = () => {
	isOpen.value = false
  }
  
  const sendMessage = async (quickQuestion) => {
	const messageToSend = quickQuestion ?? newMessage.value.trim()
	if (!messageToSend) return
  
	messages.value.push({ text: messageToSend, sender: 'user' })
	if (!quickQuestion) newMessage.value = ''
	scrollToBottom()
	isTyping.value = true
  
	try {
	  const response = await axios.post(apiURL, {
		message: messageToSend,
		history: messages.value.map(msg => ({
		  role: msg.sender === 'user' ? 'user' : 'assistant',
		  content: msg.text
		}))
	  })
  
	  if (response.data.weather_data) {
		messages.value.push({
		  sender: 'bot',
		  isWeatherData: true,
		  structured_data: response.data.structured_data || {},
		  text: response.data.response
		  
		})
		
	  } else {
		const reply = response.data.response
		isTyping.value = false
		await nextTick()
  
		messages.value.push({ text: '', sender: 'bot' })
		for (let i = 0; i < reply.length; i++) {
		  await new Promise(resolve => setTimeout(resolve, 20))
		  messages.value[messages.value.length - 1].text += reply[i]
		  scrollToBottom()
		}
	  }
	} catch (error) {
	  console.error('API Error:', error)
	  messages.value.push({ 
		text: 'Sorry, I encountered an error. Please try again.', 
		sender: 'bot' 
	  })
	} finally {
	  isTyping.value = false
	}
  }
  
  const navigateToDataDownload = (city) => {
	closeChat()
	router.push({ 
	  path: '/data/login',
	  query: { city: city.toLowerCase().replace(' ', '_') }
	})
  }
  
  const scrollToBottom = () => {
	nextTick(() => {
	  if (chatLog.value) chatLog.value.scrollTop = chatLog.value.scrollHeight
	})
  }
  </script>
  
  <style scoped lang="scss">
  @use '@/styles/_chatbot.scss' as chatbot;
  
  .weather-data {
	padding: 10px;
	border-radius: 8px;
	background: #f8f9fa;
	border: 1px solid #e9ecef;
	max-width: 100%;
	
	h4 {
	  margin: 0 0 10px 0;
	  color: #2c3e50;
	  font-size: 1.1em;
	}
	
	.weather-grid {
	  display: grid;
	  grid-template-columns: repeat(1, 1fr);
	  gap: 8px;
	  margin-bottom: 12px;
	}
	
	.weather-item {
	  display: flex;
	  justify-content: space-between;
	  
	  .label {
		font-weight: 500;
		color: #495057;
	  }
	  
	  .value {
		color: #212529;
		font-weight: 600;
	  }
	}
	
	.download-btn {
	  margin-top: 10px;
	  padding: 6px 12px;
	  background-color: #4CAF50;
	  color: white;
	  border: none;
	  border-radius: 4px;
	  cursor: pointer;
	  font-size: 0.9em;
	  
	  &:hover {
		background-color: #45a049;
	  }
	}
  }
  
  @media (max-width: 600px) {
	.weather-grid {
	  grid-template-columns: 1fr !important;
	}
  }
  </style>