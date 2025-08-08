<template>
  <div class="roi-results">
    <!-- Current Downtime Impact -->
    <div class="metrics-section">
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

      <!-- Total Impact Summary -->
      <div class="total-summary">
        <h5 class="summary-subtitle">Total Combined Impact</h5>
        <div class="results-grid">
          <div class="metric-card total-card">
            <div class="metric-icon">
              <i class="pi pi-clock" aria-hidden="true"></i>
            </div>
            <div class="metric-content">
              <span class="metric-label">Total Annual Downtime</span>
              <span class="metric-value">{{ formatNumber(calculations.annualDowntimeHours) }}</span>
              <span class="metric-sublabel">Hours lost per year</span>
            </div>
          </div>

          <div class="metric-card total-card">
            <div class="metric-icon">
              <i class="pi pi-box" aria-hidden="true"></i>
            </div>
            <div class="metric-content">
              <span class="metric-label">Total Production Loss</span>
              <span class="metric-value">{{ formatNumber(calculations.annualProductionLoss) }}</span>
              <span class="metric-sublabel">{{ weightUnitLabel }} lost per year</span>
            </div>
          </div>

          <div class="metric-card total-card">
            <div class="metric-icon">
              <i class="pi pi-dollar" aria-hidden="true"></i>
            </div>
            <div class="metric-content">
              <span class="metric-label">Total Financial Loss</span>
              <span class="metric-value">{{ formatCurrency(calculations.annualRevenueLoss) }}</span>
              <span class="metric-sublabel">Revenue lost annually</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Impact of BRAM (only show if BRAM data provided) -->
    <div v-if="showBramImpact" class="metrics-section">
      <h4 class="section-header">Impact of BRAM</h4>
      <div class="results-grid">
        <div class="metric-card success">
          <div class="metric-icon">
            <i class="pi pi-clock" aria-hidden="true"></i>
          </div>
          <div class="metric-content">
            <span class="metric-label">Downtime Reduction</span>
            <span class="metric-value">{{ formatNumber(calculations.additionalUptimeHours) }}</span>
            <span class="metric-sublabel">Hours saved annually</span>
          </div>
        </div>

        <div class="metric-card success">
          <div class="metric-icon">
            <i class="pi pi-box" aria-hidden="true"></i>
          </div>
          <div class="metric-content">
            <span class="metric-label">Reduction of Production Loss</span>
            <span class="metric-value">{{ formatNumber(calculations.additionalOutput) }}</span>
            <span class="metric-sublabel">kg saved per year</span>
          </div>
        </div>

        <div class="metric-card success">
          <div class="metric-icon">
            <i class="pi pi-chart-line" aria-hidden="true"></i>
          </div>
          <div class="metric-content">
            <span class="metric-label">Reduction of Downtime Costs</span>
            <span class="metric-value">{{ formatCurrency(calculations.potentialSavings) }}</span>
            <span class="metric-sublabel">Additional margin per year</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ROI Calculation (only show if BRAM data provided) -->
    <div v-if="showBramImpact" class="metrics-section">
      <h4 class="section-header">ROI Calculation</h4>
      <div class="results-grid">
        <div class="metric-card primary">
          <div class="metric-icon">
            <i class="pi pi-percentage" aria-hidden="true"></i>
          </div>
          <div class="metric-content">
            <span class="metric-label">Return on Investment</span>
            <span class="metric-value">{{ formatPercentage(calculations.roi) }}</span>
            <span class="metric-sublabel">Annual ROI</span>
          </div>
        </div>

        <div class="metric-card info">
          <div class="metric-icon">
            <i class="pi pi-calendar" aria-hidden="true"></i>
          </div>
          <div class="metric-content">
            <span class="metric-label">Payback Period</span>
            <span class="metric-value">{{ formatMonths(calculations.paybackMonths) }}</span>
            <span class="metric-sublabel">ROI in years</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Financial Summary (only show if BRAM data provided) -->
    <div v-if="showBramImpact" class="financial-summary">
      <h4 class="summary-title">
        <i class="pi pi-chart-bar" aria-hidden="true"></i>
        Detailed Financial Analysis
      </h4>
      
      <!-- Current Situation -->
      <div class="summary-section">
        <h5 class="summary-section-title">Current Downtime Impact</h5>
        <div class="summary-items">
          <div class="summary-item">
            <span class="summary-label">Annual Revenue Loss</span>
            <span class="summary-value negative">{{ formatCurrency(calculations.annualRevenueLoss) }}</span>
          </div>
        </div>
      </div>

      <!-- BRAM Impact -->
      <div class="summary-section">
        <h5 class="summary-section-title">With BRAM Service</h5>
        <div class="summary-items">
          <div class="summary-item">
            <span class="summary-label">Estimated Reduction of Downtime Costs</span>
            <span class="summary-value positive">{{ formatCurrency(calculations.potentialSavings) }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Annual Service Contract Cost</span>
            <span class="summary-value negative">{{ formatCurrency(serviceContractCost || 0) }}</span>
          </div>
          <div class="summary-item total">
            <span class="summary-label">Net Annual Benefit</span>
            <span class="summary-value" :class="{positive: calculations.netSavings > 0, negative: calculations.netSavings < 0}">
              {{ formatCurrency(calculations.netSavings) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface RoiCalculations {
  // Planned Downtime
  annualPlannedDowntimeHours: number
  annualPlannedProductionLoss: number
  annualPlannedRevenueLoss: number
  
  // Unplanned Downtime
  annualUnplannedDowntimeHours: number
  annualUnplannedProductionLoss: number
  annualUnplannedRevenueLoss: number
  
  // Combined Totals
  annualDowntimeHours: number
  annualProductionLoss: number
  annualRevenueLoss: number
  
  // BRAM Impact
  additionalUptimeHours: number
  additionalOutput: number
  potentialSavings: number
  netSavings: number
  roi: number
  paybackMonths: number
}

// Props
const props = defineProps<{
  calculations: RoiCalculations
  weightUnit: 'kg' | 'lb' | ''
  serviceContractCost?: number | null
}>()

// Computed
const weightUnitLabel = computed(() => props.weightUnit || 'unit')

const showBramImpact = computed(() => {
  return props.serviceContractCost !== null && props.serviceContractCost !== undefined
})

// Formatting helpers
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

const formatPercentage = (value: number): string => {
  return value.toFixed(0) + '%'
}

const formatMonths = (value: number): string => {
  if (!isFinite(value)) return 'N/A'
  if (value < 12) return value.toFixed(1) + ' months'
  return (value / 12).toFixed(1) + ' years'
}
</script>

<style scoped>
.roi-results {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.metrics-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
  margin: 0;
  padding: 0 0 0.75rem 0;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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

.metric-card.primary .metric-icon {
  background: rgba(0, 155, 145, 0.1);
  color: var(--buhler-primary);
}

.metric-card.success .metric-icon {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.metric-card.warning .metric-icon {
  background: rgba(251, 146, 60, 0.1);
  color: #fb923c;
}

.metric-card.info .metric-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.metric-card.danger .metric-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.metric-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}

.metric-sublabel {
  font-size: 0.75rem;
  color: #94a3b8;
}

.metric-sublabel-top {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

/* Total Summary Styles */
.total-summary {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
}

.summary-subtitle {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  text-align: center;
}

.metric-card.total-card {
  border: 2px solid var(--buhler-primary);
  background: rgba(0, 155, 145, 0.02);
}

.metric-card.total-card .metric-icon {
  background: rgba(0, 155, 145, 0.1);
  color: var(--buhler-primary);
}

.metric-card.total-card .metric-value {
  color: var(--buhler-primary);
  font-weight: 700;
}

/* Financial Summary */
.financial-summary {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
}

.summary-title i {
  color: var(--buhler-primary);
}

.summary-section {
  margin-bottom: 1.5rem;
}

.summary-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.summary-item.total {
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  margin-top: 0.5rem;
}

.summary-label {
  font-weight: 500;
  color: #64748b;
}

.summary-item.total .summary-label {
  font-weight: 600;
  color: #1e293b;
  font-size: 1.125rem;
}

.summary-value {
  font-weight: 600;
  font-size: 1.125rem;
  color: #1e293b;
}

.summary-value.positive {
  color: #22c55e;
}

.summary-value.negative {
  color: #ef4444;
}

.summary-item.total .summary-value {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Responsive Design */
@media (max-width: 768px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
  
  .metric-card {
    padding: 1rem;
  }
  
  .metric-icon {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
  
  .metric-value {
    font-size: 1.5rem;
  }
}
</style>