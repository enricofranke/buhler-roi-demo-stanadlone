<template>
<div class="downtime-card">
    <h4 class="section-header">Downtime Impact</h4>

    <!-- Downtime Hours -->
    <div class="results-grid">
      <div class="metric-card warning">
        <div class="metric-icon">
          <i class="pi pi-calendar" aria-hidden="true"></i>
        </div>
        <div class="metric-content">
          <span class="metric-label">Annual Planned Downtime</span>
          <span class="metric-value">{{ formatNumber(calculations.annualPlannedDowntimeHours) }}</span>
          <span class="metric-sublabel">Hours per year</span>
        </div>
      </div>

      <div class="metric-card danger">
        <div class="metric-icon">
          <i class="pi pi-exclamation-triangle" aria-hidden="true"></i>
        </div>
        <div class="metric-content">
          <span class="metric-label">Annual Unplanned Downtime</span>
          <span class="metric-value">{{ formatNumber(calculations.annualUnplannedDowntimeHours) }}</span>
          <span class="metric-sublabel">Hours per year</span>
        </div>
      </div>
    </div>

    <!-- Production Loss -->
    <div class="results-grid">
      <div class="metric-card info">
        <div class="metric-icon">
          <i class="pi pi-box" aria-hidden="true"></i>
        </div>
        <div class="metric-content">
          <span class="metric-label">Annual Production Loss</span>
          <span class="metric-sublabel-top">(Through planned downtime)</span>
          <span class="metric-value">{{ formatNumber(calculations.annualPlannedProductionLoss) }}</span>
          <span class="metric-sublabel">{{ weightUnitLabel }} lost per year</span>
        </div>
      </div>

      <div class="metric-card info">
        <div class="metric-icon">
          <i class="pi pi-box" aria-hidden="true"></i>
        </div>
        <div class="metric-content">
          <span class="metric-label">Annual Production Loss</span>
          <span class="metric-sublabel-top">(Through unplanned downtime)</span>
          <span class="metric-value">{{ formatNumber(calculations.annualUnplannedProductionLoss) }}</span>
          <span class="metric-sublabel">{{ weightUnitLabel }} lost per year</span>
        </div>
      </div>
    </div>

    <!-- Financial Loss -->
    <div class="results-grid">
      <div class="metric-card warning">
        <div class="metric-icon">
          <i class="pi pi-dollar" aria-hidden="true"></i>
        </div>
        <div class="metric-content">
          <span class="metric-label">Annual Financial Loss</span>
          <span class="metric-sublabel-top">(Through planned downtime)</span>
          <span class="metric-value">{{ formatCurrency(calculations.annualPlannedRevenueLoss) }}</span>
          <span class="metric-sublabel">Revenue lost annually</span>
        </div>
      </div>

      <div class="metric-card danger">
        <div class="metric-icon">
          <i class="pi pi-dollar" aria-hidden="true"></i>
        </div>
        <div class="metric-content">
          <span class="metric-label">Annual Financial Loss</span>
          <span class="metric-sublabel-top">(Through unplanned downtime)</span>
          <span class="metric-value">{{ formatCurrency(calculations.annualUnplannedRevenueLoss) }}</span>
          <span class="metric-sublabel">Revenue lost annually</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface RoiCalculations {
  annualPlannedDowntimeHours: number
  annualPlannedProductionLoss: number
  annualPlannedRevenueLoss: number
  annualUnplannedDowntimeHours: number
  annualUnplannedProductionLoss: number
  annualUnplannedRevenueLoss: number
}

const props = defineProps<{
  calculations: RoiCalculations
  weightUnit: 'kg' | 'lb' | ''
}>()

const weightUnitLabel = computed(() => props.weightUnit || 'unit')

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}
</script>

<style scoped>
.downtime-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.section-header {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000000;
  margin: 0 0 1rem 0;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  font-size: 1.5rem;
}

.metric-card.warning .metric-icon { background: rgba(251,146,60,0.1); color: #fb923c; }
.metric-card.danger  .metric-icon { background: rgba(239,68,68,0.1);  color: #ef4444; }
.metric-card.info    .metric-icon { background: rgba(59,130,246,0.1); color: #3b82f6; }

.metric-content { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
.metric-label { font-size: 0.875rem; color: #64748b; font-weight: 500; }
.metric-value { font-size: 1.5rem; font-weight: 700; color: #1e293b; line-height: 1; }
.metric-sublabel { font-size: 0.75rem; color: #94a3b8; }
.metric-sublabel-top { font-size: 0.75rem; color: #64748b; font-weight: 500; margin-bottom: 0.25rem; }

/* Mobile Responsive Design */
@media (max-width: 768px) {
  .downtime-card {
    padding: 1.5rem;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .metric-card {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .downtime-card {
    padding: 1.25rem;
    border-radius: 12px;
  }
  
  .section-header {
    font-size: 1.125rem;
    text-align: center;
  }
  
  .metric-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
    padding: 1rem;
  }
  
  .metric-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
  
  .metric-value {
    font-size: 1.25rem;
  }
  
  .metric-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 360px) {
  .downtime-card {
    padding: 1rem;
  }
  
  .metric-card {
    padding: 0.875rem;
  }
  
  .metric-icon {
    width: 40px;
    height: 40px;
    font-size: 1.125rem;
  }
  
  .metric-value {
    font-size: 1.125rem;
  }
}
</style>


