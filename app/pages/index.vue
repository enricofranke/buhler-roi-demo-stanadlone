<template>
  <div class="roi-calculator-page">
    <!-- Authentication Header -->
    <AuthHeader />
    
    <div class="page-container">
      <RoiCalculator />
    </div>
  </div>
</template>

<script setup>
// This page is now protected by the global auth middleware
definePageMeta({
  // No middleware needed - global middleware handles auth
})

// Auto-import from app/components/
</script>

<style scoped>
.roi-calculator-page {
  min-height: calc(100vh - 80px);
  min-height: calc(100dvh - 80px); /* Dynamic viewport height for mobile */
  background: #f8fafc;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 1400px) {
  .page-container {
    max-width: 100%;
    padding: 1rem;
  }
}

/* Mobile Optimizations */
@media (max-width: 768px) {
  .roi-calculator-page {
    min-height: calc(100vh - 60px);
    min-height: calc(100dvh - 60px);
    background: #f8fafc;
  }
  
  .page-container {
    padding: 0;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .roi-calculator-page {
    min-height: calc(100vh - 50px);
    min-height: calc(100dvh - 50px);
  }
}

/* Safe area support for devices with notches */
@supports (padding: max(0px)) {
  .roi-calculator-page {
    padding-top: max(0px, env(safe-area-inset-top));
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}
</style>