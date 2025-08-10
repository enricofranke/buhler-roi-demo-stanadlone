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
            <div class="logo-section">
              <NuxtImg
                class="brand-logo-img"
                src="/images/logo.svg"
                alt="Bühler"
                width="180"
                height="auto"
              />
            </div>
            <div class="title-section">
              <div class="logo-text">
                <span class="logo-bram">BRAM</span><span class="logo-calculator">Calculator</span>
              </div>
            </div>
          </div>
          <p class="login-description">Admin Access Required</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="login" class="login-form">
          <div class="input-group">
            <div class="input-wrapper">
              <input
                id="username"
                v-model="credentials.username"
                type="text"
                required
                class="input-field"
                placeholder="Username *"
                :disabled="loading"
                autocomplete="username"
                inputmode="text"
                spellcheck="false"
                autocapitalize="none"
                autocorrect="off"
              >
            </div>
          </div>

          <div class="input-group">
            <div class="input-wrapper with-toggle">
              <input
                id="password"
                v-model="credentials.password"
                :type="passwordFieldType"
                required
                class="input-field"
                placeholder="Password *"
                :disabled="loading"
                autocomplete="current-password"
                inputmode="text"
                spellcheck="false"
                autocapitalize="none"
                autocorrect="off"
              >
              <button
                type="button"
                class="toggle-visibility"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
                :disabled="loading"
              >
                <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Remember me and Forgot password -->
          <div class="form-options">
            <label class="remember-checkbox">
              <input type="checkbox" v-model="rememberMe" class="checkbox-input">
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">Remember me</span>
            </label>
            <a href="#" class="forgot-link">Forgotten password?</a>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <i class="pi pi-exclamation-triangle"></i>
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
              Login
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
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
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
const rememberMe = ref(false)

// Password visibility
const showPassword = ref(false)
const passwordFieldType = computed(() => (showPassword.value ? 'text' : 'password'))

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
  background: 
    radial-gradient(circle at 25% 25%, rgba(0, 155, 145, 0.12) 0%, transparent 70%),
    radial-gradient(circle at 75% 75%, rgba(0, 155, 145, 0.08) 0%, transparent 70%),
    radial-gradient(circle at 50% 10%, rgba(0, 155, 145, 0.06) 0%, transparent 60%),
    linear-gradient(135deg, #ffffff 0%, #f0fdfc 30%, #ffffff 70%, #ecfdf5 100%);
  position: relative;
  overflow: hidden;
}



.login-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
}

/* Background Pattern */
.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.02;
  background-image: 
    linear-gradient(90deg, rgba(0, 155, 145, 0.08) 1px, transparent 1px),
    linear-gradient(180deg, rgba(0, 155, 145, 0.08) 1px, transparent 1px);
  background-size: 60px 60px;
  z-index: 1;
  pointer-events: none;
}

/* Login Card */
.login-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 155, 145, 0.12),
    0 15px 25px -5px rgba(0, 155, 145, 0.08),
    0 0 0 1px rgba(0, 155, 145, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 2.5rem;
  position: relative;
  z-index: 20;
  overflow: hidden;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  transform: translateY(0);
  will-change: transform;
}

.login-card:hover {}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--buhler-primary), var(--buhler-primary-300));
  border-radius: 24px 24px 0 0;
}

/* Header Section */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  gap: 0.4rem; /* balanced space between logo and text */
}

.logo-section {
  display: flex;
  justify-content: center;
}

.brand-logo-img {
  flex-shrink: 0;
  filter: drop-shadow(0 4px 8px rgba(0, 155, 145, 0.15));
  display: block; /* remove inline image baseline gap */
  line-height: 1;
}

.title-section {
  display: flex;
  justify-content: center;
}

.logo-text {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.logo-bram {
  color: var(--buhler-primary);
  letter-spacing: -0.02em;
}

.logo-calculator {
  color: #1e293b;
  letter-spacing: -0.01em;
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
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Form Options */
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.75rem 0 0.25rem 0;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--buhler-primary);
  border-color: var(--buhler-primary);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  color: #475569;
  font-size: 0.9rem;
  font-weight: 500;
}

