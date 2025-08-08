<template>
  <div class="login-container">
    <div class="login-wrapper">
      <!-- Background Pattern -->
      <div class="background-pattern"></div>
      
      <!-- Login Card -->
      <div class="login-card">
        <!-- Header with Bühler Branding -->
        <div class="login-header">
          <div class="brand-logo">
            <div class="brand-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <div class="brand-text">
              <h1 class="brand-title">Bühler</h1>
              <p class="brand-subtitle">BRAM Calculator</p>
            </div>
          </div>
          <p class="login-description">Admin Access Required</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="login" class="login-form">
          <div class="input-group">
            <label for="username" class="input-label">
              <i class="fas fa-user input-icon"></i>
              Username
            </label>
            <div class="input-wrapper">
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                required
                class="input-field"
                placeholder="Enter your username"
                :disabled="loading"
              >
            </div>
          </div>

          <div class="input-group">
            <label for="password" class="input-label">
              <i class="fas fa-lock input-icon"></i>
              Password
            </label>
            <div class="input-wrapper">
              <input
                id="password"
                v-model="credentials.password"
                type="password"
                required
                class="input-field"
                placeholder="Enter your password"
                :disabled="loading"
              >
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            {{ error }}
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="loading"
            class="login-button"
          >
            <span v-if="loading" class="button-content loading">
              <div class="spinner"></div>
              Signing in...
            </span>
            <span v-else class="button-content">
              <i class="fas fa-sign-in-alt"></i>
              Sign In
            </span>
          </button>
        </form>

        <!-- Demo credentials removed for production -->
      </div>
    </div>
  </div>
</template>

<script setup>
// Define page meta for guest-only access
definePageMeta({
  layout: false,
  middleware: 'guest'
})

// Set page title
useHead({
  title: 'Login - Bühler BRAM Calculator',
  meta: [
    {
      name: 'description',
      content: 'Admin login for Bühler BRAM Calculator - Calculate your potential return on investment'
    }
  ]
})

// Reactive data
const credentials = ref({
  username: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

// Use auth composable
const { login: authLogin } = useAuth()

// Login function
const login = async () => {
  loading.value = true
  error.value = ''

  try {
    await authLogin(credentials.value)
    // Redirect to ROI Calculator
    await navigateTo('/')
  } catch (err) {
    error.value = err?.data?.message || err.statusMessage || 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* CSS Variables - Using Bühler Colors */
:root {
  --buhler-primary: #009B91;
  --buhler-primary-50: #E0F7F5;
  --buhler-primary-100: #B2EBE7;
  --buhler-primary-200: #80DED8;
  --buhler-primary-300: #4DD0C8;
  --buhler-primary-400: #26C6BD;
  --buhler-primary-500: #009B91;
  --buhler-primary-600: #008C83;
  --buhler-primary-700: #007D75;
  --buhler-primary-800: #006E67;
  --buhler-primary-900: #005F59;
}

/* Main Container */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--buhler-primary-50) 0%, #f8fafc 50%, var(--buhler-primary-100) 100%);
  position: relative;
  overflow: hidden;
}

.login-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
}

/* Background Pattern */
.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
  background-image: 
    radial-gradient(circle at 25% 25%, var(--buhler-primary) 2px, transparent 2px),
    radial-gradient(circle at 75% 75%, var(--buhler-primary) 1px, transparent 1px);
  background-size: 60px 60px;
  background-position: 0 0, 30px 30px;
  z-index: 1;
  pointer-events: none; /* Wichtig: Verhindert dass das Pattern Klicks abfängt */
}

/* Login Card */
.login-card {
  background: white;
  border-radius: 20px;
  box-shadow: 
    0 20px 25px -5px rgba(0, 155, 145, 0.1),
    0 10px 10px -5px rgba(0, 155, 145, 0.04),
    0 0 0 1px rgba(0, 155, 145, 0.05);
  padding: 2.5rem;
  position: relative;
  z-index: 20;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--buhler-primary), var(--buhler-primary-300));
}

/* Header Section */
.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.brand-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--buhler-primary), var(--buhler-primary-600));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 155, 145, 0.2);
}

.brand-icon i {
  font-size: 1.75rem;
  color: white;
}

.brand-text {
  text-align: left;
}

.brand-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1;
}

.brand-subtitle {
  font-size: 1rem;
  color: var(--buhler-primary);
  margin: 0.25rem 0 0 0;
  font-weight: 500;
}

.login-description {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
}

/* Form Styles */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #334155;
  font-size: 0.875rem;
}

.input-icon {
  color: var(--buhler-primary);
  font-size: 0.875rem;
  width: 16px;
}

.input-wrapper {
  position: relative;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.input-wrapper:hover {
  border-color: #cbd5e1;
}

.input-wrapper:focus-within {
  border-color: var(--buhler-primary);
  box-shadow: 0 0 0 3px rgba(0, 155, 145, 0.1);
  background: white;
}

.input-field {
  width: 100%;
  padding: 0.875rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  color: #1e293b;
  outline: none;
  border-radius: 10px;
}

.input-field::placeholder {
  color: #94a3b8;
}

.input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}

.error-message i {
  color: #ef4444;
}

/* Login Button */
.login-button {
  background: linear-gradient(135deg, var(--buhler-primary), var(--buhler-primary-600));
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--buhler-primary-600), var(--buhler-primary-700));
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(0, 155, 145, 0.25);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-content.loading {
  pointer-events: none;
}

/* Spinner Animation */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Demo Info Section */
.demo-info {
  margin-top: 2rem;
  padding: 1.25rem;
  background: var(--buhler-primary-50);
  border: 1px solid var(--buhler-primary-100);
  border-radius: 12px;
}

.demo-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--buhler-primary-700);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.demo-header i {
  color: var(--buhler-primary);
}

.demo-credentials {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.credential-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
}

.credential-label {
  color: #64748b;
  font-weight: 500;
}

.credential-value {
  background: white;
  color: var(--buhler-primary-700);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid var(--buhler-primary-200);
}

/* Responsive Design */
@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem;
    border-radius: 16px;
  }

  .brand-logo {
    flex-direction: column;
    gap: 0.75rem;
  }

  .brand-text {
    text-align: center;
  }

  .brand-title {
    font-size: 1.75rem;
  }
}

/* Focus Styles for Accessibility */
.login-button:focus-visible,
.input-field:focus-visible {
  outline: 2px solid var(--buhler-primary);
  outline-offset: 2px;
}

/* Smooth Transitions */
* {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
</style>