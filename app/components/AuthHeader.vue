<template>
  <header class="auth-header">
    <div class="header-container">
      <!-- Bühler Logo/Brand -->
      <div class="brand">
        <div class="brand-logo">
          <NuxtImg
            class="brand-logo-img"
            src="/images/logo.svg"
            alt="Bühler"
            width="100"
            height="auto"
          />
        </div>
        <div class="brand-text">
          <div class="brand-title">
            <span class="title-bram">BRAM</span><span class="title-calculator">Calculator</span>
          </div>
        </div>
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
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  align-items: center;
  gap: 1rem;
}

.brand-logo {
  flex-shrink: 0;
}

.brand-logo-img {
  filter: drop-shadow(0 2px 4px rgba(0, 155, 145, 0.1));
  display: block;
  line-height: 1;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-title {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
}

.title-bram {
  color: var(--buhler-primary);
  letter-spacing: -0.02em;
}

.title-calculator {
  color: #1e293b;
  letter-spacing: -0.01em;
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
  .auth-header {
    padding: 0.75rem 0;
    margin-bottom: 0.75rem;
  }
  
  .header-container {
    padding: 0 1rem;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.75rem;
  }
  
  .brand {
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }
  
  .brand-logo-img {
    width: 80px;
  }
  
  .brand-title {
    font-size: 1.125rem;
  }
  
  .user-info {
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
  }
  
  .welcome-text {
    font-size: 0.75rem;
    display: none; /* Hide welcome text on mobile to save space */
  }
  
  .logout-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    min-height: 44px; /* Touch target */
  }
}

@media (max-width: 480px) {
  .auth-header {
    padding: 0.5rem 0;
  }
  
  .header-container {
    padding: 0 0.75rem;
  }
  
  .brand-logo-img {
    width: 70px;
  }
  
  .brand-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .header-container {
    padding: 0 0.75rem;
  }
  
  .brand-title {
    font-size: 1.125rem;
  }
  
  .brand-subtitle {
    font-size: 0.7rem;
  }
  
  .logout-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.7rem;
  }
}
</style>