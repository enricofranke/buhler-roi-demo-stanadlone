<template>
  <div class="results-container">
    <DowntimeImpact :calculations="calculations" :weight-unit="weightUnit" />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import DowntimeImpact from './DowntimeImpact.vue'

defineProps<{
  calculations: any
  weightUnit: 'kg' | 'lb' | ''
}>()
</script>

<style scoped>
.results-container { display: flex; flex-direction: column; gap: 1rem; }
</style>



