<template>
    <div class = "privacy-container">
    <h3>Privacy Policy</h3>
    <p>FORELAST values your privacy and is committed to protecting any personal information you provide. This Privacy Policy explains how we collect, use, and safeguard your data when using our system.</p>

    <h4>1. Information We Collect</h4>
    <p>Personal Information: If you create an account, we may collect your name, email, and contact details.</p>
    <p>Usage Data: We may collect information on how you interact with FORELAST, including browsing activities.</p>
    <p>Location Data: If permitted, we may access your location to provide localized weather updates.</p>

    <h4>2. How We Use Your Information</h4>
    <p>To provide and improve the accuracy of our weather forecasts.</p>
    <p>To analyze usage patterns and enhance user experience.</p>
    <p>To communicate system updates, alerts, or relevant weather-related information.</p>
    <p>We do not sell or share your personal information with third parties for marketing purposes.</p>

    <h4>3. Data Security</h4>
    <p>We implement appropriate security measures to protect user data from unauthorized access, alteration, or disclosure. </p>

    <h4>4. Third-Party Services</h4>
    <p>FORELAST may integrate with third-party weather data providers. These providers may collect data based on their own privacy policies, which we do not control.</p>

    <h4>5. Changes to This Privacy Policy</h4>
    <p>We may update this policy periodically. Users will be notified of any significant changes, and continued use of Forelast implies acceptance of the updated policy.</p>

    <h4>6. Contact Information</h4>
    <p>For any questions about this Privacy Policy, please contact us at forelastlstm@gmail.com.</p>
    </div>
  </template>
  
  <style scoped lang="scss">
@use "../styles/variables.scss" as *;

.privacy-container {
  height: 100%;
  width: 100%; /* Stretches across the full width */
  margin: 0 auto; /* Centers horizontally if needed */
  display: block; 
  padding: 1%;
  box-sizing: border-box;
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