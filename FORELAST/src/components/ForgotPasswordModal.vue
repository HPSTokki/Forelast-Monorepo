<template>
    <div>
        <div v-if="isOpen" class="modal-overlay">
            <div class="modal">
                <div class="modal-header">
                    <div class="header-text">
                        <h3 v-if="step === 'email' || step === 'otp'">Forgot your password?</h3>
                        <h3 v-else-if="step === 'reset'">Create New Password</h3>
                        <p v-if="step === 'email'">
                            Enter the email address associated with your account to receive a One-Time Password (OTP).
                        </p>
                        <p v-if="step === 'otp'">
                            Check your inbox and enter the One-Time Password we sent to your email.
                        </p>
                        <p v-if="step === 'reset'">
                            Your new password must contain at least 8 characters, including a mix of letters, numbers, and special characters.
                        </p>
                    </div>
                    <button @click="closeModal">✖</button>
                </div>
                <div class="modal-body">
                    <div class="email-group" v-if="step === 'email'">
                        <input
                            v-model="email"
                            type="email"
                            placeholder="Enter your email"
                        />
                        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                    </div>
                    <div class="otp-input-group" v-else-if="step === 'otp'">
                        <div class="otp-boxes">
                            <input
                                v-for="(digit, index) in otpDigits"
                                :key="index"
                                ref="otpRefs"
                                type="text"
                                maxlength="1"
                                class="otp-box"
                                v-model="otpDigits[index]"
                                @input="handleInput(index)"
                                @keydown.backspace="handleBackspace(index)"
                            />
                        </div>
                        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                        <span v-if="isResendDisabled">({{ otpTimer }}s)</span>
                    </div>
                    <div class="reset-password-group" v-else-if="step === 'reset'">
                        <div class="group-item">
                            <label for="newPassword">New Password</label>
                            <div class="input-with-icon">
                                <input
                                    v-model="newPassword"
                                    :type="showNewPassword ? 'text' : 'password'"
                                    placeholder="Enter new password"
                                />
                                <img
                                    :src="showNewPassword ? showPasswordIcon : hidePasswordIcon"
                                    alt="Toggle password visibility"
                                    class="toggle-icon"
                                    @click="showNewPassword = !showNewPassword"
                                />
                            </div>
                        </div>
                        <div class="group-item">
                            <label for="confirmPassword">Confirm New Password</label>
                            <div class="input-with-icon">
                                <input
                                    v-model="confirmPassword"
                                    :type="showConfirmPassword ? 'text' : 'password'"
                                    placeholder="Confirm new password"
                                />
                                <img
                                    :src="showConfirmPassword ? showPasswordIcon : hidePasswordIcon"
                                    alt="Toggle password visibility"
                                    class="toggle-icon"
                                    @click="showConfirmPassword = !showConfirmPassword"
                                />
                            </div>
                        </div>
                        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
                        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        v-if="step === 'email'"
                        @click="submitEmail"
                    >
                    Send OTP
                    </button>
                    <button
                        v-if="step === 'otp'"
                        @click="verifyOtp"
                    >
                    Verify OTP
                    </button>
                    <button
                        class="resendOtp"
                        v-if="step === 'otp'"
                        @click="requestOtp"
                        :disabled="isResendDisabled" 
                    >
                    Resend OTP
                    </button>
                    <button
                        v-if="step === 'reset'"
                        @click="resetPassword"
                    >
                    Save New Password
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import showPasswordIcon from '@/assets/DataSection/show-password.svg';
import hidePasswordIcon from '@/assets/DataSection/hide-password.svg';

const isOpen = ref(true);
const step = ref('email');
const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const otpDigits = ref(Array(6).fill(''));
const otpRefs = ref([]);

const newPassword = ref('');
const confirmPassword = ref('');

const emit = defineEmits(['close']);

const otpTimer = ref(60);
const isResendDisabled = ref(false); 
let intervalId = null;

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function submitEmail() {
    errorMessage.value = '';
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        errorMessage.value = 'Email is required.';
        return;
    }
    if (!emailPattern.test(email.value.trim())) {
        errorMessage.value = 'Please enter a valid email address.';
        return;
    }
    
    try {
        const formData = new FormData();
        formData.append('email', email.value.trim());

        const res = await fetch(`${API_BASE}/api/forgot-password/`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            step.value = 'otp';
            startOtpTimer();
        } else {
            errorMessage.value = data.message || 'Failed to send OTP.';
        }
    } catch (err) {
        errorMessage.value = 'Something went wrong.';
    }
}

function startOtpTimer() {
    isResendDisabled.value = true;
    otpTimer.value = 60;

    intervalId = setInterval(() => {
        otpTimer.value--;

        if (otpTimer.value <= 0) {
            clearInterval(intervalId);
            isResendDisabled.value = false;
        }
    }, 1000);
}

function requestOtp() {
    if (isResendDisabled.value) return;
    submitEmail(); 
    startOtpTimer();
}

function handleInput(index) {
    const current = otpDigits.value[index];
    if (current && index < otpDigits.value.length - 1) {
        otpRefs.value[index + 1].focus();
    }
}

function handleBackspace(index) {
    if (!otpDigits.value[index] && index > 0) {
        otpRefs.value[index - 1].focus();
    }
}

async function verifyOtp() {
    const otp = otpDigits.value.join('');
    errorMessage.value = '';

    if (otp.length !== 6) {
        errorMessage.value = 'Please enter the complete 6-digit OTP.';
        return;
    }

    try {
        const formData = new FormData();
        formData.append('email', email.value.trim());
        formData.append('otp', otp);

        const res = await fetch(`${API_BASE}/api/verify-otp/`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            step.value = 'reset';
        } else {
            errorMessage.value = data.message || 'Invalid OTP.';
        }
    } catch (err) {
        errorMessage.value = 'Something went wrong.';
    }
}

async function resetPassword() {
    if (newPassword.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match.';
        return;
    }

    if (!newPassword.value || !confirmPassword.value) {
        errorMessage.value = 'Please fill out both fields.';
        return;
    }

    try {
        const formData = new FormData();
        formData.append('email', email.value.trim());
        formData.append('new_password', newPassword.value);
        formData.append('confirm_password', confirmPassword.value);

        const res = await fetch(`${API_BASE}/api/reset-password/`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            successMessage.value = 'Password successfully changed!'
            setTimeout(() => {
                closeModal();
            }, 4000)
        } else {
            errorMessage.value = data.message || 'Failed to reset password.';
        }
    } catch (err) {
        errorMessage.value = 'Something went wrong.';
    }
}

function closeModal() {
    emit('close');
}

onUnmounted(() => {
    if (intervalId) clearInterval(intervalId);
});
</script>






<style scoped lang = "scss">
@use '@/styles/_forgotPasswordModal.scss';
</style>