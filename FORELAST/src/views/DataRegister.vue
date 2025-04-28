<template>
	<section class = "DataRegister">
		<div class = "RegForm">
			<div class = "register">
				<h2>Sign Up</h2>

				<form @submit.prevent = "submitForm">
					<div class = "name">
						<div class = "name-input">
							<label for = "last-name">Last Name:</label>
							<input type = "text" id = "last-name" name = "last-name" v-model = "lastName" required>
						</div>
						<div class = "name-input">
							<label for = "first-name">First Name:</label>
							<input type = "text" id = "first-name" name = "first-name" v-model = "firstName" required>
						</div>
					</div>

					<div class = "input">
						<div class = "input-group">
							<label for = "email">Email:</label>
							<input type = "text" id = "email" name = "email" v-model = "email" required>
						</div>
						<div class = "input-group">
							<label for = "password">Password:</label>
							<input type = "password" id = "password" name = "password" v-model = "password" required>
						</div>
						<div class = "input-group">
							<label for = "confirm-password">Confirm Password:</label>
							<input type = "password" id = "confirm-password" name = "confirm-password" v-model = "confirmPassword" required>
						</div>
						<div class = "input-group">
							<label for = "institution">Institution:</label>
							<input type = "text" id = "institution" name = "institution" v-model = "institution">
						</div>
						<p class = "validation-message">{{ validationMessage }}</p>
					</div>

					<div class = "terms">
						<input type = "checkbox" id = "terms" v-model = "termsAccepted" required>
						<label for = "terms">I agree to the following <router-link to = "/terms" class = "link">terms and conditions.</router-link></label>
					</div>

					<div class = "sub">
						<button type = "submit" class = "btn">
							Submit
						</button>
					</div>
				</form>

				<div class = "txt">
					<div class = "reg">
						Already have an account? <router-link to = "/data">Log in.</router-link>
					</div>
				</div>

			</div>
		</div>
	</section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const lastName = ref('')
const firstName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const institution = ref('')
const termsAccepted = ref(false)
const validationMessage = ref('')

const submitForm = async () => {
	if (password.value !== confirmPassword.value) {
		validationMessage.value = 'Passwords do not match!'
		return;
	}
	
	if (!termsAccepted.value) {
		validationMessage.value = 'You must agree to the terms and conditions.'
	}

	const formData = {
		last_name: lastName.value,
		first_name: firstName.value,
		email: email.value,
		password: password.value,
		institution: institution.value,
	};

	try {
		const response = await axios.post('http://localhost:8000/api/register/', formData)
		if (response.status === 201) {
		alert('Registration successful')
			// It should redirect to the .csv table.
		}
	} catch (error) {
		alert('Error: ' + error.response.data.detail || 'Something went wrong');
	}
}

</script>

<style lang = "scss" scoped>
@use "@/styles/_DataRegister_mixin.scss" as mixins;

.DataRegister {
    @include mixins.DataRegister;
}
</style>