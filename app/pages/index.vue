<template>
  <div class="roi-calculator-page">
    <div class="page-container">
      <RoiCalculator />
    </div>
  </div>
</template>

<script setup>
// Auto-import from app/components/
</script>

<style scoped>
.roi-calculator-page {
  min-height: calc(100vh - 80px);
  background: #f8fafc;
}

.page-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0;
}

@media (max-width: 1600px) {
  .page-container {
    max-width: 100%;
  }
}
</style>