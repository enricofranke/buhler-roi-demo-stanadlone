<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup>
// Set page title
useHead({
  title: 'Bühler BRAM Calculator',
  meta: [
    {
      name: 'description',
      content: 'Calculate your potential return on investment with Bühler\'s BRAM service solutions'
    },
    { name: 'robots', content: 'noindex, nofollow, noarchive' },
    { name: 'googlebot', content: 'noindex, nofollow, noarchive' },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    }
  ]
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Bühler Theme Colors - from ztheme.ts */
:root {
  --buhler-primary-50: #E0F7F5;
  --buhler-primary-100: #B2EBE7;
  --buhler-primary-200: #80DED8;
  --buhler-primary-300: #4DD0C8;
  --buhler-primary-400: #26C6BD;
  --buhler-primary-500: #009B91; /* Hauptfarbe */
  --buhler-primary-600: #008C83;
  --buhler-primary-700: #007D75;
  --buhler-primary-800: #006E67;
  --buhler-primary-900: #005F59;
  --buhler-primary-950: #003F3B;
  
  --buhler-primary: #009B91;
  --buhler-primary-light: #84f0e9;
  --buhler-surface: #ffffff;
  
  /* Text colors */
  --buhler-text-primary: #1e293b;
  --buhler-text-secondary: #64748b;
  --buhler-text-muted: #94a3b8;
  
  /* Background colors */
  --buhler-bg-main: #f8fafc;
  --buhler-bg-surface: #ffffff;
  --buhler-bg-input: #f8fafc;
  
  /* Border colors */
  --buhler-border-light: #e2e8f0;
  --buhler-border-medium: #cbd5e1;
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
  background: #f8fafc;
  color: #1e293b;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%; /* Prevent text scaling on iOS */
  touch-action: manipulation; /* Optimizes for touch */
}

#__nuxt {
  min-height: 100vh;
}

/* Reset default margins */
h1, h2, h3, h4, h5, h6, p {
  margin: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Utility classes */
.container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 1600px) {
  .container {
    max-width: 100%;
  }
}

/* Mobile-specific utilities */
@media (max-width: 768px) {
  .container {
    padding: 0 0.75rem;
  }
}

/* Safe area insets for devices with notches */
@supports (padding: max(0px)) {
  body {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}
</style>
