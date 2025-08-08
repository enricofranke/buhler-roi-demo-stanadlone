<template>
  <header class="auth-header">
    <div class="header-container">
      <!-- Bühler Logo/Brand -->
      <div class="brand">
        <h1 class="brand-title">Bühler</h1>
        <span class="brand-subtitle">ROI Calculator</span>
      </div>

      <!-- User Info & Logout -->
      <div class="user-section">
        <div v-if="loggedIn && user" class="user-info">
          <span class="welcome-text">Welcome, {{ user.name || user.username }}</span>
          <button 
            @click="logout"
            :disabled="loggingOut"
            class="logout-btn"
          >
            <svg v-if="loggingOut" class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loggingOut ? 'Logging out...' : 'Logout' }}
          </button>
        </div>
        <div v-else>
          <NuxtLink to="/login" class="logout-btn" style="background:#059669">Login</NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
// Use auth composable
const { user, loggedIn, logout: authLogout } = useAuth()
const loggingOut = ref(false)

// Logout function
const logout = async () => {
  loggingOut.value = true
  
  try {
    await authLogout()
    await navigateTo('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Still redirect even if logout fails
    await navigateTo('/login')
  } finally {
    loggingOut.value = false
  }
}
</script>

<style scoped>
.auth-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
  margin-bottom: 2rem;
}

.header-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
  margin: 0;
}

.brand-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-text {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover:not(:disabled) {
  background: #dc2626;
}

.logout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .brand {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .user-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>