.forgot-link {
  color: var(--buhler-primary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.forgot-link:hover {
  color: var(--buhler-primary-600);
  text-decoration: underline;
}

.input-wrapper {
  position: relative;
  background: rgba(248, 250, 252, 0.8);
  border: 2px solid transparent;
  border-radius: 16px;
  transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.input-wrapper::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 2px;
  background: linear-gradient(135deg, #e2e8f0, #f1f5f9);
  border-radius: 16px;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
  -webkit-mask-composite: xor;
  transition: background 0.3s ease;
  pointer-events: none; /* ensure overlay does not block input interactions */
}

.input-wrapper:hover::before {}

.input-wrapper:hover {}

.input-wrapper:focus-within {
  background: white;
}

.input-wrapper:focus-within::before {
  background: linear-gradient(135deg, var(--buhler-primary), var(--buhler-primary-400));
}

.input-field {
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #1e293b;
  outline: none;
  border-radius: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.with-toggle .input-field {
  padding-right: 2.75rem;
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
  padding: 1.25rem 2rem;
  border-radius: 16px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  min-height: 3.5rem;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  box-shadow: 
    0 10px 15px -3px rgba(0, 155, 145, 0.2),
    0 4px 6px -2px rgba(0, 155, 145, 0.1);
  will-change: transform;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--buhler-primary-600), var(--buhler-primary-700));
  transform: translateY(-3px);
  box-shadow: 
    0 20px 25px -5px rgba(0, 155, 145, 0.3),
    0 10px 10px -5px rgba(0, 155, 145, 0.2);
}

.login-button:hover:not(:disabled)::before {
  transform: translateX(100%);
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



/* Password visibility toggle */
.toggle-visibility {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(0, 155, 145, 0.05);
  color: #64748b;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 12px;
  min-width: 2.75rem;
  min-height: 2.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  backdrop-filter: blur(10px);
}

.toggle-visibility:hover:not(:disabled) {
  color: var(--buhler-primary);
  background: rgba(0, 155, 145, 0.15);
  transform: translateY(-50%) scale(1.05);
}

.toggle-visibility:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
/* Tablet and smaller screens */
@media (max-width: 768px) {
  .login-container {
    padding: 1.5rem;
  }

  .login-wrapper {
    max-width: 100%;
  }

  .login-card {
    padding: 2rem;
  }
  
  .brand-logo {
    gap: 0.5rem;
  }
  
  .brand-logo-img {
    width: 150px;
  }
  
  .logo-text {
    font-size: 1.75rem;
  }
}

/* Mobile phones */
@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile browsers */
  }

  .login-card {
    padding: 1.5rem;
    border-radius: 16px;
    margin: 0;
    width: 100%;
  }

  .brand-logo {
    gap: 0.5rem;
  }

  .brand-logo-img {
    width: 140px;
  }

  .logo-text {
    font-size: 1.6rem;
  }

  .login-header {
    margin-bottom: 2rem;
  }

  .login-form {
    gap: 1.25rem;
  }

  .input-field {
    font-size: 16px; /* Prevents zoom on iOS */
    padding: 1rem;
  }

  .login-button {
    padding: 1.125rem;
    font-size: 1.05rem;
  }
}

/* Very small screens */
@media (max-width: 360px) {
  .login-container {
    padding: 0.75rem;
  }

  .login-card {
    padding: 1.25rem;
  }

  .brand-icon {
    width: 50px;
    height: 50px;
  }

  .brand-icon i {
    font-size: 1.5rem;
  }

  .brand-logo-img {
    width: 130px;
  }

  .logo-text {
    font-size: 1.4rem;
  }
}

/* Focus Styles for Accessibility */
.login-button:focus-visible,
.input-field:focus-visible {
  outline: 2px solid var(--buhler-primary);
  outline-offset: 2px;
}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  /* Disable hover effects on touch devices */
  .login-button:hover:not(:disabled) {
    transform: none;
    box-shadow: none;
  }
  
  .toggle-visibility:hover:not(:disabled) {
    background: transparent;
  }
  
  /* Better active states for touch */
  .login-button:active:not(:disabled) {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }
  
  .toggle-visibility:active:not(:disabled) {
    background: rgba(0, 155, 145, 0.15);
    transform: translateY(-50%) scale(0.95);
  }

  /* Reduce heavy effects on mobile */
  .login-card,
  .input-wrapper {
    backdrop-filter: none;
  }

  .login-card:hover,
  .input-wrapper:hover,
  .input-wrapper:focus-within {
    transform: none;
    box-shadow: none;
  }
}

/* Keyboard handling improvements */
@media (max-height: 600px) and (max-width: 768px) {
  /* Optimize for landscape mobile or small screens */
  .login-container {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 1rem;
  }
  
  .login-card {
    padding: 1.25rem;
  }
  
  .login-header {
    margin-bottom: 1.5rem;
  }
  
  .brand-icon {
    width: 45px;
    height: 45px;
  }
  
  .brand-title {
    font-size: 1.5rem;
  }
}

/* Prevent zoom on input focus for iOS */
@supports (-webkit-touch-callout: none) {
  .input-field {
    font-size: max(16px, 1rem); /* Prevents zoom on iOS */
  }
}

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .login-card,
  .login-button,
  .input-wrapper,
  .input-field,
  .toggle-visibility {
    transition: none !important;
  }

  .spinner {
    animation: none !important;
  }
}

/* Safe area support for devices with notches */
@supports (padding: max(0px)) {
  .login-container {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
}
</style>