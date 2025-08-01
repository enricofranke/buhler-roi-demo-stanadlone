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
    }
  ]
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/primeicons@7.0.0/primeicons.css');

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
</style>
