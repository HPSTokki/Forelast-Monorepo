<template>
  <div class="terms-container">
    <h3>Terms of Use</h3>
    <p>Welcome to FORELAST, a weather forecasting system developed to provide accurate and up-to-date weather information. By accessing and using Forelast, you agree to comply with the following Terms of Use. If you do not agree with these terms, please refrain from using our services.</p>

    <h4>1. Acceptance of Terms</h4>
    <p>By using FORELAST, you acknowledge that you have read, understood, and agreed to these Terms of Use. We reserve the right to update or modify these terms at any time, and continued use of the system constitutes acceptance of the changes.</p>

    <h4>2. Use of Services</h4>
    <p>FORELAST is designed to provide weather-related information for informational purposes only.</p>
    <p>You may use the system for personal, non-commercial purposes.</p>
    <p>Any misuse, such as attempting to disrupt the system, unauthorized access, or data manipulation, is strictly prohibited.</p>

    <h4>3. User Responsibilities</h4>
    <p>Users must ensure that they comply with all applicable laws while using the system.</p>
    <p>Users must not use the system to distribute false, misleading, or malicious information.</p>

    <h4>4. Limitations and Disclaimers</h4>
    <p>FORELAST strives to provide accurate weather forecasts, but we do not guarantee absolute accuracy due to the dynamic nature of weather conditions.</p>
    <p>The system may experience downtimes, errors, or inaccuracies.</p>

    <h4>5. Intellectual Property</h4>
    <p>All content, design, and software used in FORELAST are protected by copyright and other intellectual property laws.</p>
    <p>You may not reproduce, distribute, or modify any part of the system without prior authorization.</p>

    <h4>6. Contact Information</h4>
    <p>For inquiries regarding these Terms of Use, please contact us at forelastlstm@gmail.com.</p>
  </div>
</template>

<style scoped lang="scss">
@use "../styles/variables.scss" as *;

.terms-container {
  width: 100%;
  box-sizing: border-box;
  padding: 2%;
  display: block; 
  border-radius: $border-radius;
  box-shadow: $box-shadow;
  font-family: $primary-font;
  background-color: $panel-color;
  color: $font-color; 
}

h3 {
  text-align: center;
  color: $font-color;
  text-shadow: $text-shadow;
}

h4 {
  
  color: $font-color;
}

p {
  font-size: 0.95rem;
  line-height: 1.4;
}
</style>